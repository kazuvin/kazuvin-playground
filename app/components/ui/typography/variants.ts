export const typographyVariants = {
  h1: "text-2xl font-bold text-gray-900 dark:text-gray-100",
  h2: "text-xl font-bold text-gray-900 dark:text-gray-100",
  h3: "text-lg font-semibold text-gray-900 dark:text-gray-100",
  h4: "text-base font-semibold text-gray-900 dark:text-gray-100",
  p: "text-base text-gray-600 dark:text-gray-400",
  small: "text-sm text-gray-500 dark:text-gray-400",
  lead: "text-lg text-gray-600 dark:text-gray-400",
} as const;

export type TypographyVariant = keyof typeof typographyVariants;
export type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "span"
  | "div";

export function getTypographyClasses(variant: TypographyVariant): string {
  return typographyVariants[variant];
}
