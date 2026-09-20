'use client'

import { Button } from '@/components/ui/button'
import { useToastStore } from '@/stores/toast-store'

/* 実物を積む。押すと画面右下の Toaster (app/layout.tsx) に出るので、
   遅延読み込みと live region の挙動もそのまま確かめられる。 */
export function ToastDemo() {
  const notify = useToastStore((state) => state.notify)

  return (
    <div className="flex flex-wrap gap-gap">
      <Button
        variant="secondary"
        onClick={() => {
          notify({ title: 'リンクをコピーしました' })
        }}
      >
        通知を出す
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          notify({
            tone: 'error',
            title: '検索を読み込めませんでした',
            description: '通信を確かめて、開き直してください',
          })
        }}
      >
        失敗の通知を出す
      </Button>
    </div>
  )
}
