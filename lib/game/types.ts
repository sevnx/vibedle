import type { ModelId } from "./modelCatalog";

export type { ModelId };

export type NotifType = "round-start" | "correct" | "wrong" | "round-over";

export type Phase = "playing" | "completed";

export interface RoundDefinition {
  model: ModelId;
  usedSkill: boolean;
}

export interface GuessRecord {
  model: ModelId;
  usedSkill: boolean;
  result: "correct" | "wrong";
}

export interface Notification {
  type: NotifType;
  round: number;
  guesses: GuessRecord[];
  correctModel?: ModelId;
  correctUsedSkill?: boolean;
}

export interface RoundResult {
  solved: boolean;
  guessesUsed: number;
}

export interface GameGrade {
  label: string;
  sub: string;
}

export interface GameRecap {
  gameId: string;
  score: number;
  totalRounds: number;
  results?: RoundResult[];
  rounds: RoundDefinition[];
  grade: GameGrade;
}
