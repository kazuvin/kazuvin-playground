export const APP_NAME = 'Kazuvin Playground'
export const APP_DESCRIPTION = 'Kazuvin Playground is a place to experiment with code and ideas.'

/**
 * canonical と sitemap の絶対 URL の出典。Static Export には実行時のリクエストが
 * 無いので、ホスト名を知る手段がここしかない。
 *
 * TODO: 実際のデプロイ先ドメインに差し替える。
 */
export const SITE_URL = 'https://kazuvin-playground.workers.dev'

/**
 * サイト全体の行き先の出典。配列の順がそのまま表示順。href に末尾スラッシュは付けない
 * (trailingSlash: false なので、付けると現在地の判定と URL がずれる)。
 */
export const NAV_ITEMS = [
  { label: 'Notes', href: '/notes' },
  { label: 'Playgrounds', href: '/playgrounds' },
  { label: 'Products', href: '/products' },
  { label: 'Design System', href: '/design-system' },
] as const
