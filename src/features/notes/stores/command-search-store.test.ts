import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchSearchIndex } from '../api/search-index'
import type { SearchableItem } from '../types/note'
import { useCommandSearchStore } from './command-search-store'

vi.mock('../api/search-index', () => ({
  fetchSearchIndex: vi.fn(),
}))

const fetchSearchIndexMock = vi.mocked(fetchSearchIndex)

function item(title: string): SearchableItem {
  return {
    type: 'note',
    url: `/notes/${title}`,
    metadata: { title, date: '2025-11-03' },
  }
}

/* モジュールスコープのストアはテストをまたいで残る */
beforeEach(() => {
  useCommandSearchStore.setState({ isOpen: false, query: '', items: [], status: 'idle' })
  fetchSearchIndexMock.mockReset()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('開閉', () => {
  it('open で開き、close で閉じる', () => {
    const { open, close } = useCommandSearchStore.getState()

    open()
    expect(useCommandSearchStore.getState().isOpen).toBe(true)

    close()
    expect(useCommandSearchStore.getState().isOpen).toBe(false)
  })

  it('toggle は現在の開閉を反転する', () => {
    const { toggle } = useCommandSearchStore.getState()

    toggle()
    expect(useCommandSearchStore.getState().isOpen).toBe(true)

    toggle()
    expect(useCommandSearchStore.getState().isOpen).toBe(false)
  })

  it('閉じると検索語が消える', () => {
    const { open, setQuery, close } = useCommandSearchStore.getState()

    open()
    setQuery('astro')
    expect(useCommandSearchStore.getState().query).toBe('astro')

    close()
    expect(useCommandSearchStore.getState().query).toBe('')
  })

  it('toggle で閉じたときも検索語が消える', () => {
    const { toggle, setQuery } = useCommandSearchStore.getState()

    toggle()
    setQuery('astro')
    toggle()

    expect(useCommandSearchStore.getState().query).toBe('')
  })

  it('開いてもインデックスは捨てない', async () => {
    fetchSearchIndexMock.mockResolvedValue([item('ノート')])
    const { loadIndex, close, open } = useCommandSearchStore.getState()

    await loadIndex()
    close()
    open()

    expect(useCommandSearchStore.getState().items).toHaveLength(1)
  })
})

describe('loadIndex', () => {
  it('取得できたら items と status を進める', async () => {
    const items = [item('ノート 1'), item('ノート 2')]
    fetchSearchIndexMock.mockResolvedValue(items)

    await useCommandSearchStore.getState().loadIndex()

    expect(useCommandSearchStore.getState().items).toEqual(items)
    expect(useCommandSearchStore.getState().status).toBe('ready')
  })

  it('2 回呼んでも取りに行くのは 1 度だけ', async () => {
    fetchSearchIndexMock.mockResolvedValue([item('ノート')])
    const { loadIndex } = useCommandSearchStore.getState()

    await loadIndex()
    await loadIndex()

    expect(fetchSearchIndexMock).toHaveBeenCalledTimes(1)
  })

  it('取得中に呼ばれても二重に取りに行かない', async () => {
    fetchSearchIndexMock.mockResolvedValue([item('ノート')])
    const { loadIndex } = useCommandSearchStore.getState()

    await Promise.all([loadIndex(), loadIndex()])

    expect(fetchSearchIndexMock).toHaveBeenCalledTimes(1)
  })

  it('失敗しても投げずに status を failed にする', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchSearchIndexMock.mockRejectedValue(new Error('offline'))

    await expect(useCommandSearchStore.getState().loadIndex()).resolves.toBeUndefined()

    expect(useCommandSearchStore.getState().status).toBe('failed')
    expect(useCommandSearchStore.getState().items).toEqual([])
    expect(consoleError).toHaveBeenCalled()
  })

  it('失敗した後は取り直さない', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchSearchIndexMock.mockRejectedValue(new Error('offline'))
    const { loadIndex } = useCommandSearchStore.getState()

    await loadIndex()
    await loadIndex()

    expect(fetchSearchIndexMock).toHaveBeenCalledTimes(1)
  })
})
