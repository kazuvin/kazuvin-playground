import { evaluate } from '@mdx-js/mdx'
import rehypeShiki from '@shikijs/rehype'
import type { Element, Nodes, Parents } from 'hast'
import type { MDXContent } from 'mdx/types'
import * as runtime from 'react/jsx-runtime'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import type { MarkdownHeading } from '@/lib/types'

/* components マップを渡さないのは意図的。本文の見た目は globals.css の
   .note-content が素の h1/p/pre に当てる。 */
const SHIKI_THEME = 'github-light'

const HEADING_TAG = /^h([1-6])$/

function isElement(node: Nodes): node is Element {
  return node.type === 'element'
}

/** 見出しの文言。<code> などで包まれていても中の文字だけを集める。 */
function toText(node: Nodes): string {
  if (node.type === 'text') {
    return node.value
  }
  if ('children' in node) {
    return (node as Parents).children.map(toText).join('')
  }
  return ''
}

/**
 * rehype-slug の後ろに並べて、あちらが振った id をそのまま読む (自前で作り直すと
 * 採番規則がずれて目次のリンクだけが外れる)。見出しは最上位にしか現れないので再帰しない。
 */
function collectHeadings(headings: MarkdownHeading[]) {
  return (tree: Parents): void => {
    for (const node of tree.children) {
      if (!isElement(node)) {
        continue
      }
      const matched = HEADING_TAG.exec(node.tagName)
      if (matched === null) {
        continue
      }
      headings.push({
        depth: Number(matched[1]),
        slug: String(node.properties.id ?? ''),
        text: toText(node),
      })
    }
  }
}

export interface RenderedMdx {
  /** 本文。受け取る側で <Content /> の名前に付け替えて JSX に置く */
  content: MDXContent
  /** 右レールに渡す目次。段の絞り込みは @/lib/nav の selectTocHeadings が行う */
  headings: MarkdownHeading[]
}

/** MDX の本文 (frontmatter を除いた残り) をコンポーネントと目次に変える。 */
export async function renderMdx(body: string): Promise<RenderedMdx> {
  const headings: MarkdownHeading[] = []

  const { default: content } = await evaluate(body, {
    ...runtime,
    baseUrl: import.meta.url,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      () => collectHeadings(headings),
      [rehypeShiki, { theme: SHIKI_THEME }],
    ],
  })

  return { content, headings }
}
