import type { GuessRecord, ModelId, RoundDefinition, RoundResult } from "@/lib/game/types";

export interface CreateGameResponse {
  gameId: string;
}

export interface RoundPayload {
  roundIndex: number;
  totalRounds: number;
}

export interface GuessSubmission {
  model: ModelId;
  usedSkill: boolean;
}

export interface SubmitGuessResponse {
  record: GuessRecord;
  solved: boolean;
  exhausted: boolean;
  guessesUsed: number;
  correctModel: ModelId;
  correctUsedSkill: boolean;
}

export interface RecapPayload {
  gameId: string;
  rounds: RoundDefinition[];
  results: RoundResult[];
}

export interface GameDataSource {
  createGame(): Promise<CreateGameResponse>;
  getRound(gameId: string, roundIndex: number): Promise<RoundPayload>;
  submitGuess(
    gameId: string,
    roundIndex: number,
    guessesSoFar: GuessRecord[],
    guess: GuessSubmission,
  ): Promise<SubmitGuessResponse>;
  getRecap(gameId: string): Promise<RecapPayload>;
}
