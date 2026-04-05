"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  DEFAULT_NOTIFICATION_MS,
  ROUND_OVER_NOTIFICATION_MS,
} from "@/lib/game/constants";
import { resolveHostedSiteIframeSrc } from "@/lib/game/hostedSiteUrl";
import type { GuessRecord, ModelId, Notification, Phase, RoundResult } from "@/lib/game/types";

const TOTAL_ROUNDS_FALLBACK = 5;

type RoundPayload = {
  roundIndex: number;
  totalRounds: number;
  websiteUrl: string;
  guessesUsed: number;
};

export function useGameState({ gameId }: { gameId: string }) {
  const router = useRouter();
  const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();
  const submitGuess = useMutation(api.games.submitGuess);
  const convexGameId = gameId as Id<"gameSessions">;

  /** After resume, overrides server-derived index when advancing or using mutation payload. */
  const [clientRound, setClientRound] = useState<number | null>(null);
  const [currentGuesses, setCurrentGuesses] = useState<GuessRecord[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelId | null>(null);
  const [usedSkill, setUsedSkill] = useState(false);
  const [phase, setPhase] = useState<Phase>("playing");
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [roundResolved, setRoundResolved] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [roundOverride, setRoundOverride] = useState<RoundPayload | null>(null);
  const [nextRoundPayload, setNextRoundPayload] = useState<RoundPayload | null>(null);

  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resume = useQuery(
    api.games.getGameResume,
    convexAuthLoading || !isAuthenticated ? "skip" : { gameId: convexGameId },
  );

  const effectiveRoundIndex =
    clientRound !== null
      ? clientRound
      : resume && resume.sessionStatus === "active"
        ? resume.currentRoundIndex
        : null;

  const fetchedRound = useQuery(
    api.games.getRound,
    roundOverride || convexAuthLoading || !isAuthenticated || effectiveRoundIndex === null || resume?.sessionStatus !== "active"
      ? "skip"
      : {
          gameId: convexGameId,
          roundIndex: effectiveRoundIndex,
        },
  );

  const activeRound = roundOverride ?? fetchedRound;
  const totalRounds =
    activeRound?.totalRounds ??
    (resume && resume.sessionStatus === "active" ? resume.totalRounds : TOTAL_ROUNDS_FALLBACK);
  const websiteUrl = resolveHostedSiteIframeSrc(activeRound?.websiteUrl ?? "about:blank");
  const isRoundLoading = !activeRound;

  const showNotif = useCallback((nextNotif: Notification, durationMs = DEFAULT_NOTIFICATION_MS) => {
    if (notifTimerRef.current) {
      clearTimeout(notifTimerRef.current);
    }
    setNotification(nextNotif);
    requestAnimationFrame(() => requestAnimationFrame(() => setNotifVisible(true)));
    notifTimerRef.current = setTimeout(() => setNotifVisible(false), durationMs);
  }, []);

  useEffect(
    () => () => {
      if (notifTimerRef.current) {
        clearTimeout(notifTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    setClientRound(null);
    setRoundOverride(null);
    setNextRoundPayload(null);
    setCurrentGuesses([]);
    setSelectedModel(null);
    setUsedSkill(false);
    setPhase("playing");
    setRoundResults([]);
    setRoundResolved(false);
    setNotification(null);
    setNotifVisible(false);
  }, [gameId]);

  useEffect(() => {
    if (resume?.sessionStatus === "completed") {
      router.replace(`/game/${gameId}/recap`);
    }
  }, [resume, gameId, router]);

  useEffect(() => {
    if (!resume || resume.sessionStatus !== "active") {
      return;
    }
    if (clientRound !== null) {
      return;
    }
    setClientRound(resume.currentRoundIndex);
    setRoundResults(resume.priorRoundResults);
  }, [resume, clientRound]);

  const handleGuess = useCallback(async () => {
    if (!selectedModel || roundResolved || !activeRound) {
      return;
    }

    const submission = await submitGuess({
      gameId: convexGameId,
      roundIndex: activeRound.roundIndex,
      model: selectedModel,
      usedSkill,
    });

    const newGuesses = [...currentGuesses, submission.record];
    setCurrentGuesses(newGuesses);

    if (submission.solved) {
      const result: RoundResult = {
        solved: true,
        guessesUsed: submission.guessesUsed,
      };
      setRoundResults((prev) => {
        const next = [...prev];
        next[activeRound.roundIndex] = result;
        return next;
      });
      showNotif({ type: "correct", round: activeRound.roundIndex, guesses: newGuesses });
      setRoundResolved(true);
      setSelectedModel(null);
      setNextRoundPayload(submission.nextRound);
      return;
    }

    if (submission.exhausted) {
      const result: RoundResult = {
        solved: false,
        guessesUsed: submission.guessesUsed,
      };
      setRoundResults((prev) => {
        const next = [...prev];
        next[activeRound.roundIndex] = result;
        return next;
      });
      showNotif(
        {
          type: "round-over",
          round: activeRound.roundIndex,
          guesses: newGuesses,
          correctModel: submission.correctModel ?? undefined,
          correctUsedSkill: submission.correctUsedSkill ?? undefined,
        },
        ROUND_OVER_NOTIFICATION_MS,
      );
      setRoundResolved(true);
      setSelectedModel(null);
      setNextRoundPayload(submission.nextRound);
      return;
    }

    showNotif({ type: "wrong", round: activeRound.roundIndex, guesses: newGuesses });
  }, [activeRound, convexGameId, currentGuesses, roundResolved, selectedModel, showNotif, submitGuess, usedSkill]);

  const advanceRound = useCallback(async () => {
    const resumeActive = resume && resume.sessionStatus === "active";
    const currentIdx =
      clientRound !== null ? clientRound : resumeActive ? resume.currentRoundIndex : 0;

    if (currentIdx + 1 >= totalRounds) {
      setPhase("completed");
      router.push(`/game/${gameId}/recap`);
      return;
    }

    if (nextRoundPayload) {
      setClientRound(nextRoundPayload.roundIndex);
      setRoundOverride(nextRoundPayload);
      setNextRoundPayload(null);
    } else {
      setClientRound(currentIdx + 1);
      setRoundOverride(null);
    }

    setCurrentGuesses([]);
    setSelectedModel(null);
    setUsedSkill(false);
    setRoundResolved(false);
  }, [clientRound, gameId, nextRoundPayload, resume, router, totalRounds]);

  const canGuess = !!selectedModel && !roundResolved && !isRoundLoading;

  const resumeLoading = resume === undefined;
  const showRoundTransitionLoading =
    phase === "playing" && (resumeLoading || !activeRound || effectiveRoundIndex === null);

  const nextRoundPreloadSrc =
    phase === "playing" && roundResolved && nextRoundPayload
      ? resolveHostedSiteIframeSrc(nextRoundPayload.websiteUrl)
      : null;

  const round = effectiveRoundIndex ?? 0;

  return {
    round,
    websiteUrl,
    currentGuesses,
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
  };
}
