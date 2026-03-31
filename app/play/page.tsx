"use client";

import Link from "next/link";
import {
  Epilogue,
  Azeret_Mono,
  Newsreader,
} from "next/font/google";
import { GitHub } from "@/components/GitHub";
import { Website } from "@/components/Website";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const mono = Azeret_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400"],
  display: "swap",
});

const borderSubtle = "border border-neutral-200";

const rules = [
  { num: "01", text: "YOU SEE A VIBE-CODED WEBSITE" },
  { num: "02", text: "GUESS WHICH AI MODEL BUILT IT" },
  { num: "03", text: "SPOT IF IT USED THE UI DESIGN SKILL" },
];

export default function PlayLobbyPage() {
  return (
    <div
      className={`flex min-h-dvh flex-col bg-white text-black selection:bg-[#7C3AED] selection:text-white ${epilogue.className}`}
    >
      <main className="relative flex w-full grow flex-col items-center justify-center p-8 sm:p-14">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          {/* Back link */}
          <Link
            href="/"
            className={`${mono.className} mb-12 self-start text-xs font-semibold tracking-widest text-neutral-400 uppercase transition-colors hover:text-black`}
          >
            ← VIBEDLE
          </Link>

          {/* Headline */}
          <h1 className="mb-3 text-6xl font-extrabold leading-[0.9] tracking-tighter uppercase sm:text-7xl">
            HOW TO
            <br />
            PLAY
          </h1>
          <div className="mb-10 h-1 w-12 bg-black" />

          {/* Rules */}
          <div className={`mb-10 w-full ${borderSubtle} bg-neutral-50`}>
            {rules.map(({ num, text }, i) => (
              <div
                key={num}
                className={`flex items-center gap-5 px-8 py-5 ${i < rules.length - 1 ? "border-b border-neutral-200" : ""}`}
              >
                <span
                  className={`${mono.className} text-xs font-semibold tracking-widest text-neutral-300`}
                >
                  {num}
                </span>
                <span
                  className={`${mono.className} text-sm font-semibold tracking-wider text-black`}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div
            className={`mb-10 flex w-full divide-x divide-neutral-200 ${borderSubtle}`}
          >
            {[
              { value: "3", label: "ROUNDS" },
              { value: "3", label: "GUESSES" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-1 flex-col items-center py-5"
              >
                <span
                  className={`${newsreader.className} text-3xl leading-none text-black`}
                >
                  {value}
                </span>
                <span
                  className={`${mono.className} mt-1 text-[0.7rem] font-semibold tracking-widest text-neutral-400 uppercase`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/game"
            className="group relative w-full overflow-hidden border-2 border-black bg-black px-20 py-8 text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
          >
            <span
              className={`${mono.className} relative z-10 text-lg font-bold tracking-widest uppercase`}
            >
              &lt; PLAY/ &gt;
            </span>
          </Link>
        </div>
      </main>

      <footer
        className={`mt-auto grid w-full grid-cols-2 border-t border-neutral-200 text-sm tracking-wider uppercase ${mono.className} text-neutral-500`}
      >
        <div className="border-r border-neutral-200 p-5">© 2026</div>
        <div className="flex items-center justify-end gap-2 p-5 text-right">
          <span>MADE BY SEV</span>
          <a
            href="https://github.com/sevnx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-[#7C3AED]"
            aria-label="sevnx on GitHub"
          >
            <GitHub className="size-4" aria-hidden />
          </a>
          <a
            href="https://sevnx.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-[#7C3AED]"
            aria-label="sevnx.dev"
          >
            <Website className="size-4" aria-hidden />
          </a>
        </div>
      </footer>
    </div>
  );
}
