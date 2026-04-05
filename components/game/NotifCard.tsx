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

  return (
    <div
      className={[
        "pointer-events-none fixed right-4 top-4 z-50 rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-300",
        isWide ? "w-80" : "w-56",
        visible ? "translate-x-0 opacity-100" : "translate-x-[115%] opacity-0",
      ].join(" ")}
    >
      {type === "round-start" && (
        <>
          <div
            className={`${gameMono.className} mb-2 text-[0.6rem] font-semibold tracking-[0.25em] text-neutral-400 uppercase`}
          >
            ROUND {round + 1} / {totalRounds}
          </div>
          <div className={`${gameNewsreader.className} text-xl leading-tight text-black`}>
            {gameStrings.notif.newRound}
          </div>
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: MAX_GUESSES }).map((_, i) => (
              <span key={i} className="size-2 rounded-full border border-neutral-300" />
            ))}
          </div>
        </>
      )}

      {type === "correct" && (
        <>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-4 text-emerald-600" aria-hidden strokeWidth={2.5} />
            </div>
            <div>
              <div className={`${gameMono.className} text-xs font-bold tracking-widest text-emerald-600 uppercase`}>
                {gameStrings.notif.correct}
              </div>
              <div className={`${gameMono.className} text-[0.6rem] text-neutral-400`}>
                {gameStrings.notif.plusOnePoint}
              </div>
            </div>
          </div>
          {guesses.length > 0 && (
            <div className="border-t border-neutral-100 pt-3">
              <FeedbackTable records={guesses} />
            </div>
          )}
        </>
      )}

      {type === "wrong" && (
        <>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-red-100">
              <X className="size-4 text-red-500" aria-hidden strokeWidth={2.5} />
            </div>
            <div>
              <div className={`${gameMono.className} text-xs font-bold tracking-widest text-red-500 uppercase`}>
                {gameStrings.notif.wrong}
              </div>
              <div className={`${gameMono.className} flex items-center gap-1.5 text-[0.6rem] text-neutral-400`}>
                <span>
                  {MAX_GUESSES - guesses.length} {MAX_GUESSES - guesses.length === 1
                    ? gameStrings.guessSuffixes.leftSingular
                    : gameStrings.guessSuffixes.leftPlural}
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
      )}

      {type === "round-over" && correctModel && (
        <>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-neutral-100">
              <AlertCircle className="size-4 text-neutral-500" aria-hidden strokeWidth={2.5} />
            </div>
            <div>
              <div className={`${gameMono.className} text-xs font-bold tracking-widest text-neutral-700 uppercase`}>
                {gameStrings.notif.roundOver}
              </div>
              <div
                className={`${gameMono.className} flex items-center gap-1 text-[0.6rem] text-neutral-400`}
              >
                <span>{gameStrings.notif.itWas}</span>
                <Ellipsis className="size-3.5 shrink-0 opacity-70" aria-hidden strokeWidth={2} />
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-3">
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
