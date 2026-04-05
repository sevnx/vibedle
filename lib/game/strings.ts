export const gameStrings = {
  iframeTitle: "Vibe coded website",
  brandBack: "VIBEDLE",
  modelLabel: "MODEL",
  uiSkillLabel: "SKILL",
  selectModelPlaceholder: "Choose a model",
  guessLabel: "GUESS",
  continueLabel: "CONTINUE",
  roundOverLoading: "[ LOADING ]",
  uiSkillOnTitle: "UI skill: ON",
  uiSkillOffTitle: "UI skill: OFF",
  uiSkillUsedAria: "UI skill used",
  uiSkillNotUsedAria: "UI skill not used",
  notif: {
    newRound: "New round",
    correct: "CORRECT",
    plusOnePoint: "+1 POINT",
    wrong: "WRONG",
    roundOver: "ROUND OVER",
    itWas: "It was",
  },
  feedbackTable: {
    lab: "LAB",
    model: "MODEL",
    uiSkill: "SKILL",
    result: "RESULT",
  },
  recap: {
    title: "GAME OVER",
    outOfCorrect: "correct",
    playAgain: "PLAY AGAIN",
    home: "HOME",
    roundPrefix: "R",
  },
  guessSuffixes: {
    leftSingular: "guess left",
    leftPlural: "guesses left",
    trySingular: "try",
    tryPlural: "tries",
  },
  roundLabel: "ROUND",
} as const;

export const playStrings = {
  backToVibedle: "VIBEDLE",
  headingHowTo: "HOW TO",
  headingPlay: "PLAY",
  ctaPlay: "PLAY",
  footerMadeBy: "MADE BY SEV",
  footerYear: "2026",
  rules: [
    { num: "01", text: "YOU SEE A VIBE-CODED WEBSITE" },
    { num: "02", text: "GUESS WHICH AI MODEL BUILT IT" },
    { num: "03", text: "SPOT IF IT USED THE FRONTEND DESIGN SKILL" },
  ],
  stats: [
    { value: "5", label: "ROUNDS" },
    { value: "3", label: "GUESSES" },
  ],
} as const;

export const gradeStrings = {
  perfect: { label: "PERFECT", sub: "You're absolutely right!" },
  solid: { label: "SOLID", sub: "Not too bad, you need to vibe a bit more." },
  gettingThere: {
    label: "GETTING THERE",
    sub: "Keep prompting. Those tokens won't burn themselves.",
  },
  missedAll: {
    label: "DISAPPOINTING",
    sub: "You probably don't even have an agent running in the background.",
  },
} as const;
