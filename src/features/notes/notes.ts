import { type CollectionEntry, getCollection } from 'astro:content'
import type { NoteSummary, SearchableItem } from '@/lib/types'

/** notes コレクションのエントリ */
export type NoteEntry = CollectionEntry<'notes'>

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換する
 * frontmatter は Date にパースされるが、UI と検索インデックスは文字列で扱う
 */
function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/**
 * 公開済みのノートを新しい順に取得する
 * draft: true のノートは除外される
 */
export async function getPublishedNotes(): Promise<NoteEntry[]> {
  const notes = await getCollection('notes', ({ data }) => !data.draft)
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

/**
 * コレクションのエントリを一覧表示用の形に変換する
 */
export function toNoteSummary(entry: NoteEntry): NoteSummary {
  return {
    slug: entry.id,
    metadata: {
      title: entry.data.title,
      date: toDateString(entry.data.date),
      description: entry.data.description,
      tags: entry.data.tags,
    },
  }
}

/**
 * コレクションのエントリを検索インデックスの項目に変換する
 */
export function toSearchableItem(entry: NoteEntry): SearchableItem {
  return {
    type: 'note',
    url: `/notes/${entry.id}`,
    metadata: {
      title: entry.data.title,
      date: toDateString(entry.data.date),
      description: entry.data.description,
      tags: entry.data.tags,
    },
  }
}
