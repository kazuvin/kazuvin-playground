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
