import { APP_NAME } from "@/config";
import Link from "next/link";
import { CommandSearch } from "../command-search";
import { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function AppHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <header
      className={cn(
        "bg-background/50 flex h-12 items-center justify-between backdrop-blur-2xl",
        className
      )}
      {...props}
    >
      <Link href="/" className="font-bold">
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
    </header>
  );
}
