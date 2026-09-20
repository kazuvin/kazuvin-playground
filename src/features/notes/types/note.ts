/*
 * notes feature の中だけで使う型。ここに置けるのは「この feature の外に出ない」ものだけで、
 * 目次の MarkdownHeading のように layouts や他 feature も知る必要がある型は @/lib/types に残す。
 */

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

/** 一覧表示用。変換は ../api/notes.ts の toNoteSummary。 */
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
