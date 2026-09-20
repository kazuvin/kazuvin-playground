'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useCommandSearchStore } from '@/features/notes/stores/command-search-store'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useMobileNavStore } from '@/stores/mobile-nav-store'

const CommandSearch = dynamic(
  // oxlint-disable-next-line kazuvin/no-namespace-import -- 遅延読み込みそのものが目的。動的 import は名前空間の取り込みとして拾われるが、静的な import に直すと分けた意味が無くなる
  async () => (await import('@/features/notes/components/command-search')).CommandSearch,
  { ssr: false },
)

export function CommandSearchTrigger() {
  /* false のあいだ <CommandSearch /> は木に無く、チャンクの要求も起きない。
     ストアではなくここに置くのは、ドメインの状態ではなく描画の都合だから。 */
  const [isMounted, setIsMounted] = useState(false)
  const toggleSearch = useCommandSearchStore((state) => state.toggle)
  const closeMobileNav = useMobileNavStore((state) => state.close)

  function toggle(): void {
    setIsMounted(true)
    /* パレットとナビパネルを同時に開かない。⌘K は幅に関係なく効くので、lg 未満では
       パネルが開いたまま重なりうる (パネルはダイアログの背面に残り、閉じても開いたまま)。
       両方を知ってよいのは層として app に立つ layouts だけなので、ここで断つ。 */
    closeMobileNav()
    toggleSearch()
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
        className="hidden h-control w-full cursor-pointer items-center gap-gap rounded-control border border-input bg-background px-3 text-sm text-muted-foreground transition-colors duration-120 ease-standard hover:bg-muted lg:inline-flex"
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
      {isMounted && <CommandSearch />}
    </>
  )
}
