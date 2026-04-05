"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { RecapView } from "@/components/game/RecapView";
import { gameMono } from "@/lib/game/fonts";
import { gradeGame } from "@/lib/game/grading";

export default function GameRecapPage() {
  const params = useParams<{ gameId: string }>();
  const routeGameId = params.gameId;
  const gameId = Array.isArray(routeGameId) ? routeGameId[0] : routeGameId;
  const recap = useQuery(api.games.getRecap, {
    gameId: gameId as Id<"gameSessions">,
  });

  if (!recap) {
    return (
      <div
        className={`${gameMono.className} flex min-h-dvh items-center justify-center bg-white p-8 text-black sm:p-14`}
      >
        <p className="text-sm text-neutral-500 uppercase tracking-widest">Loading recap...</p>
      </div>
    );
  }

  const score = recap.results.filter((result) => result.solved).length;

  return (
    <RecapView
      gameId={gameId}
      score={score}
      totalRounds={recap.rounds.length}
      grade={gradeGame(score, recap.rounds.length)}
    />
  );
}
