import Link from 'next/link'
import type { CSSProperties } from 'react'
import logo from '@/assets/logo.png'
import { APP_NAME, NAV_ITEMS } from '@/config/app'
import { CommandSearchTrigger } from './command-search-trigger'
import { SiteNav } from './site-nav'

/*
 * 下の 2 つは初回描画で <nav> が parse される前に箱を確保するためにある。外すと
 * lg 以上ではページ全体が 41.6px 横に飛び、lg 未満では <main> が 36px 下がる。
 * min-* なのは auto / h-dvh の性質を殺さないため。
 */

/** 一番長いラベル + 左右の px-edge-h。lg 以上の auto トラックの下限になる */
const RAIL_MIN_WIDTH = `calc(${Math.max(...NAV_ITEMS.map((item) => item.label.length))}ch + 2 * var(--spacing-edge-h))`

/** py-gap ×2 + ロゴ行 (h-8) + ナビの mt-gap + ナビ 1 行 + 下端の hairline */
const BAR_MIN_HEIGHT =
  'calc(2 * var(--spacing-gap) + 8 * var(--spacing) + var(--spacing-gap) + 2 * var(--spacing-gap-tight) + var(--text-base--line-height) + 1px)'

/* カスタムプロパティは CSSProperties の索引に無いので、ここでだけ形を合わせる */
const RESERVED_SIZE = {
  '--rail-min-w': RAIL_MIN_WIDTH,
  '--bar-min-h': BAR_MIN_HEIGHT,
} as CSSProperties

export function AppSidebar() {
  return (
    <aside
      style={RESERVED_SIZE}
      className="sticky top-0 z-20 min-h-(--bar-min-h) self-start border-border-hairline border-b bg-background/80 px-edge-h py-gap text-base backdrop-blur-2xl lg:h-dvh lg:min-w-(--rail-min-w) lg:overflow-y-auto lg:border-b-0 lg:bg-transparent lg:pt-edge-top lg:pb-edge-bottom lg:backdrop-blur-none"
    >
      <div className="flex items-center justify-between gap-gap lg:flex-col lg:items-start lg:gap-block-tight">
        <Link
          href="/"
          className="inline-flex transition-opacity duration-120 ease-standard hover:opacity-70"
        >
          {/* biome-ignore lint/performance/noImgElement: Static Export に画像最適化サーバーは無い (docs/directory-structure.md) */}
          <img
            src={logo.src}
            alt={APP_NAME}
            width={logo.width}
            height={logo.height}
            className="h-8 w-auto lg:h-10"
          />
        </Link>
        <CommandSearchTrigger />
      </div>

      <SiteNav />
    </aside>
  )
}
