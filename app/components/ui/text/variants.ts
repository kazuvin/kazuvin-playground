/* Seven roles, split by a hard line.

   CONTENT roles (expression, reading, gloss, body) carry the learning
   material. They hold a 15px floor and are never shrunk to make a layout
   fit — if it does not fit, the screen scrolls.

   CHROME roles (label, support, overline) are small on purpose; density
   comes from whitespace, not from shrinking the subject of the screen.
   `support` and `overline` are the only roles allowed under 14px. */

export const textRoleClasses = {
  expression: "text-expression text-foreground",
  reading: "text-reading text-foreground",
  gloss: "text-gloss text-subtle-foreground",
  body: "text-body text-foreground",
  label: "text-label text-foreground",
  support: "text-support text-muted-foreground",
  /* The only uppercase in the system. */
  overline: "text-overline text-muted-foreground uppercase",
} as const;

export const textAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export type TextRole = keyof typeof textRoleClasses;
export type TextAlign = keyof typeof textAlignClasses;
export type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "span"
  | "div"
  | "label"
  | "li";

/** Content roles are quoted material: never truncated, never abbreviated. */
export const CONTENT_ROLES: readonly TextRole[] = [
  "expression",
  "reading",
  "gloss",
  "body",
];

export const textDefaultElement: Record<TextRole, TextElement> = {
  expression: "h1",
  reading: "h2",
  gloss: "p",
  body: "p",
  label: "span",
  support: "p",
  overline: "p",
};

export function getTextClasses(role: TextRole, align: TextAlign): string {
  return `m-0 text-pretty ${textRoleClasses[role]} ${textAlignClasses[align]}`;
}
