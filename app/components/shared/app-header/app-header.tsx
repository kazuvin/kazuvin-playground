"use client";

import { APP_NAME } from "@/config";
import { useWindowScroll } from "@/app/hooks";
import Link from "next/link";
import { CommandSearch } from "../command-search";

export function AppHeader() {
  const [scrollPosition] = useWindowScroll();
  const isScrolled = scrollPosition.y >= 90;

  return (
    <div
      className={`bg-foreground/5 sticky top-2 flex h-12 items-center justify-between rounded-2xl px-6 py-3 backdrop-blur-2xl ${
        isScrolled ? "ml-auto" : ""
      }`}
    >
      <Link
        href="/"
        className={`text-lg font-bold whitespace-nowrap transition-all duration-300 ease-in-out ${
          isScrolled
            ? "mr-0 w-0 max-w-0 overflow-hidden opacity-0"
            : "mr-4 w-auto max-w-xs opacity-100"
        }`}
      >
        {APP_NAME}
      </Link>
      <div className="flex items-center gap-5">
        <nav className="flex items-center gap-5">
          <ul className="flex items-center gap-4 text-sm">
            <Link href="/notes">Notes</Link>
          </ul>
          <ul className="flex items-center gap-4 text-sm">
            <Link href="/playgrounds">Playgrounds</Link>
          </ul>
        </nav>
        <CommandSearch />
      </div>
    </div>
  );
}
