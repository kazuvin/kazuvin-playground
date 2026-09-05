import { extendTailwindMerge } from "tailwind-merge";

/* Kotoba's seven typography roles replace Tailwind's font-size scale on the
   `text-` prefix. tailwind-merge only knows the built-in scale, so without
   this it classes `text-label` as a text-COLOUR and silently drops it when a
   colour follows — a Button would render at the inherited font size. */
const KOTOBA_TYPE_ROLES = [
  "expression",
  "reading",
  "gloss",
  "body",
  "label",
  "support",
  "overline",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: KOTOBA_TYPE_ROLES }],
    },
  },
});

type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, boolean | undefined | null>;

/**
 * A lightweight alternative to clsx
 * Combines class names conditionally
 */
export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    const type = typeof input;

    if (type === "string") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const result = clsx(...input);
      if (result) classes.push(result);
    } else if (type === "object") {
      for (const key in input as Record<string, boolean>) {
        if ((input as Record<string, boolean>)[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}

/**
 * Utility function that combines clsx and twMerge
 * This is the most commonly used function, similar to `cn` in shadcn/ui
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}
