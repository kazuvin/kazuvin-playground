import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

function Timeline({ ref, className, ...props }: ComponentProps<'ol'>) {
  return <ol ref={ref} className={cn('relative', className)} {...props} />
}

function TimelineItem({ ref, className, ...props }: ComponentProps<'li'>) {
  return <li ref={ref} className={cn('relative', className)} {...props} />
}

function TimelineConnector({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('absolute top-0 left-[15px] h-full w-[2px] bg-border', className)}
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

function TimelineIndicator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative flex size-8 shrink-0 items-center justify-center', className)}
      {...props}
    />
  )
}

function TimelineHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center gap-4 pb-2', className)} {...props} />
}

function TimelineContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('relative flex gap-4 pb-2', className)} {...props} />
}

function TimelineSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('relative flex w-8 shrink-0', className)} {...props} />
}

function TimelineBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex-1', className)} {...props} />
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
