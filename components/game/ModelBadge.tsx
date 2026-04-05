import { gameMono } from "@/lib/game/fonts";
import type { ModelDef } from "@/lib/game/models";

import { SkillIcon } from "@/components/game/SkillIcon";

export function ModelBadge({
  model,
  showSkill,
  skill,
  size = "sm",
}: {
  model: ModelDef;
  showSkill?: boolean;
  skill?: boolean;
  size?: "sm" | "lg";
}) {
  const { Icon, color, bgColor, id } = model;
  const isLg = size === "lg";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        gameMono.className,
        isLg ? "text-sm font-semibold" : "text-xs font-semibold",
      ].join(" ")}
      style={{ borderColor: color, backgroundColor: bgColor, color }}
    >
      <Icon className={isLg ? "size-4 shrink-0" : "size-3 shrink-0"} style={{ color }} />
      {id}
      {showSkill && <SkillIcon active={!!skill} className={isLg ? "size-4" : "size-3"} />}
    </span>
  );
}
