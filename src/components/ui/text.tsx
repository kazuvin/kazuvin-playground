import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/* Seven roles, split by a hard line.

   CONTENT roles (expression, reading, gloss, body) carry the learning
   material. They hold a 15px floor and are never shrunk to make a layout
   fit — if it does not fit, the screen scrolls.

   CHROME roles (label, support, overline) are small on purpose; density
   comes from whitespace, not from shrinking the subject of the screen.
   `support` and `overline` are the only roles allowed under 14px.

   公開 API ではないので export しない（型は props の形からしか使わない）。 */
const textRoleClasses = {
  expression: 'text-expression text-foreground',
  reading: 'text-reading text-foreground',
  gloss: 'text-gloss text-subtle-foreground',
  body: 'text-body text-foreground',
  label: 'text-label text-foreground',
  support: 'text-support text-muted-foreground',
  /* The only uppercase in the system. */
  overline: 'text-overline text-muted-foreground uppercase',
} as const

const textAlignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

type TextRole = keyof typeof textRoleClasses
type TextAlign = keyof typeof textAlignClasses
type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'label' | 'li'

const textDefaultElement: Record<TextRole, TextElement> = {
  expression: 'h1',
  reading: 'h2',
  gloss: 'p',
  body: 'p',
  label: 'span',
  support: 'p',
  overline: 'p',
}

function getTextClasses(role: TextRole, align: TextAlign): string {
  return `m-0 text-pretty ${textRoleClasses[role]} ${textAlignClasses[align]}`
}

interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Picks the typography token set. Default "body". */
  role?: TextRole
  /** Override the default element for the role. */
  as?: TextElement
  align?: TextAlign
}

function Text({ className, role = 'body', as, align = 'left', ...props }: TextProps) {
  const Component = as ?? textDefaultElement[role]

  return <Component className={cn(getTextClasses(role, align), className)} {...props} />
}

export { Text }
