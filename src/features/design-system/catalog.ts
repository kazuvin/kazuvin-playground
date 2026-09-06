import type { MarkdownHeading } from 'astro'
import globalsCss from '@/styles/globals.css?raw'
import { parseThemeTokens } from './parse-theme'
import type { TokenGroup } from './token-groups'
import { groupThemeTokens } from './token-groups'

/*
 * カタログの目次と中身の出典。
 *
 * トークンの節は globals.css を読んで組み立てるので、@theme に接頭辞の違うトークンが
 * 増えれば節も目次も自動で増える。`?raw` で読むのは、Tailwind が未使用の @theme 変数を
 * 出力から落とすため (詳しくは parse-theme.ts の冒頭)。dev では globals.css が
 * このモジュールの依存になるので、保存するとページごと作り直される。
 *
 * 手で書いているのはコンポーネントとパターンの節だけで、それも「id と文言」に限る。
 * ページ側は findCatalogSection(id) 経由でしか見出しを描けず、ここに無い id を書くと
 * ビルドが落ちる。目次とページの食い違いはそこで止まる。
 */

interface CatalogSection {
  id: string
  /** 目次と見出しに出る文言 */
  title: string
  /** 2 = 節、3 = 小節。selectTocHeadings が拾うのはこの 2 段だけ */
  depth: 2 | 3
}

export const TOKEN_GROUPS: TokenGroup[] = groupThemeTokens(parseThemeTokens(globalsCss))

const CATALOG_SECTIONS: CatalogSection[] = [
  { id: 'principles', title: '原則', depth: 2 },
  { id: 'tokens', title: 'トークン', depth: 2 },
  ...TOKEN_GROUPS.map(
    (group): CatalogSection => ({
      id: `token-${group.id}`,
      title: group.title,
      depth: 3,
    }),
  ),
  { id: 'components', title: 'コンポーネント', depth: 2 },
  { id: 'component-text', title: 'Text', depth: 3 },
  { id: 'component-page-header', title: 'PageHeader', depth: 3 },
  { id: 'component-button', title: 'Button', depth: 3 },
  { id: 'component-card', title: 'Card', depth: 3 },
  { id: 'component-dialog', title: 'Dialog', depth: 3 },
  { id: 'component-command', title: 'Command', depth: 3 },
  { id: 'component-timeline', title: 'Timeline', depth: 3 },
  { id: 'component-screen', title: 'Screen', depth: 3 },
  { id: 'patterns', title: 'パターン', depth: 2 },
  { id: 'pattern-focus', title: 'フォーカスリング', depth: 3 },
  { id: 'pattern-prose', title: '記事本文 (.note-content)', depth: 3 },
  { id: 'pattern-utilities', title: 'ユーティリティ', depth: 3 },
]

/** 右レールに渡す目次。記事の render() が返す headings と同じ形にしてある。 */
export const CATALOG_HEADINGS: MarkdownHeading[] = CATALOG_SECTIONS.map((section) => ({
  depth: section.depth,
  slug: section.id,
  text: section.title,
}))

/**
 * 見出しを 1 つ引く。無い id はビルド時に落とす — カタログのアンカーが目次から
 * 外れた状態で配信されるより、ビルドが止まったほうがよい。
 */
export function findCatalogSection(id: string): CatalogSection {
  const section = CATALOG_SECTIONS.find((candidate) => candidate.id === id)
  if (section === undefined) {
    throw new Error(`Unknown design system section: ${id}`)
  }
  return section
}
