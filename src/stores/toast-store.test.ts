import { beforeEach, describe, expect, it } from 'vitest'
import { useToastStore } from './toast-store'

/* モジュールスコープのストアはテストをまたいで残る */
beforeEach(() => {
  useToastStore.setState({ toasts: [], hasNotified: false })
})

describe('notify', () => {
  it('開いた状態で積む', () => {
    useToastStore.getState().notify({ title: '保存しました' })

    const [toast] = useToastStore.getState().toasts
    expect(toast.title).toBe('保存しました')
    expect(toast.isOpen).toBe(true)
  })

  it('tone の既定は info', () => {
    useToastStore.getState().notify({ title: '保存しました' })

    expect(useToastStore.getState().toasts[0].tone).toBe('info')
  })

  it('積んだ順に並ぶ', () => {
    const { notify } = useToastStore.getState()

    notify({ title: '1 つ目' })
    notify({ title: '2 つ目' })

    expect(useToastStore.getState().toasts.map((toast) => toast.title)).toEqual([
      '1 つ目',
      '2 つ目',
    ])
  })

  it('id は重複しない', () => {
    const { notify } = useToastStore.getState()

    notify({ title: '1 つ目' })
    notify({ title: '2 つ目' })

    const [first, second] = useToastStore.getState().toasts
    expect(first.id).not.toBe(second.id)
  })

  it('hasNotified を立てる', () => {
    expect(useToastStore.getState().hasNotified).toBe(false)

    useToastStore.getState().notify({ title: '保存しました' })

    expect(useToastStore.getState().hasNotified).toBe(true)
  })
})

describe('dismiss', () => {
  it('閉じても配列からは抜かない（退場アニメーションのため）', () => {
    const { notify, dismiss } = useToastStore.getState()
    notify({ title: '保存しました' })
    const { id } = useToastStore.getState().toasts[0]

    dismiss(id)

    expect(useToastStore.getState().toasts).toHaveLength(1)
    expect(useToastStore.getState().toasts[0].isOpen).toBe(false)
  })

  it('指定した 1 つだけを閉じる', () => {
    const { notify, dismiss } = useToastStore.getState()
    notify({ title: '1 つ目' })
    notify({ title: '2 つ目' })
    const [first, second] = useToastStore.getState().toasts

    dismiss(first.id)

    const toasts = useToastStore.getState().toasts
    expect(toasts.find((toast) => toast.id === first.id)?.isOpen).toBe(false)
    expect(toasts.find((toast) => toast.id === second.id)?.isOpen).toBe(true)
  })

  it('知らない id では何も起きない', () => {
    const { notify, dismiss } = useToastStore.getState()
    notify({ title: '保存しました' })

    dismiss('toast-unknown')

    expect(useToastStore.getState().toasts[0].isOpen).toBe(true)
  })
})

describe('remove', () => {
  it('配列から抜く', () => {
    const { notify, remove } = useToastStore.getState()
    notify({ title: '保存しました' })
    const { id } = useToastStore.getState().toasts[0]

    remove(id)

    expect(useToastStore.getState().toasts).toEqual([])
  })

  it('すべて消しても hasNotified は下ろさない', () => {
    const { notify, remove } = useToastStore.getState()
    notify({ title: '保存しました' })

    remove(useToastStore.getState().toasts[0].id)

    expect(useToastStore.getState().hasNotified).toBe(true)
  })
})
