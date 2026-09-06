import Link from 'next/link'
import type { CSSProperties } from 'react'
import logo from '@/assets/logo.png'
import { APP_NAME, NAV_ITEMS } from '@/config/app'
import { CommandSearchTrigger } from './command-search-trigger'
import { MobileNav } from './mobile-nav'
import { SiteNav } from './site-nav'

/** lg 以上の auto トラックの下限。「一番長いラベル + 左右の px-edge-h」と、右レールと
    同じ 15rem の広いほう。ラベルだけに張り付かせると、幅を借りている検索フィールドが
    13ch まで縮んで「検索」と ⌘K が詰まる。ch はレールの text-sm (13px) で読む。
    min-* なのは auto / h-dvh の性質を殺さないため。 */
const RAIL_MIN_WIDTH = `max(calc(${Math.max(...NAV_ITEMS.map((item) => item.label.length))}ch + 2 * var(--spacing-edge-h)), 15rem)`

/* カスタムプロパティは CSSProperties の索引に無いので、ここでだけ形を合わせる */
const RESERVED_SIZE = {
  '--rail-min-w': RAIL_MIN_WIDTH,
} as CSSProperties

export function AppSidebar() {
  return (
    <aside
      style={RESERVED_SIZE}
      className="sticky top-0 z-20 self-start border-border-hairline border-b bg-background/80 px-edge-h py-gap text-sm backdrop-blur-2xl lg:h-dvh lg:min-w-(--rail-min-w) lg:overflow-y-auto lg:border-b-0 lg:bg-transparent lg:pt-edge-top lg:pb-edge-bottom lg:backdrop-blur-none"
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
        <MobileNav />
      </div>

      <SiteNav />
    </aside>
  )
}
