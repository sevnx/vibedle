import Link from "next/link";

import { gameEpilogue, gameMono, gameNewsreader } from "@/lib/game/fonts";
import { gameStrings } from "@/lib/game/strings";
import type { GameGrade } from "@/lib/game/types";

export function RecapView({
  gameId,
  score,
  totalRounds,
  grade,
}: {
  gameId: string;
  score: number;
  totalRounds: number;
  grade: GameGrade;
}) {
  return (
    <div
      className={`flex min-h-dvh items-center justify-center bg-white p-8 text-center sm:p-14 ${gameEpilogue.className}`}
    >
      <div className="flex w-full max-w-2xl flex-col items-center">
        <div
          className={`${gameMono.className} mb-6 text-[0.65rem] font-semibold tracking-[0.3em] text-neutral-400 uppercase sm:mb-8`}
        >
          {gameStrings.recap.title}
        </div>

        <div
          role="group"
          aria-label={`${score} out of ${totalRounds}`}
          className="mb-6 w-full max-w-md overflow-hidden border border-neutral-200 bg-neutral-50 sm:mb-8 sm:max-w-lg sm:rounded-2xl"
        >
          <div className="grid grid-cols-3 divide-x divide-neutral-200">
            <div className="grid min-h-22 min-w-0 place-items-center px-1 py-4 sm:min-h-26 sm:py-6">
              <span
                className={`${gameNewsreader.className} block w-full text-center text-6xl leading-none text-black tabular-nums sm:text-7xl`}
              >
                {score}
              </span>
            </div>
            <div className="grid min-h-22 min-w-0 place-items-center px-1 py-4 sm:min-h-26 sm:py-6">
              <span
                className={`${gameNewsreader.className} block w-full text-center text-6xl leading-none text-black tabular-nums sm:text-7xl`}
                aria-hidden
              >
                /
              </span>
            </div>
            <div className="grid min-h-22 min-w-0 place-items-center px-1 py-4 sm:min-h-26 sm:py-6">
              <span
                className={`${gameNewsreader.className} block w-full text-center text-6xl leading-none text-black tabular-nums sm:text-7xl`}
              >
                {totalRounds}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`${gameEpilogue.className} mb-2 text-2xl font-extrabold uppercase tracking-tight text-black sm:mb-3`}
        >
          {grade.label}
        </div>
        <p className={`${gameMono.className} mb-12 text-sm text-neutral-500 sm:mb-14`}>{grade.sub}</p>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href={`/game/${gameId}`}
            className={`${gameMono.className} flex-1 border-2 border-black bg-black py-4 text-center text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black`}
          >
            {gameStrings.recap.playAgain}
          </Link>
          <Link
            href="/"
            className={`${gameMono.className} flex-1 border-2 border-neutral-300 bg-white py-4 text-center text-sm font-bold tracking-widest text-neutral-500 uppercase transition-colors hover:border-black hover:text-black`}
          >
            {gameStrings.recap.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
