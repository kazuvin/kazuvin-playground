import type { ThemeToken } from './parse-theme'

/*
 * @theme のトークンを、カタログの節に振り分ける。
 *
 * 振り分けは名前の前方一致だけで決める。値の一覧をここに書き写さないのと同じ理由で、
 * 「どのトークンがあるか」も持たない。定義に無い名前は捨てずに最後の Uncategorised へ
 * 落ちるので、globals.css に新しい接頭辞のトークンが増えても、カタログから消える
 * ことはない (見出しが付かないだけ)。定義の順に先勝ちで見るため、--color-gray-* を
 * --color-* より前に置いてある。
 */

export type TokenPreview =
  | 'color'
  | 'font'
  | 'weight'
  | 'text'
  | 'leading'
  | 'tracking'
  | 'spacing'
  | 'radius'
  | 'ease'
  | 'animation'
  | 'value'

interface TokenRow {
  /** Tailwind 側のキー。--color-gray-900 なら gray-900 */
  key: string
  token: ThemeToken
}

export interface TokenGroup {
  id: string
  title: string
  /** 対応する Tailwind ユーティリティの形 */
  utility: string
  preview: TokenPreview
  rows: TokenRow[]
}

interface TokenGroupDefinition {
  id: string
  title: string
  utility: string
  preview: TokenPreview
  /** 1 番目のキャプチャがそのまま Tailwind のキーになる */
  pattern: RegExp
}

const GROUP_DEFINITIONS: TokenGroupDefinition[] = [
  {
    id: 'neutral-ramp',
    title: 'Neutral ramp',
    utility: 'bg-gray-* / text-gray-* / border-gray-*',
    preview: 'color',
    pattern: /^--color-(gray-.+)$/,
  },
  {
    id: 'accent',
    title: 'Accent',
    utility: 'bg-accent / text-accent / border-accent',
    preview: 'color',
    pattern: /^--color-(accent.*)$/,
  },
  {
    id: 'semantic-color',
    title: 'Semantic colour',
    utility: 'bg-* / text-* / border-*',
    preview: 'color',
    pattern: /^--color-(.+)$/,
  },
  {
    id: 'font-weight',
    title: 'Font weight',
    utility: 'font-*',
    preview: 'weight',
    pattern: /^--font-weight-(.+)$/,
  },
  {
    id: 'font-family',
    title: 'Font family',
    utility: 'font-*',
    preview: 'font',
    pattern: /^--font-(.+)$/,
  },
  {
    id: 'type-scale',
    title: 'Type scale',
    utility: 'text-*',
    preview: 'text',
    pattern: /^--text-(.+)$/,
  },
  {
    id: 'leading',
    title: 'Line height',
    utility: 'leading-*',
    preview: 'leading',
    pattern: /^--leading-(.+)$/,
  },
  {
    id: 'tracking',
    title: 'Letter spacing',
    utility: 'tracking-*',
    preview: 'tracking',
    pattern: /^--tracking-(.+)$/,
  },
  {
    id: 'spacing-base',
    title: 'Spacing base',
    utility: 'p-4 / gap-2 … の 1 単位',
    preview: 'value',
    pattern: /^--(spacing)$/,
  },
  {
    id: 'spacing-scale',
    title: 'Spacing scale',
    utility: 'p-* / m-* / gap-* / h-*',
    preview: 'spacing',
    pattern: /^--spacing-(.+)$/,
  },
  {
    id: 'radius',
    title: 'Radius',
    utility: 'rounded-*',
    preview: 'radius',
    pattern: /^--radius-(.+)$/,
  },
  {
    id: 'ease',
    title: 'Easing',
    utility: 'ease-*',
    preview: 'ease',
    pattern: /^--ease-(.+)$/,
  },
  {
    id: 'animation',
    title: 'Animation',
    utility: 'animate-*',
    preview: 'animation',
    pattern: /^--animate-(.+)$/,
  },
]

/** どの定義にも当たらなかったトークンの受け皿。ここが空でない = globals.css に
    カタログの知らない接頭辞が増えた、というシグナルになる。 */
const UNCATEGORISED: Omit<TokenGroupDefinition, 'pattern'> = {
  id: 'uncategorised',
  title: 'Uncategorised',
  utility: '—',
  preview: 'value',
}

/**
 * トークンを節ごとにまとめる。空の節は落とし、節の中の並びは宣言順のまま。
 */
export function groupThemeTokens(tokens: ThemeToken[]): TokenGroup[] {
  const rows = new Map<string, TokenRow[]>()
  const push = (id: string, row: TokenRow): void => {
    const existing = rows.get(id)
    if (existing === undefined) {
      rows.set(id, [row])
      return
    }
    existing.push(row)
  }

  for (const token of tokens) {
    const definition = GROUP_DEFINITIONS.find((candidate) => candidate.pattern.test(token.name))
    if (definition === undefined) {
      push(UNCATEGORISED.id, { key: token.name, token })
      continue
    }
    const matched = token.name.match(definition.pattern)
    push(definition.id, { key: matched === null ? token.name : matched[1], token })
  }

  return [...GROUP_DEFINITIONS, UNCATEGORISED]
    .map((definition) => ({
      id: definition.id,
      title: definition.title,
      utility: definition.utility,
      preview: definition.preview,
      rows: rows.get(definition.id) ?? [],
    }))
    .filter((group) => group.rows.length > 0)
}
