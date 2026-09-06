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

  useKeyboardShortcut({ key: 'k', metaKey: true, ctrlKey: true }, toggle)

  return (
    <>
      {/* ⌘ (U+2318) を文字で置くと、この 1 文字のために Noto Sans JP の CJK チャンク
           (25KB) を落とすことになるので図形で持つ。 */}
      <button
        type="button"
        aria-label="検索"
        onClick={toggle}
        className="inline-flex cursor-pointer items-center gap-0.5 rounded-xl bg-primary px-3 py-1 font-semibold text-primary-foreground text-sm"
      >
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
        K
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
