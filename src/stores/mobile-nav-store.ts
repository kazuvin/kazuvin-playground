import { create } from 'zustand'

/*
 * lg 未満で出るナビパネルの開閉。mobile-nav が useState で持たずストアにあるのは、
 * ⌘K を受ける command-search-trigger が別の島から閉じる必要があるため。
 * ショートカットは幅に関係なく効くので、パネルを開いたままパレットを開ける。
 */

interface MobileNavState {
  isOpen: boolean
  close: () => void
  toggle: () => void
}

export const useMobileNavStore = create<MobileNavState>()((set) => ({
  isOpen: false,

  close: () => {
    set({ isOpen: false })
  },

  toggle: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },
}))
