import { MAX_GUESSES } from "@/lib/game/constants";
import type {
  GuessSubmission,
  GameDataSource,
  RecapPayload,
  RoundPayload,
  SubmitGuessResponse,
} from "@/lib/game/contracts";
import type { GuessRecord, RoundDefinition, RoundResult } from "@/lib/game/types";

const STATIC_ROUNDS: RoundDefinition[] = [
  { model: "gpt-5.4", usedSkill: false },
  { model: "claude-4.6-opus", usedSkill: true },
  { model: "gemini-3.1-pro", usedSkill: false },
  { model: "gpt-5.4", usedSkill: true },
  { model: "gemini-3.1-pro", usedSkill: true },
];

function getRoundDefinition(roundIndex: number): RoundDefinition {
  return STATIC_ROUNDS[roundIndex]!;
}

interface StaticGameState {
  resultsByRound: Map<number, RoundResult>;
}

const gameStateById = new Map<string, StaticGameState>();

function getOrCreateState(gameId: string): StaticGameState {
  const existing = gameStateById.get(gameId);
  if (existing) {
    return existing;
  }
  const created: StaticGameState = {
    resultsByRound: new Map<number, RoundResult>(),
  };
  gameStateById.set(gameId, created);
  return created;
}

async function createGame() {
  const gameId = `static-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  gameStateById.set(gameId, {
    resultsByRound: new Map<number, RoundResult>(),
  });

  return {
    gameId,
  };
}

async function getRound(_gameId: string, roundIndex: number): Promise<RoundPayload> {
  return {
    roundIndex,
    totalRounds: STATIC_ROUNDS.length,
  };
}

async function submitGuess(
  gameId: string,
  roundIndex: number,
  guessesSoFar: GuessRecord[],
  guess: GuessSubmission,
): Promise<SubmitGuessResponse> {
  const answer = getRoundDefinition(roundIndex);
  const solved = guess.model === answer.model && guess.usedSkill === answer.usedSkill;
  const record: GuessRecord = {
    model: guess.model,
    usedSkill: guess.usedSkill,
    result: solved ? "correct" : "wrong",
  };
  const guessesUsed = guessesSoFar.length + 1;
  const state = getOrCreateState(gameId);

  if (solved) {
    state.resultsByRound.set(roundIndex, {
      solved: true,
      guessesUsed,
    });
  } else if (guessesUsed >= MAX_GUESSES) {
    state.resultsByRound.set(roundIndex, {
      solved: false,
      guessesUsed: MAX_GUESSES,
    });
  }

  return {
    record,
    solved,
    exhausted: !solved && guessesUsed >= MAX_GUESSES,
    guessesUsed,
    correctModel: answer.model,
    correctUsedSkill: answer.usedSkill,
  };
}

async function getRecap(gameId: string): Promise<RecapPayload> {
  const state = getOrCreateState(gameId);

  const results: RoundResult[] = STATIC_ROUNDS.map((_, roundIndex) =>
    state.resultsByRound.get(roundIndex) ?? {
      solved: false,
      guessesUsed: 0,
    },
  );

  return {
    gameId,
    rounds: STATIC_ROUNDS,
    results,
  };
}

export const gameDataSource: GameDataSource = {
  createGame,
  getRound,
  submitGuess,
  getRecap,
};

export const GAME_ROUNDS = STATIC_ROUNDS;
