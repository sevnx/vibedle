import type { GameGrade } from "@/lib/game/types";
import { gradeStrings } from "@/lib/game/strings";

export function gradeGame(score: number, totalRounds: number): GameGrade {
  if (score === totalRounds) {
    return gradeStrings.perfect;
  }
  if (score === totalRounds - 1) {
    return gradeStrings.solid;
  }
  if (score === totalRounds - 2) {
    return gradeStrings.gettingThere;
  }
  return gradeStrings.missedAll;
}
