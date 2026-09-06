import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

function Timeline({ ref, className, ...props }: ComponentProps<'ol'>) {
  return <ol ref={ref} className={cn('relative', className)} {...props} />
}

function TimelineItem({ ref, className, ...props }: ComponentProps<'li'>) {
  return <li ref={ref} className={cn('relative', className)} {...props} />
}

/* 基準は TimelineItem。top-4 / left-4 / -bottom-4 はインジケーター (size-8) の半分で、
   この項目のドットの中心から次の項目のドットの中心までを結ぶ。 */
function TimelineConnector({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('absolute top-4 -bottom-4 left-4 w-px -translate-x-1/2 bg-border', className)}
      {...props}
    />
  )
}

interface TimelineDotProps extends ComponentProps<'div'> {
  isActive?: boolean
  isCompleted?: boolean
}

function TimelineDot({
  className,
  isActive = false,
  isCompleted = false,
  ...props
}: TimelineDotProps) {
  return (
    <div
      className={cn(
        'size-2.5 rounded-full border bg-background',
        isActive && 'border-primary bg-primary',
        isCompleted && !isActive && 'border-primary bg-primary',
        !isActive && !isCompleted && 'border-border-strong',
        className,
      )}
      {...props}
    />
  )
}

/* z-10 はレールをドットの下に潜らせるためのもので、これが無いと後ろに書かれた
   コネクターが 1px の線でドットを縦に割る。 */
function TimelineIndicator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative z-10 flex size-8 shrink-0 items-center justify-center', className)}
      {...props}
    />
  )
}

function TimelineHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center gap-4 pb-2', className)} {...props} />
}

/* 項目の下の余白は本文側 (TimelineBody) が持つ。ここに padding を置くと
   セパレーターがその手前で止まり、レールが項目のあいだで切れる。 */
function TimelineContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex gap-4', className)} {...props} />
}

function TimelineSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex w-8 shrink-0', className)} {...props} />
}

function TimelineBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex-1 pb-2', className)} {...props} />
}

interface TimelineTitleProps extends ComponentProps<'div'> {
  isActive?: boolean
}

function TimelineTitle({ className, isActive = false, ...props }: TimelineTitleProps) {
  return (
    <div
      className={cn('font-semibold text-sm leading-none', isActive && 'text-primary', className)}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
}
