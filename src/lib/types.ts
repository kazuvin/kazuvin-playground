/**
 * 記事やカタログの見出し 1 つ。出所は MDX (features/notes/mdx.ts) と
 * デザインシステムのカタログ (features/design-system/catalog.ts) の 2 つで、
 * 目次側はこの形しか知らない。
 */
export interface MarkdownHeading {
  /** 見出しの段。h2 なら 2 */
  depth: number
  slug: string
  text: string
}

export type SearchableItemType = 'note' | 'playground'

interface SearchableMetadata {
  title: string
  /** YYYY-MM-DD */
  date: string
  description?: string
  tags?: string[]
}

/** コマンドパレットが fetch する /notes-index.json の 1 件。 */
export interface SearchableItem {
  type: SearchableItemType
  metadata: SearchableMetadata
  url: string
}

/** 一覧表示用。変換は features/notes/notes.ts の toNoteSummary。 */
export interface NoteSummary {
  slug: string
  metadata: {
    title: string
    /** YYYY-MM-DD */
    date: string
    description?: string
    tags: string[]
  }
}

/** ホームのタイムライン用に月でまとめたもの。 */
export interface NotesByMonth {
  /** 表示用の月ラベル (例: "2025年11月") */
  label: string
  notes: SearchableItem[]
}
