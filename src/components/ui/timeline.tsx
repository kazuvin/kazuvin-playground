import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

function Timeline({ ref, className, ...props }: ComponentProps<'ol'>) {
  return <ol ref={ref} className={cn('relative', className)} {...props} />
}

function TimelineItem({ ref, className, ...props }: ComponentProps<'li'>) {
  return <li ref={ref} className={cn('relative', className)} {...props} />
}

/* レールの上下端はセパレーターの組み方で変わる。
   ドットが TimelineHeader 側にいる構成 (月ごとのノート一覧) では、セパレーターは
   ドットより下から始まるので上下いっぱいに貫く。ドットが同じセパレーターに同居
   する構成では、そのドットの中心から次の項目のドットの中心 (= セパレーター下端の
   16px 下) までを結ぶ。上に飛び出す端も、項目のあいだの切れ目も出さないため。 */
function TimelineConnector({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'absolute inset-y-0 left-[15px] w-[2px] bg-border',
        '[[data-timeline-indicator]+&]:top-4 [[data-timeline-indicator]+&]:-bottom-4',
        className,
      )}
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
        'size-3 rounded-full border-2 bg-background',
        isActive && 'border-primary bg-primary',
        isCompleted && !isActive && 'border-primary bg-primary',
        !isActive && !isCompleted && 'border-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

/* data 属性はレールの位置決めに使う目印を兼ねる (TimelineConnector 参照)。
   z-10 はレールをドットの下に潜らせるためのもので、これが無いと後ろに書かれた
   コネクターが 2px の線でドットを縦に割る。 */
function TimelineIndicator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-timeline-indicator
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
  return <div className={cn('relative flex gap-4', className)} {...props} />
}

function TimelineSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('relative flex w-8 shrink-0', className)} {...props} />
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
