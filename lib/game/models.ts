import type { FC, SVGProps } from "react";

import { ClaudeAI } from "@/components/icons/ClaudeAI";
import { GeminiAI } from "@/components/icons/GeminiAI";
import { OpenAI } from "@/components/icons/OpenAI";
import { MODEL_CATALOG, type ModelId } from "@/lib/game/modelCatalog";
import { Cursor } from "@/components/icons/Cursor";
import { Kimi } from "@/components/icons/Kimi";
import { Qwen } from "@/components/icons/Qwen";
import { Minimax } from "@/components/icons/Minimax";

export interface ModelDef {
  id: ModelId;
  maker: string;
  color: string;
  bgColor: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
}

interface BrandStyle {
  Icon: FC<SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
}

const BRAND_BY_COMPANY: Record<(typeof MODEL_CATALOG)[number]["company"], BrandStyle> = {
  OpenAI: { Icon: OpenAI, color: "#171717", bgColor: "#F5F5F5" },
  Anthropic: { Icon: ClaudeAI, color: "#D97757", bgColor: "#F7F0E6" },
  Google: { Icon: GeminiAI, color: "#3689FF", bgColor: "#EEF4FF" },
  Alibaba: { Icon: Qwen, color: "#FF6A00", bgColor: "#FFF5EB" },
  Moonshot: { Icon: Kimi, color: "#6366F1", bgColor: "#EEF2FF" },
  Cursor: { Icon: Cursor, color: "#3B82F6", bgColor: "#EFF6FF" },
  Minimax: { Icon: Minimax, color: "#000000", bgColor: "#F5F5F5" },
};

export const MODELS: ModelDef[] = MODEL_CATALOG.map((entry) => {
  const brand = BRAND_BY_COMPANY[entry.company];
  return {
    id: entry.label,
    maker: entry.company,
    ...brand,
  };
});

const MODEL_BY_ID = new Map(MODELS.map((m) => [m.id, m]));

export function modelById(id: ModelId): ModelDef {
  const model = MODEL_BY_ID.get(id);
  if (!model) {
    throw new Error(`Unknown model id: ${id}`);
  }
  return model;
}
