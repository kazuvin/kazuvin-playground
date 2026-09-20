'use client'

import dynamic from 'next/dynamic'
import { useToastStore } from '@/stores/toast-store'

const ToastList = dynamic(
  // oxlint-disable-next-line kazuvin/no-namespace-import -- 遅延読み込みそのものが目的。動的 import は名前空間の取り込みとして拾われるが、静的な import に直すと分けた意味が無くなる
  async () => (await import('./toast-list')).ToastList,
  { ssr: false },
)

/*
 * 通知が一度も積まれていないあいだ Radix Toast のチャンクを要求しない
 * (command-search-trigger と同じ形)。見ているのが toasts.length ではなく
 * hasNotified なのは、最後の 1 つが消えるたびに live region ごと外すと、
 * 次の通知が読み上げられない恐れがあるため。一度出したら出したままにする。
 */
export function Toaster() {
  const hasNotified = useToastStore((state) => state.hasNotified)

  return hasNotified ? <ToastList /> : null
}
