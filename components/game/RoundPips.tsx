import type { Phase, RoundResult } from "@/lib/game/types";

export function RoundPips({
  totalRounds,
  round,
  phase,
  roundResults,
}: {
  totalRounds: number;
  round: number;
  phase: Phase;
  roundResults: RoundResult[];
}) {
  return (
    <div className="fixed top-4 left-1/2 z-40 flex min-w-22 -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/90 px-3.5 py-2 shadow-lg backdrop-blur-sm">
      {Array.from({ length: totalRounds }).map((_, i) => {
        const done = i < round || phase === "completed";
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
  );
}
