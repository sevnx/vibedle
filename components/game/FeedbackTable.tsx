import { Check, X } from "lucide-react";

import { gameMono } from "@/lib/game/fonts";
import { modelById } from "@/lib/game/models";
import { gameStrings } from "@/lib/game/strings";
import type { GuessRecord } from "@/lib/game/types";

import { SkillIcon } from "@/components/game/SkillIcon";

function HeaderLabel({ text }: { text: string }) {
  return (
    <span
      className={`${gameMono.className} text-[0.5rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
    >
      {text}
    </span>
  );
}

export function FeedbackTable({
  records,
  showResult = true,
}: {
  records: GuessRecord[];
  showResult?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center border-b border-neutral-200 bg-neutral-50">
        <div className="flex w-12 justify-center px-3 py-1.5">
          <HeaderLabel text={gameStrings.feedbackTable.lab} />
        </div>
        <div className="flex flex-1 border-l border-neutral-200 px-3 py-1.5">
          <HeaderLabel text={gameStrings.feedbackTable.model} />
        </div>
        <div className="flex w-20 justify-center border-l border-neutral-200 px-3 py-1.5">
          <HeaderLabel text={gameStrings.feedbackTable.uiSkill} />
        </div>
        {showResult && (
          <div className="w-10 border-l border-neutral-200">
            <HeaderLabel text={gameStrings.feedbackTable.result} />
          </div>
        )}
      </div>

      {records.map((record, i) => {
        const model = modelById(record.model);
        const isCorrect = record.result === "correct";

        return (
          <div
            key={i}
            className={[
              "flex items-center",
              i < records.length - 1 ? "border-b border-neutral-200" : "",
            ].join(" ")}
          >
            <div className="flex w-12 justify-center px-2 py-2">
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-lg border"
                style={{ borderColor: model.color, backgroundColor: model.bgColor }}
              >
                <model.Icon className="size-4" style={{ color: model.color }} />
              </div>
            </div>

            <div className="flex flex-1 items-center border-l border-neutral-200 px-3 py-2">
              <span className={`${gameMono.className} text-xs font-semibold text-neutral-800`}>
                {model.label}
              </span>
            </div>

            <div className="flex w-20 justify-center border-l border-neutral-200 px-2 py-2">
              <div
                className={[
                  "flex size-7 items-center justify-center rounded-lg border",
                  record.usedSkill ? "border-[#7C3AED]/20 bg-[#F5F3FF]" : "border-neutral-200 bg-neutral-50",
                ].join(" ")}
              >
                <SkillIcon active={record.usedSkill} className="size-4" />
              </div>
            </div>

            {showResult && (
              <div
                className={[
                  "flex w-10 self-stretch items-center justify-center border-l border-neutral-200",
                  isCorrect ? "bg-emerald-50" : "bg-red-50",
                ].join(" ")}
              >
                {isCorrect ? (
                  <Check className="size-4 text-emerald-500" aria-hidden strokeWidth={2.5} />
                ) : (
                  <X className="size-4 text-red-400" aria-hidden strokeWidth={2.5} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
