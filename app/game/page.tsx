"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Epilogue, Azeret_Mono, Newsreader } from "next/font/google";
import { ClaudeAI } from "@/components/ClaudeAI";
import { GeminiAI } from "@/components/GeminiAI";
import { OpenAI } from "@/components/OpenAI";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});
const mono = Azeret_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400"],
  display: "swap",
});

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelId = "gpt-5.4" | "claude-4.6-opus" | "gemini-3.1-pro";
type NotifType = "round-start" | "correct" | "wrong" | "round-over";
type Phase = "playing" | "game-over";

interface GuessRecord {
  model: ModelId;
  usedSkill: boolean;
  result: "correct" | "wrong";
}

interface Notification {
  type: NotifType;
  round: number;
  guesses: GuessRecord[];
  correctModel?: ModelId;
}

interface RoundResult {
  solved: boolean;
  guessesUsed: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface ModelDef {
  id: ModelId;
  label: string;
  maker: string;
  color: string;
  bgColor: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const MODELS: ModelDef[] = [
  {
    id: "claude-4.6-opus",
    label: "Claude 4.6 Opus",
    maker: "Anthropic",
    color: "#D97757",
    bgColor: "#F7F0E6",
    Icon: ClaudeAI,
  },
  {
    id: "gpt-5.4",
    label: "GPT 5.4",
    maker: "OpenAI",
    color: "#171717",
    bgColor: "#F5F5F5",
    Icon: OpenAI,
  },
  {
    id: "gemini-3.1-pro",
    label: "Gemini 3.1 Pro",
    maker: "Google",
    color: "#3689FF",
    bgColor: "#EEF4FF",
    Icon: GeminiAI,
  },
];

const ROUNDS: { model: ModelId; usedSkill: boolean }[] = [
  { model: "gpt-5.4", usedSkill: false },
  { model: "claude-4.6-opus", usedSkill: true },
  { model: "gemini-3.1-pro", usedSkill: false },
];

const MAX_GUESSES = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function modelById(id: ModelId): ModelDef {
  return MODELS.find((m) => m.id === id)!;
}

// ─── Skill Icon ───────────────────────────────────────────────────────────────
// Paintbrush: active = purple, inactive = gray

function SkillIcon({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  const color = active ? "#7C3AED" : "#94a3b8";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "size-4"}
      aria-label={active ? "UI skill used" : "UI skill not used"}
    >
      <path d="m14.622 17.897-10.68-2.913" />
      <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
      <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" />
    </svg>
  );
}

// ─── Model Badge (used in HUD + game-over) ────────────────────────────────────

function ModelBadge({
  model,
  showSkill,
  skill,
  size = "sm",
}: {
  model: ModelDef;
  showSkill?: boolean;
  skill?: boolean;
  size?: "sm" | "lg";
}) {
  const { Icon, color, bgColor, label } = model;
  const isLg = size === "lg";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        mono.className,
        isLg ? "text-sm font-semibold" : "text-xs font-semibold",
      ].join(" ")}
      style={{ borderColor: color, backgroundColor: bgColor, color }}
    >
      <Icon
        className={isLg ? "size-4 shrink-0" : "size-3 shrink-0"}
        style={{ color }}
      />
      {label}
      {showSkill && (
        <SkillIcon active={!!skill} className={isLg ? "size-4" : "size-3"} />
      )}
    </span>
  );
}

// ─── Feedback Table (shared header + one row per guess) ──────────────────────

