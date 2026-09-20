import type { SearchableItem } from '../types/note'

/* 実体は src/app/notes-index.json/route.ts がビルド時に出力する静的 JSON。
   絞り込みとグループ化は ../utils/search-index。 */
const SEARCH_INDEX_URL = '/notes-index.json'

/** 検索インデックスを取得する。ダイアログを開いた時点で初めて呼ばれる。 */
export async function fetchSearchIndex(): Promise<SearchableItem[]> {
  const response = await fetch(SEARCH_INDEX_URL)

  if (!response.ok) {
    throw new Error(
      `検索インデックスを取得できませんでした: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as SearchableItem[]
}
