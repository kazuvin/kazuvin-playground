import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

// 公開 API ではないので export しない（型は props の形からしか使わない）
const screenAlignClasses = {
  stretch: 'items-stretch',
  center: 'items-center',
  start: 'items-start',
} as const

type ScreenAlign = keyof typeof screenAlignClasses

/* Tier-1 spacing owner: 24 horizontal, 32 top, 24 bottom. This is the only
   place screen-edge padding is declared — children use tier 2 between blocks
   and tier 3 inside a block, and never add a margin that fights the shell. */
const screenBaseClasses =
  'mx-auto box-border flex min-h-full w-full flex-col bg-background px-edge-h pt-edge-top pb-edge-bottom'

function getScreenClasses(align: ScreenAlign): string {
  return `${screenBaseClasses} ${screenAlignClasses[align]}`
}

interface ScreenProps extends HTMLAttributes<HTMLDivElement> {
  /** Device width in px. Default 390, mirroring the design viewport. */
  width?: number
  align?: ScreenAlign
}

function Screen({ className, style, width = 390, align = 'stretch', ...props }: ScreenProps) {
  return (
    <div
      className={cn(getScreenClasses(align), className)}
      style={{ maxWidth: width, ...style }}
      {...props}
    />
  )
}

export { Screen }
