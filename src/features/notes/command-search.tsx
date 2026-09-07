'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { SearchableItem } from '@/lib/types'
import { fetchSearchIndex, filterSearchableItems, groupSearchableItemsByType } from './search-index'

/* 読み込むのは command-search-trigger だけで、初めて開かれたときに next/dynamic
   越しに落ちてくる (docs/directory-structure.md)。 */

export interface CommandSearchProps {
  open: boolean
  /** Esc・背景クリック・⌘K のいずれで閉じてもここに来る */
  onClose: () => void
}

export function CommandSearch({ open, onClose }: CommandSearchProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<SearchableItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 開いたときに一度だけ。閉じてもインデックスは捨てない
  useEffect(() => {
    if (!open || items.length > 0 || isLoading) {
      return
    }

    setIsLoading(true)
    void fetchSearchIndex()
      .then(setItems)
      .catch((error: unknown) => {
        console.error('検索インデックスを読み込めませんでした', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [open, items.length, isLoading])

  // 閉じ方が 2 通り (Radix と ⌘K) あるので、ハンドラ側ではなく open の変化で拾う
  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  const groups = groupSearchableItemsByType(filterSearchableItems(items, search))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        <DialogTitle className="sr-only">検索</DialogTitle>
        {/* 枠と角丸はダイアログが持っているので、Command 側は面だけ出す。
            両方が border を引くと 1px の線が二重に見える。 */}
        <Command className="rounded-none border-0 bg-transparent">
          <CommandInput placeholder="検索..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>
              {isLoading ? '読み込み中...' : '検索結果が見つかりませんでした'}
            </CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.type} heading={group.type}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.url}
                    onSelect={() => {
                      onClose()
                      /* location.href だと App Router の外に出て、左レールごと組み直しになる */
                      router.push(item.url)
                    }}
                    value={`${item.metadata.title} ${item.metadata.tags?.join(' ') ?? ''}`}
                  >
                    <span className="flex-1 truncate font-medium">{item.metadata.title}</span>
                    {item.metadata.tags && item.metadata.tags.length > 0 && (
                      <span className="flex shrink-0 flex-wrap gap-gap-tight">
                        {item.metadata.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-chip border border-border-hairline px-1.5 py-0.5 text-2xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
