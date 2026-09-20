import { create } from 'zustand'
import { useToastStore } from '@/stores/toast-store'
import { fetchSearchIndex } from '../api/search-index'
import type { SearchableItem } from '../types/note'

/*
 * コマンドパレットの状態。開閉を持つのは、開く側 (components/layouts/command-search-trigger)
 * と中身 (components/command-search) が別の島で、共通の Client の祖先が無いため。
 * ストアなら Provider を立てずに両方から同じ値を見られる。
 */

/** ready / failed からは戻さない。インデックスはビルド時に固定された静的 JSON なので、
    開き直すたびに取り直す理由がない。 */
export type IndexStatus = 'idle' | 'loading' | 'ready' | 'failed'

interface CommandSearchState {
  isOpen: boolean
  query: string
  items: SearchableItem[]
  status: IndexStatus
  open: () => void
  close: () => void
  toggle: () => void
  setQuery: (query: string) => void
  loadIndex: () => Promise<void>
}

const INITIAL_STATE = {
  isOpen: false,
  query: '',
  items: [] as SearchableItem[],
  status: 'idle' as IndexStatus,
}

export const useCommandSearchStore = create<CommandSearchState>()((set, get) => ({
  ...INITIAL_STATE,

  open: () => {
    set({ isOpen: true })
  },

  /* 閉じ方は Esc・背景クリック・⌘K の 3 通りある。検索語を捨てる場所をここ 1 つに
     まとめておかないと、閉じたことを open の変化で拾い直す effect が要る。 */
  close: () => {
    set({ isOpen: false, query: '' })
  },

  toggle: () => {
    if (get().isOpen) {
      get().close()
    } else {
      get().open()
    }
  },

  setQuery: (query) => {
    set({ query })
  },

  /* 「一度だけ取る」の判定を render の外に置く。state を deps に入れた再入ガードだと、
     取得中の再レンダーごとに effect が評価し直される。 */
  loadIndex: async () => {
    if (get().status !== 'idle') {
      return
    }

    set({ status: 'loading' })

    try {
      set({ items: await fetchSearchIndex(), status: 'ready' })
    } catch (error) {
      /* 宛先が違う 2 つを両方出す。console は原因を追うためのスタックトレース、
         通知は「検索が使えない」という利用者向けの事実。 */
      console.error('検索インデックスを読み込めませんでした', error)
      useToastStore.getState().notify({
        tone: 'error',
        title: '検索を読み込めませんでした',
        description: '通信を確かめて、開き直してください',
      })
      set({ status: 'failed' })
    }
  },
}))
