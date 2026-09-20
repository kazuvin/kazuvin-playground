/**
 * 記事やカタログの見出し 1 つ。出所は MDX (features/notes/utils/mdx.ts) と
 * デザインシステムのカタログ (features/design-system/api/catalog.ts) の 2 つで、
 * 目次側はこの形しか知らない。
 *
 * 共有層に置くのは、2 つの feature と layouts (toc-sidebar) がまたいで使うため。
 * 1 つの feature に閉じるドメインの型は features/<domain>/types/ に置く。
 */
export interface MarkdownHeading {
  /** 見出しの段。h2 なら 2 */
  depth: number
  slug: string
  text: string
}
