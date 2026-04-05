'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Epilogue, Azeret_Mono, Lilita_One, Newsreader } from 'next/font/google';
import { ClaudeAI } from '@/components/icons/ClaudeAI';
import { GeminiAI } from '@/components/icons/GeminiAI';
import { OpenAI } from '@/components/icons/OpenAI';
import { GitHub } from '@/components/icons/GitHub';
import { Website } from '@/components/icons/Website';

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
});

const mono = Azeret_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

const lilita = Lilita_One({
  subsets: ['latin-ext'],
  weight: ['400'],
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400'],
  display: 'swap',
});

const borderSubtle = 'border border-neutral-200';

function slideClass(active: boolean) {
  return [
    'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
    active ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
  ].join(' ');
}

export default function SwissMinimalVibedle() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const int = setInterval(() => setActive((v) => (v + 1) % 3), 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <div
      className={`flex min-h-dvh flex-col bg-white text-black selection:bg-[#0044FF] selection:text-white ${epilogue.className}`}
    >
      <main className="relative flex w-full grow flex-col items-center justify-center p-8 sm:p-14">
        <div className="flex w-full max-w-7xl flex-col items-center text-center">
          <h1 className="mb-10 text-[15vw] font-extrabold leading-[0.85] tracking-tighter uppercase sm:text-[10rem] md:text-[12.5rem]">
            VIBEDLE
          </h1>

          <div className={`mb-24 bg-neutral-50 px-10 py-5 ${borderSubtle}`}>
            <p className={`${mono.className} max-w-2xl text-base leading-relaxed text-black md:text-lg`}>
              SEE A VIBE-CODED WEBSITE
              <br />
              GUESS WHICH AI MODEL MADE IT.
            </p>
          </div>

          <div className="mb-20 flex w-full max-w-2xl flex-col items-center">
            <div className={`mb-10 flex items-center gap-5 text-sm text-neutral-500 ${mono.className}`}>
              <div className="h-px w-14 bg-neutral-200" />
              <span>WAS IT MADE BY ?</span>
              <div className="h-px w-14 bg-neutral-200" />
            </div>

            <div className="relative flex h-30 w-full items-center justify-center">
              <div className={slideClass(active === 0)}>
                <div
                  className={`flex items-center gap-3 rounded-full border border-[#D97757] bg-[#F7F0E6] px-4 py-1 ${mono.className} text-lg font-semibold tracking-tight text-[#D97757]`}
                >
                  <div className="size-2   shrink-0 rounded-full bg-[#D97757]" />
                Claude 4.6 Opus
                  <ClaudeAI className="size-8 shrink-0 text-[#D97757]" />
                </div>
              </div>

              <div className={slideClass(active === 1)}>
                <div
                  className={`mx-auto flex cursor-default items-stretch gap-2.5 rounded-2xl bg-white p-2.5 shadow-sm ${borderSubtle}`}
                >
                  <div
                    className={`flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform hover:scale-[1.02] md:size-22.5 ${borderSubtle}`}
                  >
                    <OpenAI className="size-9 md:size-10" />
                  </div>
                  <div
                    className={`flex min-w-40 flex-col justify-center rounded-xl px-4 py-2.5 md:min-w-48 ${borderSubtle}`}
                  >
                    <span className={`${newsreader.className} text-3xl tracking-tight text-black md:text-4xl`}>
                      5.4
                    </span>
                    <span
                      className={`${mono.className} mt-0.5 text-[0.8125rem] font-semibold tracking-[0.25em] text-neutral-400 uppercase md:text-sm`}
                    >
                      GPT
                    </span>
                  </div>
                </div>
              </div>

              <div className={slideClass(active === 2)}>
                <div
                  className={`flex cursor-default items-center gap-3 rounded-full border-2 border-black bg-[#00FF41] px-5 py-2.5 shadow-[5px_5px_0_0_#000] transition-all -rotate-3 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]`}
                >
                  <GeminiAI className="size-10 shrink-0 drop-shadow-[1px_1px_0_#000] md:size-9" />
                  <span
                    className={`${lilita.className} text-lg tracking-wide text-white uppercase drop-shadow-[2px_2px_0_#000] md:text-xl`}
                  >
                    Gemini 3.1 Pro
                  </span>
                </div>
              </div>
            </div>

            <div className={`mt-10 flex items-center gap-5 text-sm text-neutral-500 ${mono.className}`}>
              <div className="h-px w-14 bg-neutral-200" />
              <span>OR ANOTHER ONE ?</span>
              <div className="h-px w-14 bg-neutral-200" />
            </div>
          </div>

          <Link
            href="/play"
            className="group relative w-full overflow-hidden border-2 border-black bg-black px-20 py-8 text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
          >
            <span className={`${mono.className} relative z-10 text-lg font-bold tracking-widest uppercase`}>
              &lt; START/ &gt;
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
            className="text-neutral-500 transition-colors hover:text-[#0044FF]"
            aria-label="sevnx on GitHub"
          >
            <GitHub className="size-4" aria-hidden />
          </a>
          <a
            href="https://sevnx.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-[#0044FF]"
            aria-label="sevnx.dev"
          >
            <Website className="size-4" aria-hidden />
          </a>
        </div>
      </footer>
    </div>
  );
}
