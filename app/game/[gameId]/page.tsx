"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";

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
    websiteUrl,
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
    showRoundTransitionLoading,
    nextRoundPreloadSrc,
  } = useGameState({ gameId });

  const [mainIframeReady, setMainIframeReady] = useState(false);

  useLayoutEffect(() => {
    setMainIframeReady(false);
  }, [websiteUrl]);

  const onMainIframeLoad = useCallback(() => {
    setMainIframeReady(true);
  }, []);

  const overlayVisible = showRoundTransitionLoading || !mainIframeReady;

  return (
    <div
      className={`fixed inset-0 overflow-hidden bg-white text-black selection:bg-[#7C3AED] selection:text-white ${gameEpilogue.className}`}
    >
      {nextRoundPreloadSrc && (
        <iframe
          src={nextRoundPreloadSrc}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          title=""
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none fixed top-0 left-[-9999px] h-px w-px border-0 opacity-0"
        />
      )}

      <iframe
        src={websiteUrl}
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        title={gameStrings.iframeTitle}
        className="absolute inset-0 h-full w-full border-0"
        onLoad={onMainIframeLoad}
        onError={onMainIframeLoad}
      />

      {overlayVisible && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-white"
          aria-live="polite"
          aria-busy="true"
        >
          <p
            className={`${gameMono.className} text-xl font-bold tracking-[0.35em] text-neutral-800 sm:text-2xl`}
          >
            {gameStrings.roundOverLoading}
          </p>
        </div>
      )}

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
