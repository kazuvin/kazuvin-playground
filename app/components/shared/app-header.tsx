"use client";

import { APP_NAME } from "@/config";
import { useWindowScroll } from "@/app/hooks";
import Link from "next/link";

export function AppHeader() {
  const [scrollPosition] = useWindowScroll();
  const isScrolled = scrollPosition.y >= 90;

  return (
    <div
      className={`sticky flex items-center justify-between top-2 h-12 backdrop-blur-2xl py-3 px-6 rounded-2xl bg-foreground/5 ${
        isScrolled ? "ml-auto" : ""
      }`}
    >
      <h1
        className={`font-bold text-lg transition-all duration-300 ease-in-out whitespace-nowrap ${
          isScrolled
            ? "opacity-0 w-0 max-w-0 overflow-hidden mr-0"
            : "opacity-100 w-auto max-w-xs mr-4"
        }`}
      >
        {APP_NAME}
      </h1>
      <div className="flex items-center gap-5">
        <nav className="flex items-center gap-5">
          <ul className="flex items-center gap-4 text-sm">
            <Link href="/notes">Notes</Link>
          </ul>
          <ul className="flex items-center gap-4 text-sm">
            <Link href="/playgrounds">Playgrounds</Link>
          </ul>
        </nav>
        <button className="text-sm rounded-xl px-3 py-1 bg-primary text-primary-foreground font-semibold cursor-pointer">
          ⌘K
        </button>
      </div>
    </div>
  );
}
