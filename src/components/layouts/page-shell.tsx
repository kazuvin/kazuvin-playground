import type { ReactNode } from 'react'
import type { MarkdownHeading } from '@/lib/types'
import { TocSidebar } from './toc-sidebar'

/* Fragment を返すのは必須。<div> で包むと app-shell の 3 トラックが 2 つに潰れる。 */
export interface PageShellProps {
  /** 右レールに出す目次。省略したページではレール自体が描かれない */
  headings?: MarkdownHeading[]
  children: ReactNode
}

export function PageShell({ headings, children }: PageShellProps) {
  return (
    <>
      <main className="px-edge-h pt-edge-top pb-block-loose text-base md:pb-24">
        <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-10">{children}</div>
      </main>
      <TocSidebar headings={headings} />
    </>
  )
}
