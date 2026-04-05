import { AlertCircle, Check, Ellipsis, X } from "lucide-react";

import { MAX_GUESSES } from "@/lib/game/constants";
import { gameMono, gameNewsreader } from "@/lib/game/fonts";
import { gameStrings } from "@/lib/game/strings";
import type { Notification } from "@/lib/game/types";

import { FeedbackTable } from "@/components/game/FeedbackTable";

export function NotifCard({
  notif,
  visible,
  totalRounds,
}: {
  notif: Notification | null;
  visible: boolean;
  totalRounds: number;
}) {
  if (!notif) {
    return null;
  }

  const { type, round, guesses, correctModel, correctUsedSkill } = notif;

  const isWide = type === "wrong" || type === "correct" || type === "round-over";

  const cardSurface =
    type === "wrong"
      ? "border-red-200/70 bg-red-50/95"
      : type === "correct"
        ? "border-violet-200/70 bg-violet-50/95"
        : "border-neutral-200 bg-white/95";

  return (
    <div
      className={[
        "pointer-events-none fixed right-4 top-4 z-50 rounded-3xl border p-6 shadow-2xl backdrop-blur-sm transition-all duration-300",
        cardSurface,
        isWide ? "w-104 sm:w-md" : "w-72",
        visible ? "translate-x-0 opacity-100" : "translate-x-[115%] opacity-0",
      ].join(" ")}
    >
      {type === "round-start" && (
        <>
          <div
            className={`${gameMono.className} mb-3 text-[0.75rem] font-semibold tracking-[0.25em] text-neutral-400 uppercase`}
          >
            ROUND {round + 1} / {totalRounds}
          </div>
          <div className={`${gameNewsreader.className} text-2xl leading-tight text-black sm:text-3xl`}>
            {gameStrings.notif.newRound}
          </div>
          <div className="mt-4 flex gap-2">
            {Array.from({ length: MAX_GUESSES }).map((_, i) => (
              <span key={i} className="size-2.5 rounded-full border border-neutral-300" />
            ))}
          </div>
        </>
      )}

      {type === "correct" && (
        <>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-violet-100">
              <Check className="size-5 text-violet-600" aria-hidden strokeWidth={2.5} />
            </div>
            <div>
              <div className={`${gameMono.className} text-sm font-bold tracking-widest text-violet-700 uppercase`}>
                {gameStrings.notif.correct}
              </div>
              <div className={`${gameMono.className} text-[0.75rem] text-neutral-400`}>
                {gameStrings.notif.plusOnePoint}
              </div>
            </div>
          </div>
          {guesses.length > 0 && (
            <div className="border-t border-violet-200/60 pt-4">
              <FeedbackTable records={guesses} />
            </div>
          )}
        </>
      )}

      {type === "wrong" && (
        <>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-red-100">
              <X className="size-5 text-red-500" aria-hidden strokeWidth={2.5} />
            </div>
            <div>
              <div className={`${gameMono.className} text-sm font-bold tracking-widest text-red-500 uppercase`}>
                {gameStrings.notif.wrong}
              </div>
              <div className={`${gameMono.className} flex items-center gap-2 text-[0.75rem] text-neutral-400`}>
                <span>
                  {MAX_GUESSES - guesses.length} {MAX_GUESSES - guesses.length === 1
                    ? gameStrings.guessSuffixes.leftSingular
                    : gameStrings.guessSuffixes.leftPlural}
                </span>
                <div className="flex gap-1.5">
                  {Array.from({ length: MAX_GUESSES }).map((_, i) => (
                    <span
                      key={i}
                      className={`size-2 rounded-full ${i < guesses.length ? "bg-red-400" : "border border-neutral-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-red-200/60 pt-4">
            <FeedbackTable records={guesses} />
          </div>
        </>
      )}

      {type === "round-over" && correctModel && (
        <>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-neutral-100">
              <AlertCircle className="size-5 text-neutral-500" aria-hidden strokeWidth={2.5} />
            </div>
            <div>
              <div className={`${gameMono.className} text-sm font-bold tracking-widest text-neutral-700 uppercase`}>
                {gameStrings.notif.roundOver}
              </div>
              <div
                className={`${gameMono.className} flex items-center gap-1.5 text-[0.75rem] text-neutral-400`}
              >
                <span>{gameStrings.notif.itWas}</span>
                <Ellipsis className="size-4 shrink-0 opacity-70" aria-hidden strokeWidth={2} />
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-4">
            <FeedbackTable
              records={[
                {
                  model: correctModel,
                  usedSkill: !!correctUsedSkill,
                  result: "correct",
                },
              ]}
              showResult={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
