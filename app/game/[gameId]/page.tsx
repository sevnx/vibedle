"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { GameControls } from "@/components/game/GameControls";
import { NotifCard } from "@/components/game/NotifCard";
import { RoundPips } from "@/components/game/RoundPips";
import { useGameState } from "@/hooks/game/useGameState";
import { gameEpilogue, gameMono } from "@/lib/game/fonts";
import { gameStrings } from "@/lib/game/strings";

export default function GamePage() {
  const params = useParams<{ gameId: string }>();
  const routeGameId = params.gameId;
  const gameId = Array.isArray(routeGameId) ? routeGameId[0] : routeGameId;

  const {
    round,
    selectedModel,
    setSelectedModel,
    usedSkill,
    setUsedSkill,
    phase,
    roundResults,
    roundResolved,
    notification,
    notifVisible,
    handleGuess,
    advanceRound,
    canGuess,
    totalRounds,
  } = useGameState({ gameId });

  return (
    <div
      className={`fixed inset-0 overflow-hidden bg-white text-black selection:bg-[#7C3AED] selection:text-white ${gameEpilogue.className}`}
    >
      <iframe
        src="https://example.com"
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        title={gameStrings.iframeTitle}
        className="absolute inset-0 h-full w-full border-0"
      />

      <div className="fixed left-4 top-4 z-40 flex items-center gap-2">
        <Link
          href="/play"
          className={`${gameMono.className} flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/90 px-3.5 py-2 text-xs font-semibold tracking-widest text-neutral-500 shadow-lg backdrop-blur-sm uppercase transition-colors hover:text-black`}
        >
          <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
          {gameStrings.brandBack}
        </Link>
      </div>

      <RoundPips totalRounds={totalRounds} round={round} phase={phase} roundResults={roundResults} />

      {phase === "playing" && (
        <GameControls
          roundResolved={roundResolved}
          selectedModel={selectedModel}
          onSelectedModel={setSelectedModel}
          usedSkill={usedSkill}
          onToggleSkill={() => setUsedSkill((value) => !value)}
          canGuess={canGuess}
          onGuess={handleGuess}
          onContinue={advanceRound}
        />
      )}

      <NotifCard notif={notification} visible={notifVisible} totalRounds={totalRounds} />
    </div>
  );
}
