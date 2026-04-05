"use client";

import { Check, ChevronDown, ChevronUp, Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { gameMono } from "@/lib/game/fonts";
import { MODELS, modelById } from "@/lib/game/models";
import { gameStrings } from "@/lib/game/strings";
import type { ModelId } from "@/lib/game/types";

export function ModelSelector({
  selected,
  onChange,
  disabled,
}: {
  selected: ModelId | null;
  onChange: (id: ModelId) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedModel = selected ? modelById(selected) : null;

  useEffect(() => {
    function onOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        className={[
          "absolute bottom-full left-1/2 z-50 mb-3 w-96 -translate-x-1/2 overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] transition-all duration-200",
          open ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-2 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="max-h-90 overflow-y-auto overscroll-contain">
          {MODELS.map((model, i) => (
            <button
              key={model.id}
              onClick={() => {
                onChange(model.id);
                setOpen(false);
              }}
              className={[
                "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors",
                i < MODELS.length - 1 ? "border-b border-neutral-100" : "",
                selected === model.id ? "bg-neutral-50" : "hover:bg-neutral-50",
              ].join(" ")}
            >
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl border"
                style={{ borderColor: model.color, backgroundColor: model.bgColor }}
              >
                <model.Icon className="size-6" style={{ color: model.color }} />
              </div>
              <div className="flex flex-col">
                <span className={`${gameMono.className} text-base font-semibold text-black`}>
                  {model.id}
                </span>
                <span className={`${gameMono.className} text-[0.8rem] tracking-wider text-neutral-400 uppercase`}>
                  {model.maker}
                </span>
              </div>
              {selected === model.id && (
                <Check className="ml-auto size-5 shrink-0 text-black" aria-hidden strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => !disabled && setOpen((value) => !value)}
        disabled={disabled}
        className={[
          "flex h-16 w-96 items-center gap-3 rounded-2xl border px-5 transition-all",
          gameMono.className,
          disabled ? "cursor-not-allowed opacity-40" : "",
          selectedModel
            ? "border-neutral-200 bg-white text-black hover:bg-neutral-50"
            : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-400",
        ].join(" ")}
      >
        {selectedModel ? (
          <>
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border"
              style={{ borderColor: selectedModel.color, backgroundColor: selectedModel.bgColor }}
            >
              <selectedModel.Icon className="size-5 shrink-0" style={{ color: selectedModel.color }} />
            </div>
            <span className="flex-1 text-base font-semibold tracking-wide">{selectedModel.id}</span>
          </>
        ) : (
          <span className="flex flex-1 items-center gap-1.5 text-base font-semibold tracking-wide text-neutral-400">
            <span>{gameStrings.selectModelPlaceholder}</span>
            <Ellipsis className="size-5 shrink-0 opacity-60" aria-hidden strokeWidth={2} />
          </span>
        )}
        <span className="text-neutral-400 opacity-70">
          {open ? (
            <ChevronUp className="size-5 shrink-0" aria-hidden strokeWidth={2.5} />
          ) : (
            <ChevronDown className="size-5 shrink-0" aria-hidden strokeWidth={2.5} />
          )}
        </span>
      </button>
    </div>
  );
}
