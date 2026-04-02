"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { RecapView } from "@/components/game/RecapView";
import { gameDataSource } from "@/lib/game/data-source-static";
import { gameMono } from "@/lib/game/fonts";
import { gradeGame } from "@/lib/game/grading";
import type { RecapPayload } from "@/lib/game/contracts";

export default function GameRecapPage() {
  const params = useParams<{ gameId: string }>();
  const routeGameId = params.gameId;
  const gameId = Array.isArray(routeGameId) ? routeGameId[0] : routeGameId;

  const [recap, setRecap] = useState<RecapPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await gameDataSource.getRecap(gameId);
      if (!cancelled) {
        setRecap(data);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

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
