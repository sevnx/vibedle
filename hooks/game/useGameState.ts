"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  DEFAULT_NOTIFICATION_MS,
  MAX_GUESSES,
  ROUND_OVER_NOTIFICATION_MS,
} from "@/lib/game/constants";
import { gameDataSource, GAME_ROUNDS } from "@/lib/game/data-source-static";
import type { GuessRecord, ModelId, Notification, Phase, RoundResult } from "@/lib/game/types";

export function useGameState({ gameId }: { gameId: string }) {
  const router = useRouter();

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

  const totalRounds = useMemo(() => GAME_ROUNDS.length, []);

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
    void gameDataSource.getRound(gameId, round);
  }, [gameId, round]);

  const handleGuess = useCallback(async () => {
    if (!selectedModel || roundResolved) {
      return;
    }

    const submission = await gameDataSource.submitGuess(gameId, round, currentGuesses, {
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
      setRoundResults((prev) => [...prev, result]);
      showNotif({ type: "correct", round, guesses: newGuesses });
      setRoundResolved(true);
      return;
    }

    if (submission.exhausted) {
      const result: RoundResult = {
        solved: false,
        guessesUsed: MAX_GUESSES,
      };
      setRoundResults((prev) => [...prev, result]);
      showNotif(
        {
          type: "round-over",
          round,
          guesses: newGuesses,
          correctModel: submission.correctModel,
          correctUsedSkill: submission.correctUsedSkill,
        },
        ROUND_OVER_NOTIFICATION_MS,
      );
      setRoundResolved(true);
      return;
    }

    showNotif({ type: "wrong", round, guesses: newGuesses });
    setSelectedModel(null);
  }, [currentGuesses, gameId, round, roundResolved, selectedModel, showNotif, usedSkill]);

  const advanceRound = useCallback(async () => {
    if (round + 1 >= totalRounds) {
      setPhase("completed");
      router.push(`/game/${gameId}/recap`);
      return;
    }

    setRound((value) => value + 1);
    setCurrentGuesses([]);
    setSelectedModel(null);
    setUsedSkill(false);
    setRoundResolved(false);
  }, [gameId, round, router, totalRounds]);

  const canGuess = !!selectedModel && !roundResolved;

  return {
    round,
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
  };
}
