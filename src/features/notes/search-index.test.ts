import { describe, expect, it } from 'vitest'
import type { SearchableItem } from '@/lib/types'
import { filterSearchableItems, groupSearchableItemsByType } from './search-index'

function item(
  overrides: Partial<SearchableItem> & { title: string } & {
    description?: string
    tags?: string[]
  },
): SearchableItem {
  const { title, description, tags, ...rest } = overrides

  return {
    type: 'note',
    url: `/notes/${title}`,
    metadata: { title, date: '2025-11-03', description, tags },
    ...rest,
  }
}

describe('filterSearchableItems', () => {
  const items = [
    item({ title: 'Astro を始める', description: '静的サイトの入門', tags: ['astro'] }),
    item({ title: 'React Compiler', description: 'メモ化の自動化', tags: ['react', 'perf'] }),
    item({ title: 'タグなしのノート' }),
  ]

  it('空の検索語では絞り込まない', () => {
    expect(filterSearchableItems(items, '')).toEqual(items)
  })

  it('空白だけの検索語も絞り込まない', () => {
    expect(filterSearchableItems(items, '   ')).toEqual(items)
  })

  it('タイトルの部分一致で拾う', () => {
    const result = filterSearchableItems(items, 'astro')

    expect(result).toHaveLength(1)
    expect(result[0]?.metadata.title).toBe('Astro を始める')
  })

  it('大文字小文字を無視する', () => {
    expect(filterSearchableItems(items, 'REACT')).toHaveLength(1)
  })

  it('説明の部分一致で拾う', () => {
    const result = filterSearchableItems(items, 'メモ化')

    expect(result[0]?.metadata.title).toBe('React Compiler')
  })

  it('タグの部分一致で拾う', () => {
    const result = filterSearchableItems(items, 'perf')

    expect(result[0]?.metadata.title).toBe('React Compiler')
  })

  it('description / tags を持たない項目でも落ちない', () => {
    expect(filterSearchableItems(items, 'タグなし')).toHaveLength(1)
  })

  it('どれにも一致しなければ空を返す', () => {
    expect(filterSearchableItems(items, 'まったく無い語')).toEqual([])
  })
})

describe('groupSearchableItemsByType', () => {
  it('種類ごとにまとめる', () => {
    const items = [
      item({ title: 'ノート 1' }),
      item({ title: '実験 1', type: 'playground' }),
      item({ title: 'ノート 2' }),
    ]

    const groups = groupSearchableItemsByType(items)

    expect(groups).toHaveLength(2)
    expect(groups[0]?.type).toBe('note')
    expect(groups[0]?.items).toHaveLength(2)
    expect(groups[1]?.type).toBe('playground')
    expect(groups[1]?.items).toHaveLength(1)
  })

  it('最初に現れた順を保つ', () => {
    const groups = groupSearchableItemsByType([
      item({ title: '実験', type: 'playground' }),
      item({ title: 'ノート' }),
    ])

    expect(groups.map((group) => group.type)).toEqual(['playground', 'note'])
  })

  it('空配列では空を返す', () => {
    expect(groupSearchableItemsByType([])).toEqual([])
  })
})
