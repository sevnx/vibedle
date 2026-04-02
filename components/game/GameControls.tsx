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
    <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-stretch gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white/90 p-3 shadow-2xl backdrop-blur-md">
        {roundResolved ? (
          <button
            onClick={onContinue}
            className={[
              "rounded-xl px-10 py-3.5 transition-all active:scale-95",
              gameMono.className,
              "bg-black text-white hover:bg-neutral-800",
            ].join(" ")}
          >
            <span className="text-sm font-bold tracking-widest uppercase">{gameStrings.continueLabel}</span>
          </button>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <span
                className={`${gameMono.className} px-1 text-[0.55rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
              >
                {gameStrings.modelLabel}
              </span>
              <ModelSelector selected={selectedModel} onChange={onSelectedModel} />
            </div>

            <div className="mx-1 h-10 w-px self-center bg-neutral-200" />

            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`${gameMono.className} text-[0.55rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase`}
              >
                {gameStrings.uiSkillLabel}
              </span>
              <button
                onClick={onToggleSkill}
                title={usedSkill ? gameStrings.uiSkillOnTitle : gameStrings.uiSkillOffTitle}
                className={[
                  "flex size-12 items-center justify-center rounded-xl transition-all",
                  usedSkill
                    ? "bg-[#F5F3FF] hover:bg-[#EDE9FE]"
                    : "border border-neutral-200 bg-white hover:bg-neutral-50",
                ].join(" ")}
              >
                <SkillIcon active={usedSkill} className="size-5" />
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
            "flex w-20 flex-col items-center justify-center gap-3 rounded-2xl pb-5 transition-all",
            canGuess
              ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-2xl shadow-purple-300"
              : "cursor-not-allowed border border-neutral-200/80 bg-white/90 text-neutral-300 shadow-2xl backdrop-blur-md",
          ].join(" ")}
        >
          <span className={`${gameMono.className} py-2 text-[0.55rem] font-semibold tracking-[0.2em] uppercase`}>
            {gameStrings.guessLabel}
          </span>
          <svg
            viewBox="0 0 20 20"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h12M10 4l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
