'use client'

import { useEffect, useRef, useState } from 'react'
import { Text } from '@/components/ui/text'
import { selectTocHeadings } from '@/lib/nav'
import type { MarkdownHeading } from '@/lib/types'

/** レールの中で現在地を動かすときに上下へ残す余白 */
const RAIL_MARGIN = 24

/** 見出しの scroll-margin-top と同じ値。lg 未満は左ナビが横バーとして上に被る。 */
function headingOffset(): number {
  return window.matchMedia('(min-width: 64rem)').matches ? 32 : 96
}

export interface TocSidebarProps {
  /** 段の絞り込み (h2 / h3) はここで行う。渡す側は素の見出し一覧でよい */
  headings?: MarkdownHeading[]
}

export function TocSidebar({ headings = [] }: TocSidebarProps) {
  const items = selectTocHeadings(headings)
  const railRef = useRef<HTMLElement>(null)
  const linksRef = useRef(new Map<string, HTMLAnchorElement>())
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

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
      <nav aria-labelledby="toc-label">
        <Text role="overline" id="toc-label">
          On this page
        </Text>
        <ul className="mt-block-tight flex flex-col gap-gap-tight">
          {items.map((heading) => {
            const isActive = heading.slug === activeSlug

            return (
              <li key={heading.slug} className={heading.depth === 3 ? 'pl-block-tight' : undefined}>
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
                  data-active={isActive ? 'true' : undefined}
                  aria-current={isActive ? 'location' : undefined}
                  className="block text-sm text-subtle-foreground leading-snug transition-colors duration-120 ease-standard hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground"
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
