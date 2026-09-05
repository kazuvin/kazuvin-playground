'use client'

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
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import type { SearchableItem } from '@/lib/types'
import { fetchSearchIndex, filterSearchableItems, groupSearchableItemsByType } from './search-index'

/*
 * ⌘ (U+2318) を文字として置くと、この 1 文字のために Noto Sans JP の CJK チャンク
 * (25KB) を落とすことになる。ヘッダーは静的 HTML として即座に出るのに、記号だけが
 * 遅れて別の書体から差し替わっていた。書体に依存しない図形として持つ。
 *
 * 形は looped square そのもの: 一辺 6 の正方形の各辺を両端に 3 ずつ伸ばして交差させ、
 * 4 隅に半径 3 の輪を付ける。12px 角に置くと図形の実効高さが 10px になり、
 * 隣の "K" の cap height (14px × 約 0.68) とほぼ揃う。
 */
function CommandGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  )
}

/*
 * コマンドパレット。ヘッダーで唯一 island になる部品。
 *
 * 検索インデックスの URL と絞り込みの規則は ./search-index が持つ。ここに残すのは
 * 開閉と入力という UI の状態だけで、1 箇所でしか使わないのでフックには切り出さない。
 *
 * この island が自分でデータを取りに行くのは、Astro の island に渡せる props が
 * JSON 直列化できる値に限られ、ローダー関数を差し込めないため。
 */
export function CommandSearch() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<SearchableItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const close = () => {
    setOpen(false)
    setSearch('')
  }

  const toggle = () => {
    if (open) {
      close()
    } else {
      setOpen(true)
    }
  }

  // 開いたときに一度だけ取りに行く。閉じてもインデックスは捨てない
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

  useKeyboardShortcut({ key: 'k', metaKey: true, ctrlKey: true }, toggle)

  const groups = groupSearchableItemsByType(filterSearchableItems(items, search))

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label="検索"
        className="inline-flex cursor-pointer items-center gap-0.5 rounded-xl bg-primary px-3 py-1 font-semibold text-primary-foreground text-sm"
      >
        <CommandGlyph />K
      </button>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="max-w-lg p-0">
          <DialogTitle className="sr-only">検索</DialogTitle>
          <Command>
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
                        close()
                        window.location.href = item.url
                      }}
                      value={`${item.metadata.title} ${item.metadata.tags?.join(' ') ?? ''}`}
                    >
                      <div className="flex flex-1 items-center justify-between">
                        <div className="font-medium">{item.metadata.title}</div>
                        {item.metadata.tags && item.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.metadata.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-primary px-1.5 py-0.5 text-primary-foreground text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
