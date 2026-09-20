import { create } from 'zustand'

/*
 * 通知の待ち行列。積む側 (features / layouts) と描く側 (components/layouts/toast-list)
 * が別の島なので、共通の Client の祖先を作らずに済むようストアで持つ。
 *
 * Kotoba にステータス色は無いので、tone が変えるのは見た目ではなく
 * 「読み上げの強さと表示時間」だけ。
 */

/* 外から使う場面が出たら export する。今は ToastItem['tone'] で引ける */
type ToastTone = 'info' | 'error'

export interface ToastItem {
  id: string
  tone: ToastTone
  title: string
  description?: string
  /** false にしても木からは離さない。退場アニメーションを最後まで描くため (削除は remove) */
  isOpen: boolean
}

interface ToastState {
  toasts: ToastItem[]
  /** 一度でも通知したか。Toaster がここを見て、初回だけ Radix のチャンクを落とす */
  hasNotified: boolean
  notify: (input: { tone?: ToastTone; title: string; description?: string }) => void
  dismiss: (id: string) => void
  remove: (id: string) => void
}

/* 連番で足りる。同一セッション内で重複しなければよく、生の Date は lint で禁止されている */
let lastId = 0

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  hasNotified: false,

  notify: ({ tone = 'info', title, description }) => {
    lastId += 1
    const item: ToastItem = { id: `toast-${lastId}`, tone, title, description, isOpen: true }

    set((state) => ({ toasts: [...state.toasts, item], hasNotified: true }))
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.map((toast) => (toast.id === id ? { ...toast, isOpen: false } : toast)),
    }))
  },

  remove: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))
