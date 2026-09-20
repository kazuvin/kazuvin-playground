'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { IndexStatus } from '../stores/command-search-store'
import { useCommandSearchStore } from '../stores/command-search-store'
import { filterSearchableItems, groupSearchableItemsByType } from '../utils/search-index'

/* 読み込むのは command-search-trigger だけで、初めて開かれたときに next/dynamic
   越しに落ちてくる (docs/directory-structure.md)。開閉も検索語もストアが持つので、
   このファイルは「今の状態をどう見せるか」だけを持つ。 */

/* 取得に失敗したことを「0 件」と言わない。失敗の告知は通知が引き受けるので、
   ここは一覧が空である理由だけを短く出す。 */
function emptyMessage(status: IndexStatus): string {
  switch (status) {
    case 'loading':
      return '読み込み中...'
    case 'failed':
      return '検索を読み込めませんでした'
    case 'idle':
    case 'ready':
      return '検索結果が見つかりませんでした'
  }
}

export function CommandSearch() {
  const router = useRouter()
  const isOpen = useCommandSearchStore((state) => state.isOpen)
  const query = useCommandSearchStore((state) => state.query)
  const items = useCommandSearchStore((state) => state.items)
  const status = useCommandSearchStore((state) => state.status)
  const close = useCommandSearchStore((state) => state.close)
  const setQuery = useCommandSearchStore((state) => state.setQuery)
  const loadIndex = useCommandSearchStore((state) => state.loadIndex)

  /* 木に載るのは初めて開かれたときだけなので、mount がそのまま「初回に開かれた」。
     2 度目以降を弾くのはストアの status で、ここは呼ぶだけでよい。 */
  useEffect(() => {
    void loadIndex()
  }, [loadIndex])

  const groups = groupSearchableItemsByType(filterSearchableItems(items, query))

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        <DialogTitle className="sr-only">検索</DialogTitle>
        {/* 枠と角丸はダイアログが持っているので、Command 側は面だけ出す。
            両方が border を引くと 1px の線が二重に見える。 */}
        <Command className="rounded-none border-0 bg-transparent">
          <CommandInput placeholder="検索..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{emptyMessage(status)}</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.type} heading={group.type}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.url}
                    onSelect={() => {
                      close()
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
