export const gameStrings = {
  iframeTitle: "Vibe coded website",
  brandBack: "\u2190 VIBEDLE",
  modelLabel: "MODEL",
  uiSkillLabel: "SKILL",
  selectModelPlaceholder: "Choose a model\u2026",
  guessLabel: "GUESS",
  continueLabel: "CONTINUE \u2192",
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
    itWas: "It was\u2026",
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
    playAgain: "< PLAY AGAIN/ >",
    home: "\u2190 HOME",
    roundPrefix: "R",
    miss: "\u2717",
  },
  guessSuffixes: {
    leftSingular: "guess left",
    leftPlural: "guesses left",
    trySingular: "try",
    tryPlural: "tries",
  },
  symbols: {
    check: "\u2713",
    cross: "\u2717",
    warning: "!",
    caretUp: "\u25b2",
    caretDown: "\u25bc",
  },
  roundLabel: "ROUND",
} as const;

export const playStrings = {
  backToVibedle: "\u2190 VIBEDLE",
  headingHowTo: "HOW TO",
  headingPlay: "PLAY",
  ctaPlay: "< PLAY/ >",
  footerMadeBy: "MADE BY SEV",
  footerYear: "\u00a9 2026",
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
  solid: { label: "SOLID", sub: "Not too bad, you need to vibe some more." },
  gettingThere: {
    label: "GETTING THERE",
    sub: "Keep prompting. Those tokens won't burn themselves.",
  },
  missedAll: {
    label: "MISSED ALL",
    sub: "You probably don't even have an agent running in the background.",
  },
} as const;
