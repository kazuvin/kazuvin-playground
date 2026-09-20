import type { SearchableItem, SearchableItemType } from '../types/note'

/* 対象は ../api/search-index が取ってくる /notes-index.json の中身。 */

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
