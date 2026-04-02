import type { FC, SVGProps } from "react";

import { ClaudeAI } from "@/components/ClaudeAI";
import { GeminiAI } from "@/components/GeminiAI";
import { OpenAI } from "@/components/OpenAI";
import type { ModelId } from "@/lib/game/types";

export interface ModelDef {
  id: ModelId;
  label: string;
  maker: string;
  color: string;
  bgColor: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
}

export const MODELS: ModelDef[] = [
  {
    id: "claude-4.6-opus",
    label: "Claude 4.6 Opus",
    maker: "Anthropic",
    color: "#D97757",
    bgColor: "#F7F0E6",
    Icon: ClaudeAI,
  },
  {
    id: "gpt-5.4",
    label: "GPT 5.4",
    maker: "OpenAI",
    color: "#171717",
    bgColor: "#F5F5F5",
    Icon: OpenAI,
  },
  {
    id: "gemini-3.1-pro",
    label: "Gemini 3.1 Pro",
    maker: "Google",
    color: "#3689FF",
    bgColor: "#EEF4FF",
    Icon: GeminiAI,
  },
];

export function modelById(id: ModelId): ModelDef {
  return MODELS.find((model) => model.id === id)!;
}
