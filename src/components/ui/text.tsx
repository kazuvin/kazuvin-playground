import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/* globals.css のスケールの上に乗るだけで、独自のサイズは持たない。上の 5 つは
   すべて 14px で、階層はサイズではなく太さと色で作る (docs/kotoba-design-system.md)。 */
const textRoleClasses = {
  /** 14 / 700 — ページタイトル。1 画面に 1 つ。 */
  title: 'text-base font-bold text-balance text-foreground',
  /** 14 / 600 — セクション見出し。 */
  heading: 'text-base font-semibold text-balance text-foreground',
  /** 14 / 600 + 弱い色 — サブセクション見出し。太さは heading と同じで、
      1 段下がることを色で示す。 */
  subheading: 'text-base font-semibold text-balance text-subtle-foreground',
  /** 14 / 400 — 基準。role を省いたときのこれ。 */
  body: 'text-base text-pretty text-foreground',
  /** 14 / 400 + 弱い色 — リード文・補足の段落。body と同じ大きさで、
      主題ではないことだけを色で示す。 */
  lead: 'text-base text-pretty text-subtle-foreground',
  /** 13 / 400 — 説明文・キャプション。本文ではないので 1 段落ちる。 */
  caption: 'text-sm text-pretty text-subtle-foreground',
  /** 12 / 500 — フォームラベル、チップ、日付などのメタデータ。 */
  label: 'text-xs font-medium text-pretty text-foreground',
  /** 11 / 600 — セクションの前置き。システム内で唯一の大文字組み。 */
  overline: 'text-2xs font-semibold uppercase tracking-widest text-muted-foreground',
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
  title: 'h1',
  heading: 'h2',
  subheading: 'h3',
  body: 'p',
  lead: 'p',
  caption: 'p',
  label: 'span',
  overline: 'p',
}

function getTextClasses(role: TextRole, align: TextAlign): string {
  return `m-0 ${textRoleClasses[role]} ${textAlignClasses[align]}`
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
