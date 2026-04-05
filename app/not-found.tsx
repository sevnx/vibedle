import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Epilogue, Azeret_Mono } from "next/font/google";
import { GitHub } from "@/components/icons/GitHub";
import { Website } from "@/components/icons/Website";
import { Footer } from "@/components/Footer";

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

const borderSubtle = "border border-neutral-200";

export const metadata: Metadata = {
  title: "Not found — Vibedle",
  description: "We could not find that page.",
};

export default function NotFound() {
  return (
    <div
      className={`flex min-h-dvh flex-col bg-white text-black selection:bg-[#0044FF] selection:text-white ${epilogue.className}`}
    >
      <main className="relative flex w-full grow flex-col items-center justify-center p-8 sm:p-14">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          <p
            className={`${mono.className} mb-8 flex items-center gap-2 text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase`}
          >
            <Compass className="size-3.5 shrink-0" aria-hidden />
            Off the map
          </p>

          <h1 className="mb-4 text-[clamp(4.5rem,18vw,9rem)] font-extrabold leading-[0.82] tracking-tighter">
            404
          </h1>

          <div className={`mb-10 max-w-md ${borderSubtle} bg-neutral-50 px-8 py-6`}>
            <p className={`${mono.className} text-sm leading-relaxed text-neutral-700 md:text-base`}>
              That URL is not part of this vibe. It may have been removed, mistyped, or never existed.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 border-2 border-black bg-black px-10 py-4 text-white transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              <span className={`${mono.className} text-sm font-bold tracking-widest uppercase`}>
                Back home
              </span>
            </Link>
            <Link
              href="/play"
              className={`flex items-center justify-center border-2 border-black bg-white px-10 py-4 transition-colors hover:bg-neutral-50 ${mono.className} text-sm font-bold tracking-widest uppercase`}
            >
              Start a game
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
