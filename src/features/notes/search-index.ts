import type { SearchableItem, SearchableItemType } from '@/lib/types'

/*
 * コマンドパレットが引く検索インデックス。
 *
 * 実体は src/pages/notes-index.json.ts がビルド時に出力する静的 JSON で、
 * この 2 ファイルだけが URL と中身の形を知っている。features/notes の他の関数と違い、
 * fetchSearchIndex だけはブラウザ（island）で実行される。ノートが増えるほど
 * インデックスも育つので、全ページの HTML に埋め込まず遅延取得している。
 */
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

/**
 * 検索語で絞り込む。タイトル・説明・タグを横断して部分一致で見る。
 *
 * 大文字小文字は無視する。空の検索語は「絞り込まない」を意味し、全件を返す。
 */
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

/**
 * 種類ごとにまとめる。
 *
 * 並び順は元の配列で最初に現れた順を保つ。インデックスは公開日の降順で作られるので、
 * 新しいノートを持つ種類が上に来る。
 */
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
