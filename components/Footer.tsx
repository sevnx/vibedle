import { GitHub } from "@/components/icons/GitHub";
import { Website } from "@/components/icons/Website";
import { gameMono } from "@/lib/game/fonts";

export function Footer() {
  return (
    <footer
      className={`mt-auto grid w-full grid-cols-2 border-t border-neutral-200 text-sm tracking-wider uppercase ${gameMono.className} text-neutral-500`}
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
  );
}
