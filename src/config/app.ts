export const APP_NAME = 'Kazuvin Playground'
export const APP_DESCRIPTION = 'Kazuvin Playground is a place to experiment with code and ideas.'

/**
 * 左サイドバーのグローバルナビ。配列の順がそのまま表示順になる。
 *
 * ヘッダーを廃してナビを左レールに寄せたので、サイト全体の行き先はここが
 * 唯一の情報源。href は astro.config.mjs の trailingSlash: "never" に合わせて
 * 末尾スラッシュを付けない（付けると現在地の判定と URL がずれる）。
 */
export const NAV_ITEMS = [
  { label: 'Notes', href: '/notes' },
  { label: 'Playgrounds', href: '/playgrounds' },
  { label: 'Products', href: '/products' },
  { label: 'Design System', href: '/design-system' },
] as const
