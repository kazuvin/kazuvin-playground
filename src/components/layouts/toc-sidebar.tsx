'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/cn'
import { selectTocHeadings } from '@/lib/nav'
import type { MarkdownHeading } from '@/lib/types'

/** レールの中で現在地を動かすときに上下へ残す余白 */
const RAIL_MARGIN = 24

/** 見出しの scroll-margin-top と同じ値。lg 未満は左ナビが横バーとして上に被る。 */
function headingOffset(): number {
  return window.matchMedia('(min-width: 64rem)').matches ? 32 : 96
}

const GUIDE_GEOMETRY = {
  /* 1 階層の 1 文字目 (全角) の中央がガイドの列 */
  '--toc-guide-x': '0.5em',
  '--toc-mark-length': '1rem',
  '--toc-mark-top':
    'calc(var(--spacing-gap-tight) + (var(--leading-snug) * var(--text-sm) - 1rem) / 2)',
  '--toc-mark-end': 'calc(var(--toc-mark-top) + var(--toc-mark-length))',
} as CSSProperties

const GUIDE_BASE = "before:absolute before:left-0 before:w-px before:bg-border before:content-['']"

function guideExtentClasses(isFirst: boolean, isLast: boolean): string {
  if (isFirst && isLast) {
    return 'before:top-(--toc-mark-top) before:h-(--toc-mark-length)'
  }
  if (isFirst) {
    return 'before:top-(--toc-mark-top) before:bottom-0'
  }
  if (isLast) {
    return 'before:top-0 before:h-(--toc-mark-end)'
  }
  return 'before:top-0 before:bottom-0'
}

interface MarkerBox {
  /** <ul> の中での行の上端 (px) */
  top: number
  isNested: boolean
}

export interface TocSidebarProps {
  /** 段の絞り込み (h2 / h3) はここで行う。渡す側は素の見出し一覧でよい */
  headings?: MarkdownHeading[]
}

export function TocSidebar({ headings = [] }: TocSidebarProps) {
  const items = selectTocHeadings(headings)
  const railRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const linksRef = useRef(new Map<string, HTMLAnchorElement>())
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [marker, setMarker] = useState<MarkerBox | null>(null)

  /* IntersectionObserver は「入った / 出た」しか教えず、見出しが画面に 1 つも無い
     長い節でどれを点けるかを別に決める必要があるので、毎フレームの位置計算にしてある。 */
  useEffect(() => {
    const entries = items
      .map((heading) => ({ slug: heading.slug, element: document.getElementById(heading.slug) }))
      .filter((entry): entry is { slug: string; element: HTMLElement } => entry.element !== null)

    if (entries.length === 0) {
      return
    }

    function activeEntry(): string {
      // 最下部まで来たら最後の項目。画面より短い最後の節が一度も点かないのを防ぐ
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        return entries[entries.length - 1].slug
      }

      const threshold = headingOffset() + 1
      let current = entries[0].slug
      for (const entry of entries) {
        if (entry.element.getBoundingClientRect().top > threshold) {
          break
        }
        current = entry.slug
      }
      return current
    }

    let queued = false
    function schedule(): void {
      if (queued) {
        return
      }
      queued = true
      requestAnimationFrame(() => {
        queued = false
        setActiveSlug(activeEntry())
      })
    }

    setActiveSlug(activeEntry())
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [items])

  /* 矩形の差で測るのは、offsetTop が整数に丸められて 26.19px 刻みの行とずれるため */
  useEffect(() => {
    const list = listRef.current
    if (list === null) {
      return
    }

    function measure(): void {
      const listBox = listRef.current?.getBoundingClientRect()
      const link = activeSlug === null ? undefined : linksRef.current.get(activeSlug)
      if (listBox === undefined || link === undefined) {
        setMarker(null)
        return
      }

      const row = link.closest('li')
      if (row === null) {
        return
      }

      const isNested = link.dataset.depth === '3'
      const top = row.getBoundingClientRect().top - listBox.top

      setMarker((previous) => {
        // ガイドの無い行では位置を動かさない。線の無いところへ印が滑って見えるため
        if (!isNested) {
          if (previous === null) {
            return null
          }
          return previous.isNested ? { ...previous, isNested: false } : previous
        }
        return previous !== null && previous.top === top && previous.isNested
          ? previous
          : { top, isNested: true }
      })
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(list)

    return () => {
      observer.disconnect()
    }
  }, [activeSlug])

  /* 印の付いた項目までレール自体を送る (30 項目超の目次だと画面の外で光るため)。
     ページ側のスクロール位置には触らない。 */
  useEffect(() => {
    const rail = railRef.current
    const link = activeSlug === null ? undefined : linksRef.current.get(activeSlug)

    if (rail === null || link === undefined) {
      return
    }

    const railBox = rail.getBoundingClientRect()
    const linkBox = link.getBoundingClientRect()

    if (linkBox.top < railBox.top + RAIL_MARGIN) {
      rail.scrollTop -= railBox.top + RAIL_MARGIN - linkBox.top
    } else if (linkBox.bottom > railBox.bottom - RAIL_MARGIN) {
      rail.scrollTop += linkBox.bottom - (railBox.bottom - RAIL_MARGIN)
    }
  }, [activeSlug])

  if (items.length === 0) {
    return null
  }

  return (
    <aside
      ref={railRef}
      className="sticky top-0 hidden h-dvh w-fit max-w-full self-start overflow-y-auto scroll-smooth px-edge-h pt-edge-top pb-edge-bottom text-base xl:block"
    >
      <nav aria-labelledby="toc-label" className="motion-safe:animate-fade-slide-left">
        <Text role="overline" id="toc-label">
          On this page
        </Text>
        {/* text-sm は 0.5em を 13px 基準で読ませるため。行の <a> と同じ値 */}
        <ul
          ref={listRef}
          style={GUIDE_GEOMETRY}
          className="relative mt-block-tight flex flex-col text-sm"
        >
          {marker !== null && (
            <span
              aria-hidden="true"
              style={{ transform: `translateY(${marker.top}px)` }}
              className={cn(
                'absolute top-(--toc-mark-top) left-(--toc-guide-x) z-10 h-(--toc-mark-length) w-px bg-foreground motion-safe:transition-[transform,opacity] motion-safe:duration-200 motion-safe:ease-standard',
                marker.isNested ? 'opacity-100' : 'opacity-0',
              )}
            />
          )}
          {items.map((heading, index) => {
            const isActive = heading.slug === activeSlug

            return (
              <li
                key={heading.slug}
                className={
                  heading.depth === 3
                    ? cn(
                        'relative ml-(--toc-guide-x) pl-[1em]',
                        GUIDE_BASE,
                        guideExtentClasses(
                          items[index - 1]?.depth !== 3,
                          items[index + 1]?.depth !== 3,
                        ),
                      )
                    : undefined
                }
              >
                <a
                  ref={(node) => {
                    const links = linksRef.current
                    if (node !== null) {
                      links.set(heading.slug, node)
                    }
                    return () => {
                      links.delete(heading.slug)
                    }
                  }}
                  href={`#${heading.slug}`}
                  data-depth={heading.depth}
                  data-active={isActive ? 'true' : undefined}
                  aria-current={isActive ? 'location' : undefined}
                  className="block py-gap-tight text-sm text-subtle-foreground leading-snug transition-colors duration-120 ease-standard hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground"
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
