import type { GameGrade } from "@/lib/game/types";
import { gradeStrings } from "@/lib/game/strings";

export function gradeGame(score: number, totalRounds: number): GameGrade {
  const percentage = (score / totalRounds) * 100;
  if (percentage >= 90) {
    return gradeStrings.perfect;
  }
  if (percentage >= 70) {
    return gradeStrings.solid;
  }
  if (percentage >= 30) {
    return gradeStrings.gettingThere;
  }
  return gradeStrings.missedAll;
}