function FeedbackTable({
  records,
  showResult = true,
}: {
  records: GuessRecord[];
  showResult?: boolean;
}) {
  const label = (text: string) => (
    <span
      className={`${mono.className} text-[0.5rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
    >
      {text}
    </span>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* Header row */}
      <div className="flex items-center border-b border-neutral-200 bg-neutral-50">
        <div className="flex w-12 justify-center px-3 py-1.5">
          {label("LAB")}
        </div>
        <div className="flex flex-1 border-l border-neutral-200 px-3 py-1.5">
          {label("MODEL")}
        </div>
        <div className="flex w-20 justify-center border-l border-neutral-200 px-3 py-1.5">
          {label("UI SKILL")}
        </div>
        {showResult && (
          <div className="w-10 border-l border-neutral-200">
            {label("RESULT")}
          </div>
        )}
      </div>

      {/* Data rows */}
      {records.map((record, i) => {
        const m = modelById(record.model);
        const isCorrect = record.result === "correct";
        return (
          <div
            key={i}
            className={[
              "flex items-center",
              i < records.length - 1 ? "border-b border-neutral-200" : "",
            ].join(" ")}
          >
            {/* LAB */}
            <div className="flex w-12 justify-center px-2 py-2">
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-lg border"
                style={{ borderColor: m.color, backgroundColor: m.bgColor }}
              >
                <m.Icon className="size-4" style={{ color: m.color }} />
              </div>
            </div>

            {/* MODEL */}
            <div className="flex flex-1 items-center border-l border-neutral-200 px-3 py-2">
              <span
                className={`${mono.className} text-xs font-semibold text-neutral-800`}
              >
                {m.label}
              </span>
            </div>

            {/* UI SKILL */}
            <div className="flex w-20 justify-center border-l border-neutral-200 px-2 py-2">
              <div
                className={[
                  "flex size-7 items-center justify-center rounded-lg border",
                  record.usedSkill
                    ? "border-[#7C3AED]/20 bg-[#F5F3FF]"
                    : "border-neutral-200 bg-neutral-50",
                ].join(" ")}
              >
                <SkillIcon active={record.usedSkill} className="size-4" />
              </div>
            </div>

            {/* Result */}
            {showResult && (
              <div
                className={[
                  "flex w-10 self-stretch items-center justify-center border-l border-neutral-200",
                  isCorrect ? "bg-emerald-50" : "bg-red-50",
                ].join(" ")}
              >
                <span
                  className={`${mono.className} text-sm font-bold ${isCorrect ? "text-emerald-500" : "text-red-400"}`}
                >
                  {isCorrect ? "✓" : "✗"}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Notification HUD ─────────────────────────────────────────────────────────

function NotifCard({
  notif,
  visible,
}: {
  notif: Notification | null;
  visible: boolean;
}) {
  if (!notif) return null;
  const { type, round, guesses, correctModel } = notif;

  const inner = () => {
    if (type === "round-start") {
      return (
        <>
          <div
            className={`${mono.className} mb-2 text-[0.6rem] font-semibold tracking-[0.25em] text-neutral-400 uppercase`}
          >
            ROUND {round + 1} / {ROUNDS.length}
          </div>
          <div
            className={`${newsreader.className} text-xl leading-tight text-black`}
          >
            New round
          </div>
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: MAX_GUESSES }).map((_, i) => (
              <span
                key={i}
                className="size-2 rounded-full border border-neutral-300"
              />
            ))}
          </div>
        </>
      );
    }

    if (type === "correct") {
      return (
        <>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-sm text-emerald-600">✓</span>
            </div>
            <div>
              <div
                className={`${mono.className} text-xs font-bold tracking-widest text-emerald-600 uppercase`}
              >
                CORRECT
              </div>
              <div
                className={`${mono.className} text-[0.6rem] text-neutral-400`}
              >
                +1 POINT
              </div>
            </div>
          </div>
          {guesses.length > 0 && (
            <div className="border-t border-neutral-100 pt-3">
              <FeedbackTable records={guesses} />
            </div>
          )}
        </>
      );
    }

    if (type === "wrong") {
      const remaining = MAX_GUESSES - guesses.length;
      return (
        <>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-red-100">
              <span className="text-sm text-red-500">✗</span>
            </div>
            <div>
              <div
                className={`${mono.className} text-xs font-bold tracking-widest text-red-500 uppercase`}
              >
                WRONG
              </div>
              <div
                className={`${mono.className} flex items-center gap-1.5 text-[0.6rem] text-neutral-400`}
              >
                <span>
                  {remaining} {remaining === 1 ? "guess" : "guesses"} left
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: MAX_GUESSES }).map((_, i) => (
                    <span
                      key={i}
                      className={`size-1.5 rounded-full ${i < guesses.length ? "bg-red-400" : "border border-neutral-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-3">
            <FeedbackTable records={guesses} />
          </div>
        </>
      );
    }

    if (type === "round-over" && correctModel) {
      const answer = ROUNDS[round];
      const answerRecord: GuessRecord = {
        model: correctModel,
        usedSkill: answer.usedSkill,
        result: "correct",
      };
      return (
        <>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-neutral-100">
              <span className="text-sm text-neutral-500">!</span>
            </div>
            <div>
              <div
                className={`${mono.className} text-xs font-bold tracking-widest text-neutral-700 uppercase`}
              >
                ROUND OVER
              </div>
              <div
                className={`${mono.className} text-[0.6rem] text-neutral-400`}
              >
                It was…
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-3">
            <FeedbackTable records={[answerRecord]} showResult={false} />
          </div>
        </>
      );
    }

    return null;
  };

  const isWide = type === "wrong" || type === "correct" || type === "round-over";

  return (
    <div
      className={[
        "pointer-events-none fixed right-4 top-4 z-50 rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-300",
        isWide ? "w-80" : "w-56",
        visible ? "translate-x-0 opacity-100" : "translate-x-[115%] opacity-0",
      ].join(" ")}
    >
      {inner()}
    </div>
  );
}

