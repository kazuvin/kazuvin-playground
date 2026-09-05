export const screenAlignClasses = {
  stretch: "items-stretch",
  center: "items-center",
  start: "items-start",
} as const;

export type ScreenAlign = keyof typeof screenAlignClasses;

/* Tier-1 spacing owner: 24 horizontal, 32 top, 24 bottom. This is the only
   place screen-edge padding is declared — children use tier 2 between blocks
   and tier 3 inside a block, and never add a margin that fights the shell. */
export const screenBaseClasses =
  "mx-auto box-border flex min-h-full w-full flex-col bg-background px-edge-h pt-edge-top pb-edge-bottom";

export function getScreenClasses(align: ScreenAlign): string {
  return `${screenBaseClasses} ${screenAlignClasses[align]}`;
}
