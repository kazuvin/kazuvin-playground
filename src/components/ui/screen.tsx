import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const screenAlignClasses = {
  stretch: 'items-stretch',
  center: 'items-center',
  start: 'items-start',
} as const

type ScreenAlign = keyof typeof screenAlignClasses

/* 画面端の余白 (24 / 32 / 24) を宣言してよい唯一の場所。子は tier 2 / 3 だけを使う。 */
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
