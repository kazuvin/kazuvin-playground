import { beforeEach, describe, expect, it } from 'vitest'
import { useMobileNavStore } from './mobile-nav-store'

/* モジュールスコープのストアはテストをまたいで残る */
beforeEach(() => {
  useMobileNavStore.setState({ isOpen: false })
})

describe('useMobileNavStore', () => {
  it('はじめは閉じている', () => {
    expect(useMobileNavStore.getState().isOpen).toBe(false)
  })

  it('toggle で開閉が反転する', () => {
    const { toggle } = useMobileNavStore.getState()

    toggle()
    expect(useMobileNavStore.getState().isOpen).toBe(true)

    toggle()
    expect(useMobileNavStore.getState().isOpen).toBe(false)
  })

  it('close は開いていれば閉じる', () => {
    const { toggle, close } = useMobileNavStore.getState()

    toggle()
    close()

    expect(useMobileNavStore.getState().isOpen).toBe(false)
  })

  it('close は閉じているときに呼んでも変わらない', () => {
    useMobileNavStore.getState().close()

    expect(useMobileNavStore.getState().isOpen).toBe(false)
  })
})
