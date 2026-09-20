'use client'

import { useEffect } from 'react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import type { ToastItem } from '@/stores/toast-store'
import { useToastStore } from '@/stores/toast-store'

/* 落ちてくるのは初めて通知が積まれたときだけ (toaster.tsx の next/dynamic)。 */

/** --animate-fade-out と同じ長さ。閉じてから木を離れるまでの猶予 */
const EXIT_MS = 200

/** 失敗は読み飛ばされると気づけないので長く置く */
const DURATION_MS: Record<ToastItem['tone'], number> = { info: 5000, error: 10000 }

function ToastRow({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((state) => state.dismiss)
  const remove = useToastStore((state) => state.remove)

  /* 閉じた印が付いてから実際に消すまでを遅らせる。ここで即座に配列から抜くと、
     Radix が退場アニメーションを描き切る前に木から外れる。 */
  useEffect(() => {
    if (toast.isOpen) {
      return
    }

    const timer = setTimeout(() => {
      remove(toast.id)
    }, EXIT_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [toast.isOpen, toast.id, remove])

  return (
    <Toast
      open={toast.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          dismiss(toast.id)
        }
      }}
      /* foreground = aria-live="assertive"。読み上げの強さはここだけで決まる */
      type={toast.tone === 'error' ? 'foreground' : 'background'}
      duration={DURATION_MS[toast.tone]}
    >
      <div className="min-w-0 flex-1">
        <ToastTitle>{toast.title}</ToastTitle>
        {toast.description !== undefined && (
          <ToastDescription>{toast.description}</ToastDescription>
        )}
      </div>
      <ToastClose />
    </Toast>
  )
}

export function ToastList() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
