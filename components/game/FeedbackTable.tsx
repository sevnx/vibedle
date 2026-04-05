import { Check, X } from "lucide-react";

import { gameMono } from "@/lib/game/fonts";
import { modelById } from "@/lib/game/models";
import { gameStrings } from "@/lib/game/strings";
import type { GuessRecord } from "@/lib/game/types";

import { SkillIcon } from "@/components/game/SkillIcon";

function HeaderLabel({ text }: { text: string }) {
  return (
    <span
      className={`${gameMono.className} text-[0.65rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
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
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex min-h-11 items-center border-b border-neutral-200 bg-neutral-50">
        <div className="flex w-16 justify-center px-3 py-2.5">
          <HeaderLabel text={gameStrings.feedbackTable.lab} />
        </div>
        <div className="flex flex-1 border-l border-neutral-200 px-4 py-2.5">
          <HeaderLabel text={gameStrings.feedbackTable.model} />
        </div>
        <div className="flex w-24 justify-center border-l border-neutral-200 px-3 py-2.5">
          <HeaderLabel text={gameStrings.feedbackTable.uiSkill} />
        </div>
        {showResult && (
          <div className="flex w-18 items-center justify-center border-l border-neutral-200 px-2 py-2.5">
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
            <div className="flex w-16 justify-center px-2 py-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border"
                style={{ borderColor: model.color, backgroundColor: model.bgColor }}
              >
                <model.Icon className="size-5" style={{ color: model.color }} />
              </div>
            </div>

            <div className="flex flex-1 items-center border-l border-neutral-200 px-4 py-3">
              <span className={`${gameMono.className} text-sm font-semibold text-neutral-800`}>
                {model.id}
              </span>
            </div>

            <div className="flex w-24 justify-center border-l border-neutral-200 px-2 py-3">
              <div
                className={[
                  "flex size-10 items-center justify-center rounded-xl border",
                  record.usedSkill ? "border-[#7C3AED]/20 bg-[#F5F3FF]" : "border-neutral-200 bg-neutral-50",
                ].join(" ")}
              >
                <SkillIcon active={record.usedSkill} className="size-5" />
              </div>
            </div>

            {showResult && (
              <div
                className={[
                  "flex w-18 self-stretch items-center justify-center border-l border-neutral-200 py-2",
                  isCorrect ? "bg-emerald-50" : "bg-red-50",
                ].join(" ")}
              >
                {isCorrect ? (
                  <Check className="size-5 text-emerald-500" aria-hidden strokeWidth={2.5} />
                ) : (
                  <X className="size-5 text-red-400" aria-hidden strokeWidth={2.5} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
