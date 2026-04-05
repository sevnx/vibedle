/**
 * Single source of truth for playable models. Add new models only here.
 * `label` is the canonical id (stored in Convex, used in game state).
 */
export const MODEL_CATALOG = [
  { company: "OpenAI", label: "GPT 5.4" },
  { company: "OpenAI", label: "GPT 5.4 Mini" },
  { company: "OpenAI", label: "GPT 4.1" },
  { company: "Anthropic", label: "Claude 4.6 Opus" },
  { company: "Anthropic", label: "Claude 4.6 Sonnet" },
  { company: "Anthropic", label: "Claude 4 Sonnet" },
  { company: "Google", label: "Gemini 3.1 Pro" },
  { company: "Google", label: "Gemini 2.5 Pro" },
  { company: "Alibaba", label: "Qwen 3.6 Plus" },
  { company: "Moonshot", label: "Kimi 2.5" },
  { company: "Cursor", label: "Composer 2" },
  { company: "Minimax", label: "Minimax 2.5" },
] as const;

export type ModelId = (typeof MODEL_CATALOG)[number]["label"];
