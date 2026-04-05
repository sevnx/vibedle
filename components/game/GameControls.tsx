import { ArrowRight } from "lucide-react";

import { gameMono } from "@/lib/game/fonts";
import { gameStrings } from "@/lib/game/strings";
import type { ModelId } from "@/lib/game/types";

import { ModelSelector } from "@/components/game/ModelSelector";
import { SkillIcon } from "@/components/game/SkillIcon";

export function GameControls({
  roundResolved,
  selectedModel,
  onSelectedModel,
  usedSkill,
  onToggleSkill,
  canGuess,
  onGuess,
  onContinue,
}: {
  roundResolved: boolean;
  selectedModel: ModelId | null;
  onSelectedModel: (id: ModelId) => void;
  usedSkill: boolean;
  onToggleSkill: () => void;
  canGuess: boolean;
  onGuess: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-stretch gap-5">
      <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 bg-white/90 px-7 py-5 shadow-2xl backdrop-blur-md">
        {roundResolved ? (
          <button
            onClick={onContinue}
            className={[
              "rounded-2xl border-0 px-12 py-5 transition-all active:scale-95",
              gameMono.className,
            ].join(" ")}
          >
            <span className="flex items-center justify-center gap-2.5 text-base font-bold tracking-widest uppercase">
              {gameStrings.continueLabel}
              <ArrowRight className="size-5 shrink-0" aria-hidden strokeWidth={2.5} />
            </span>
          </button>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <span
                className={`${gameMono.className} px-1 text-[0.7rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
              >
                {gameStrings.modelLabel}
              </span>
              <ModelSelector selected={selectedModel} onChange={onSelectedModel} />
            </div>

            <div className="mx-2 h-14 w-px self-center bg-neutral-200" />

            <div className="flex flex-col items-center gap-2">
              <span
                className={`${gameMono.className} text-[0.7rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
              >
                {gameStrings.uiSkillLabel}
              </span>
              <button
                onClick={onToggleSkill}
                title={usedSkill ? gameStrings.uiSkillOnTitle : gameStrings.uiSkillOffTitle}
                className={[
                  "flex size-16 items-center justify-center rounded-2xl transition-all",
                  usedSkill
                    ? "bg-[#F5F3FF] hover:bg-[#EDE9FE]"
                    : "border border-neutral-200 bg-white hover:bg-neutral-50",
                ].join(" ")}
              >
                <SkillIcon active={usedSkill} className="size-6" />
              </button>
            </div>
          </>
        )}
      </div>

      {!roundResolved && (
        <button
          onClick={onGuess}
          disabled={!canGuess}
          className={[
            "flex w-32 flex-col items-center justify-center gap-3 rounded-3xl pb-6 pt-1 shadow-2xl transition-all",
            canGuess
              ? "bg-[#7C3AED] text-white shadow-purple-300 hover:bg-[#6D28D9]"
              : "cursor-not-allowed border border-neutral-200/80 bg-white/90 text-neutral-300 shadow-2xl backdrop-blur-md",
          ].join(" ")}
        >
          <span className={`${gameMono.className} py-2 text-[0.7rem] font-semibold tracking-[0.2em] uppercase`}>
            {gameStrings.guessLabel}
          </span>
          <ArrowRight className="size-6" aria-hidden strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
