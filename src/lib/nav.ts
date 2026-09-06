import type { MarkdownHeading } from 'astro'

/**
 * ナビ項目が現在のページを指しているか。
 *
 * `/notes` は一覧だけでなく `/notes/:slug` でも点灯させたいので前方一致で見るが、
 * 区切りの `/` を要求することで `/notes-index` のような別ルートは拾わない。
 * 末尾スラッシュはルート以外で落としてから比べる（配信される URL は
 * trailingSlash: "never" で正規化されるが、判定側でも吸収しておく）。
 */
export function isActiveNavItem(pathname: string, href: string): boolean {
  const current = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return current === href || current.startsWith(`${href}/`)
}

/**
 * 右サイドバーに載せる見出しを選ぶ。
 *
 * h2 と h3 だけ。h1 はページタイトルと重複し、h4 まで載せると 240px のレールで
 * 階層が潰れる。ここで空配列になったページはレール自体を描画しない。
 */
export function selectTocHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
  return headings.filter((heading) => heading.depth === 2 || heading.depth === 3)
}
