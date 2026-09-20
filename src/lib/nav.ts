import type { MarkdownHeading } from './types'

/**
 * `/notes` は `/notes/:slug` でも点灯させたいので前方一致。区切りの `/` を要求して
 * `/notes-index` のような別ルートは拾わない。
 */
export function isActiveNavItem(pathname: string, href: string): boolean {
  const current = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return current === href || current.startsWith(`${href}/`)
}

/** h1 はページタイトルと重複し、h4 は 240px のレールで階層が潰れるので h2 / h3 だけ。 */
export function selectTocHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
  return headings.filter((heading) => heading.depth === 2 || heading.depth === 3)
}

export interface TocViewport {
  scrollY: number
  viewportHeight: number
  scrollHeight: number
  /** 見出しの scroll-margin-top。この位置を越えた見出しが現在地になる */
  offset: number
}

/**
 * 目次の判定線 (ビューポート座標)。
 *
 * 線を `offset` に固定すると、末尾の節が画面より短いときスクロールが先に尽きて
 * 後ろの見出しが線を越えられず、まとめて飛ばされる。そこで残りのスクロール量が
 * 尽きるまでの間に、線を `offset` から画面下端まで滑らせて全部の見出しを通す。
 */
export function tocActiveLine({
  scrollY,
  viewportHeight,
  scrollHeight,
  offset,
}: TocViewport): number {
  const maxScroll = Math.max(scrollHeight - viewportHeight, 0)
  const travel = viewportHeight - offset
  // 線を滑らせるのに使えるスクロール量。スクロールできないページでは線を動かさない
  const span = Math.min(travel, maxScroll)
  if (span <= 0) {
    return offset
  }

  const progress = Math.min(Math.max(1 - (maxScroll - scrollY) / span, 0), 1)
  return offset + travel * progress
}

export interface TocHeadingPosition {
  slug: string
  /** ビューポート座標の上端 (getBoundingClientRect().top) */
  top: number
}

/**
 * 判定線を越えた最後の見出しが現在地。
 *
 * 1 つも越えていなくても先頭を点けるのは、ページ最上部で目次が消灯しないため。
 * 並びは文書順である前提で、越えていないものが出た時点で打ち切る。
 */
export function selectActiveHeading(positions: TocHeadingPosition[], line: number): string | null {
  let current: string | null = positions[0]?.slug ?? null

  for (const position of positions) {
    if (position.top > line) {
      break
    }
    current = position.slug
  }

  return current
}
