'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

/*
 * 画面に入るまで mount しない。cmdk は mount 時に先頭の項目へ scrollIntoView を掛け、
 * 画面外だとページごとその位置 (実測 12,000px 付近) まで飛ぶため。
 * 箱の高さ (h-64) を外側が先に持つのは、中身が入っても下の節を動かさないため。
 */
export function CommandDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (node === null) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIsVisible(true)
        // 一度出したら戻さない。カタログなので、隠れたあとに畳む理由がない
        observer.disconnect()
      }
    })
    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="h-64">
      {isVisible && (
        <Command className="h-full">
          <CommandInput placeholder="絞り込む…" />
          <CommandList>
            <CommandEmpty>見つかりませんでした</CommandEmpty>
            <CommandGroup heading="Notes">
              <CommandItem>
                はじめてのノート
                <CommandShortcut>⏎</CommandShortcut>
              </CommandItem>
              <CommandItem>2 つ目のノート</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Playgrounds">
              <CommandItem>デザインシステム</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  )
}
