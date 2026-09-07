'use client'

import { Command as CommandPrimitive } from 'cmdk'
import type { ComponentProps, HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

function Command({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      ref={ref}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-card border border-border bg-popover text-popover-foreground',
        className,
      )}
      {...props}
    />
  )
}

/* 行の左端はすべてこの虫眼鏡に揃う (入力欄の文字ではなく)。だから入力欄も
   CommandItem も CommandGroup の見出しも padding-x は inset-x で固定する。 */
function CommandInput({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      className="flex h-control-lg shrink-0 items-center gap-gap border-border-hairline border-b px-inset-x"
      cmdk-input-wrapper=""
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3.5 shrink-0 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.35-4.35" />
      </svg>
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-disabled-foreground',
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn('max-h-72 min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-gap', className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      className={cn('px-inset-x py-block text-center text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/* 見出しは overline (11 / 600 / muted)。行は端まで塗るので、群の側には
   padding を持たせず、左右は見出しと項目がそれぞれ inset-x で持つ。 */
function CommandGroup({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        'text-foreground [&_[cmdk-group-heading]]:px-inset-x [&_[cmdk-group-heading]]:py-gap [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase',
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ref,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn('my-gap h-px bg-border-hairline', className)}
      {...props}
    />
  )
}

/* 行は端まで塗る。角丸で内側に浮かせると、入力欄の虫眼鏡から続く左端の線が
   そこだけ折れるため。高さは tap-min (44) を下限に、中身が折り返せば伸びる。 */
function CommandItem({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex min-h-tap-min cursor-pointer select-none items-center gap-gap px-inset-x py-gap text-sm text-subtle-foreground outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-selected data-[disabled=true]:text-disabled-foreground data-[selected=true]:text-foreground [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

/* キーキャップ。左レールの ⌘K チップ (command-search-trigger) と同じ作りで、
   1px のヘアラインと 11px で置く。 */
function CommandShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'ml-auto inline-flex shrink-0 items-center rounded-sm border border-border-hairline px-1 py-0.5 text-2xs text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
