"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { gameMono } from "@/lib/game/fonts";
import { gameStrings } from "@/lib/game/strings";

export function RecapPlayAgainButton() {
  const router = useRouter();
  const createSession = useMutation(api.games.createSession);
  const inFlight = useRef(false);
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      const { gameId } = await createSession({});
      router.push(`/game/${gameId}`);
    } catch {
      inFlight.current = false;
      setBusy(false);
    }
  }, [createSession, router]);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className={`${gameMono.className} flex flex-1 cursor-pointer items-center justify-center gap-1 border-2 border-black bg-black py-4 text-center text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black disabled:cursor-wait disabled:opacity-70`}
      >
        <ChevronLeft className="size-4 shrink-0" aria-hidden />
        {gameStrings.recap.playAgain}
        <span className="font-normal opacity-80" aria-hidden>
          /
        </span>
        <ChevronRight className="size-4 shrink-0" aria-hidden />
      </button>
      {busy && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-white"
          aria-live="polite"
          aria-busy="true"
        >
          <p
            className={`${gameMono.className} text-xl font-bold tracking-[0.35em] text-neutral-800 sm:text-2xl`}
          >
            {gameStrings.roundOverLoading}
          </p>
        </div>
      )}
    </>
  );
}
