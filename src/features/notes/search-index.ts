import type { SearchableItem, SearchableItemType } from '@/lib/types'

/* 実体は src/app/notes-index.json/route.ts がビルド時に出力する静的 JSON。 */
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

/** タイトル・説明・タグを横断した部分一致。空の検索語は全件を返す。 */
export function filterSearchableItems(items: SearchableItem[], query: string): SearchableItem[] {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return items
  }

  return items.filter(({ metadata }) => {
    const inTitle = metadata.title.toLowerCase().includes(normalized)
    const inDescription = metadata.description?.toLowerCase().includes(normalized) ?? false
    const inTags = metadata.tags?.some((tag) => tag.toLowerCase().includes(normalized)) ?? false

    return inTitle || inDescription || inTags
  })
}

export interface SearchableItemGroup {
  type: SearchableItemType
  items: SearchableItem[]
}

/** 並びは元の配列で最初に現れた順のまま。 */
export function groupSearchableItemsByType(items: SearchableItem[]): SearchableItemGroup[] {
  const groups: SearchableItemGroup[] = []

  for (const item of items) {
    const group = groups.find((candidate) => candidate.type === item.type)

    if (group) {
      group.items.push(item)
    } else {
      groups.push({ type: item.type, items: [item] })
    }
  }

  return groups
}
