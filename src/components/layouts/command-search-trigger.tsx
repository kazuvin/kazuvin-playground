'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'

const CommandSearch = dynamic(
  // biome-ignore lint/style/noRestrictedImports: 遅延読み込みそのものが目的。動的 import は名前空間の取り込みとして拾われるが、静的な import に直すと分けた意味が無くなる
  async () => (await import('@/features/notes/command-search')).CommandSearch,
  { ssr: false },
)

export function CommandSearchTrigger() {
  /* false のあいだ <CommandSearch /> は木に無く、チャンクの要求も起きない */
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  function toggle(): void {
    setIsMounted(true)
    setIsOpen((previous) => !previous)
  }

  /* ボタンは lg 未満で隠れる (行き先はハンバーガーが引き取る) が、⌘K は幅に
     関係なく受ける。キーボードのある狭い窓から閉め出さないため。 */
  useKeyboardShortcut({ key: 'k', metaKey: true, ctrlKey: true }, toggle)

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-keyshortcuts="Meta+K Control+K"
        className="hidden h-control w-full cursor-pointer items-center gap-gap rounded-control border border-input bg-background px-3 text-muted-foreground text-sm transition-colors duration-120 ease-standard hover:bg-muted lg:inline-flex"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5 shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4.35-4.35" />
        </svg>
        <span className="flex-1 text-left">検索</span>
        {/* ⌘ (U+2318) を文字で置くと、この 1 文字のために Noto Sans JP の CJK チャンク
            (25KB) を落とすことになるので図形で持つ。 */}
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-0.5 rounded-sm border border-border-hairline bg-background px-1 py-0.5 text-2xs"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-2.5"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          K
        </span>
      </button>
      {isMounted && (
        <CommandSearch
          open={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
        />
      )}
    </>
  )
}
