'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/* 開閉の state を Radix の Root が持つので、境界を割らずひとまとまりの Client にする。 */
function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ダイアログ</DialogTitle>
          <DialogDescription>
            タイトルは 14 / 600、説明は 13 / 400。面は card、境界は 1px の border で、
            影は使わない。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>確定する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DialogDemo }