// ─── Model Selector (floating, opens upward) ──────────────────────────────────

function ModelSelector({
  selected,
  onChange,
  disabled,
}: {
  selected: ModelId | null;
  onChange: (id: ModelId) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const def = selected ? modelById(selected) : null;

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Dropdown — opens upward */}
      <div
        className={[
          "absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] transition-all duration-200",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        {MODELS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => {
              onChange(m.id);
              setOpen(false);
            }}
            className={[
              "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors",
              i < MODELS.length - 1 ? "border-b border-neutral-100" : "",
              selected === m.id ? "bg-neutral-50" : "hover:bg-neutral-50",
            ].join(" ")}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border"
              style={{ borderColor: m.color, backgroundColor: m.bgColor }}
            >
              <m.Icon className="size-5" style={{ color: m.color }} />
            </div>
            <div className="flex flex-col">
              <span
                className={`${mono.className} text-sm font-semibold text-black`}
              >
                {m.label}
              </span>
              <span
                className={`${mono.className} text-[0.6rem] tracking-wider text-neutral-400 uppercase`}
              >
                {m.maker}
              </span>
            </div>
            {selected === m.id && (
              <span className="ml-auto text-sm text-black">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Trigger */}
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={[
          "flex h-12 w-64 items-center gap-2.5 rounded-xl border px-4 transition-all",
          mono.className,
          disabled ? "cursor-not-allowed opacity-40" : "",
          def
            ? "border-neutral-200 bg-white text-black hover:bg-neutral-50"
            : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-400",
        ].join(" ")}
      >
        {def ? (
          <>
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-lg border"
              style={{ borderColor: def.color, backgroundColor: def.bgColor }}
            >
              <def.Icon
                className="size-4 shrink-0"
                style={{ color: def.color }}
              />
            </div>
            <span className="flex-1 text-sm font-semibold tracking-wide">
              {def.label}
            </span>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm font-semibold tracking-wide text-neutral-400">
              Choose a model…
            </span>
          </>
        )}
        <span className="text-[0.6rem] opacity-40">{open ? "▲" : "▼"}</span>
      </button>
    </div>
  );
}

// ─── Game Over Overlay ────────────────────────────────────────────────────────

function GameOverOverlay({ results }: { results: RoundResult[] }) {
  const score = results.filter((r) => r.solved).length;

  const grade = () => {
    if (score === 3)
      return { label: "PERFECT", sub: "You got all three. Impressive." };
    if (score === 2)
      return { label: "SOLID", sub: "Two out of three. Not bad." };
    if (score === 1)
      return { label: "GETTING THERE", sub: "One correct. Keep practicing." };
    return { label: "MISSED ALL", sub: "The models fooled you this time." };
  };

  const { label, sub } = grade();

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white">
      <div className="flex w-full max-w-sm flex-col items-center px-8 text-center">
        <div
          className={`${mono.className} mb-4 text-[0.65rem] font-semibold tracking-[0.3em] text-neutral-400 uppercase`}
        >
          GAME OVER
        </div>
        <div
          className={`${newsreader.className} mb-1 text-[7rem] leading-none text-black`}
        >
          {score}
        </div>
        <div
          className={`${mono.className} mb-3 text-sm font-semibold tracking-wider text-neutral-400 uppercase`}
        >
          / {ROUNDS.length} correct
        </div>
        <div
          className={`${epilogue.className} mb-1 text-2xl font-extrabold uppercase tracking-tight text-black`}
        >
          {label}
        </div>
        <p className={`${mono.className} mb-10 text-sm text-neutral-500`}>
          {sub}
        </p>

        {/* Round breakdown */}
        <div className="mb-10 w-full border border-neutral-200 bg-neutral-50">
          {results.map((r, i) => {
            const answer = ROUNDS[i];
            const m = modelById(answer.model);
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-5 py-3.5 ${i < results.length - 1 ? "border-b border-neutral-200" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`${mono.className} text-xs text-neutral-400`}
                  >
                    R{i + 1}
                  </span>
                  <ModelBadge model={m} showSkill skill={answer.usedSkill} />
                </div>
                <span
                  className={`${mono.className} text-xs font-semibold ${r.solved ? "text-emerald-500" : "text-red-400"}`}
                >
                  {r.solved
                    ? `+1 (${r.guessesUsed} ${r.guessesUsed === 1 ? "try" : "tries"})`
                    : "✗"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/game"
            className={`${mono.className} flex-1 border-2 border-black bg-black py-4 text-center text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black`}
          >
            &lt; PLAY AGAIN/ &gt;
          </Link>
          <Link
            href="/"
            className={`${mono.className} flex-1 border-2 border-neutral-300 bg-white py-4 text-center text-sm font-bold tracking-widest text-neutral-500 uppercase transition-colors hover:border-black hover:text-black`}
          >
            ← HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Game Component ──────────────────────────────────────────────────────

export default function GamePage() {
  const [round, setRound] = useState(0);
  const [currentGuesses, setCurrentGuesses] = useState<GuessRecord[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelId | null>(null);
  const [usedSkill, setUsedSkill] = useState(false);
  const [phase, setPhase] = useState<Phase>("playing");
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [roundResolved, setRoundResolved] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotif = useCallback((n: Notification, durationMs = 2500) => {
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    setNotification(n);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setNotifVisible(true)),
    );
    notifTimerRef.current = setTimeout(
      () => setNotifVisible(false),
      durationMs,
    );
  }, []);

  useEffect(
    () => () => {
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    },
    [],
  );

  function handleGuess() {
    if (!selectedModel) return;

    const correct = ROUNDS[round];
    const isCorrect =
      selectedModel === correct.model && usedSkill === correct.usedSkill;
    const record: GuessRecord = {
      model: selectedModel,
      usedSkill,
      result: isCorrect ? "correct" : "wrong",
    };
    const newGuesses = [...currentGuesses, record];
    setCurrentGuesses(newGuesses);

    if (isCorrect) {
      const result: RoundResult = {
        solved: true,
        guessesUsed: newGuesses.length,
      };
      setRoundResults((prev) => [...prev, result]);
      showNotif({ type: "correct", round, guesses: newGuesses });
      setRoundResolved(true);
    } else {
      const exhausted = newGuesses.length >= MAX_GUESSES;
      if (exhausted) {
        const result: RoundResult = { solved: false, guessesUsed: MAX_GUESSES };
        setRoundResults((prev) => [...prev, result]);
        showNotif(
          {
            type: "round-over",
            round,
            guesses: newGuesses,
            correctModel: correct.model,
          },
          3500,
        );
        setRoundResolved(true);
      } else {
        showNotif({ type: "wrong", round, guesses: newGuesses });
        setSelectedModel(null);
      }
    }
  }

  function advanceRound() {
    if (round + 1 >= ROUNDS.length) {
      setPhase("game-over");
    } else {
      setRound((r) => r + 1);
      setCurrentGuesses([]);
      setSelectedModel(null);
      setUsedSkill(false);
      setRoundResolved(false);
    }
  }

  const canGuess = !!selectedModel && !roundResolved;

  return (
    <div
      className={`fixed inset-0 overflow-hidden bg-white text-black selection:bg-[#7C3AED] selection:text-white ${epilogue.className}`}
    >
      {/* ── Full-page iframe ─────────────────────────────────────────────── */}
      <iframe
        src="https://example.com"
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        title="Vibe coded website"
        className="absolute inset-0 h-full w-full border-0"
      />

      {/* ── Game over overlay ────────────────────────────────────────────── */}
      {phase === "game-over" && <GameOverOverlay results={roundResults} />}

      {/* ── Floating top-left: back + round pips ─────────────────────────── */}
      <div className="fixed left-4 top-4 z-40 flex items-center gap-2">
        <Link
          href="/play"
          className={`${mono.className} flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/90 px-3.5 py-2 text-xs font-semibold tracking-widest text-neutral-500 shadow-lg backdrop-blur-sm uppercase transition-colors hover:text-black`}
        >
          ← VIBEDLE
        </Link>
      </div>

      {/* Floating middle : round pips */}

      <div className="fixed top-4 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/90 px-3.5 py-2 shadow-lg backdrop-blur-sm min-w-22">
        {ROUNDS.map((_, i) => {
          const done = i < round || phase === "game-over";
          const active = i === round && phase === "playing";
          const solved = roundResults[i]?.solved;
          return (
            <span
              key={i}
              className={[
                "size-2 rounded-full transition-all",
                active ? "scale-125 bg-black" : "",
                done && solved ? "bg-emerald-500" : "",
                done && !solved ? "bg-red-400" : "",
                !done && !active ? "bg-neutral-300" : "",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* ── Floating bottom-center: controls ─────────────────────────────── */}
      {phase === "playing" && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-stretch gap-3">
          {/* Selector pill */}
          <div className="flex items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white/90 p-3 shadow-2xl backdrop-blur-md">
            {roundResolved ? (
              /* Continue button — shown after a round is resolved */
              <button
                onClick={advanceRound}
                className={[
                  "rounded-xl px-10 py-3.5 transition-all active:scale-95",
                  mono.className,
                  "bg-black text-white hover:bg-neutral-800",
                ].join(" ")}
              >
                <span className="text-sm font-bold tracking-widest uppercase">
                  CONTINUE →
                </span>
              </button>
            ) : (
              <>
                {/* Model selector section */}
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`${mono.className} px-1 text-[0.55rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
                  >
                    MODEL
                  </span>
                  <ModelSelector
                    selected={selectedModel}
                    onChange={setSelectedModel}
                  />
                </div>

                {/* Divider */}
                <div className="mx-1 h-10 w-px self-center bg-neutral-200" />

                {/* Skill toggle section */}
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`${mono.className} text-[0.55rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
                  >
                    UI SKILL
                  </span>
                  <button
                    onClick={() => setUsedSkill((v) => !v)}
                    title={usedSkill ? "UI skill: ON" : "UI skill: OFF"}
                    className={[
                      "flex size-12 items-center justify-center rounded-xl transition-all",
                      usedSkill
                        ? "bg-[#F5F3FF] hover:bg-[#EDE9FE]"
                        : "border border-neutral-200 bg-white hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <SkillIcon active={usedSkill} className="size-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Submit button — same height as the pill, outside it */}
          {!roundResolved && (
            <button
              onClick={handleGuess}
              disabled={!canGuess}
              className={[
                "flex w-20 flex-col items-center justify-center gap-3 rounded-2xl pb-5 transition-all ",
                canGuess
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-2xl shadow-purple-300"
                  : "cursor-not-allowed bg-white/90 text-neutral-300 border border-neutral-200/80 backdrop-blur-md shadow-2xl",
              ].join(" ")}
            >
              <span
                className={`${mono.className} text-[0.55rem] font-semibold tracking-[0.2em] uppercase py-2
                `}
              >
                GUESS
              </span>
              <svg
                viewBox="0 0 20 20"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10h12M10 4l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* ── Notification HUD (top-right, transient) ───────────────────────── */}
      <NotifCard notif={notification} visible={notifVisible} />
    </div>
  );
}
