'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/* Radix のプリミティブは const の別名ではなく関数で包む。useComponentExportOnlyModules が
   export をこのファイルで宣言したコンポーネントに限っているため。

   Kotoba にステータス色は無い (globals.css の「破壊的操作」)。失敗と通常の通知で面や
   文字色は変えず、違いは Radix の type ("foreground" = assertive) と表示時間だけで表す。
   呼び出し側がそれを渡すので、この層は重さを知らない。 */

function ToastProvider(props: ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastViewport({ className, ...props }: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      /* z-50 はダイアログ。通知はその上に出す (パレットを開いたままでも読めるように) */
      className={cn(
        'fixed right-0 bottom-0 z-[60] m-0 flex w-full max-w-sm list-none flex-col gap-gap p-edge-h outline-none',
        className,
      )}
      {...props}
    />
  )
}

/* 影は使わない。分離は 1px のヘアラインで行う (globals.css の「境界」) */
const TOAST_SURFACE =
  'flex items-start gap-gap rounded-card border border-border bg-card px-inset-x py-inset-y text-card-foreground'

const TOAST_MOTION =
  'motion-safe:data-[state=open]:animate-fade-slide-up motion-safe:data-[state=closed]:animate-fade-out'

/* スワイプ中だけ指に追従させ、離して戻すときはトランジションで滑らせる */
const TOAST_SWIPE =
  'data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-fade-out'

function Toast({ className, ...props }: ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      className={cn(TOAST_SURFACE, TOAST_MOTION, TOAST_SWIPE, className)}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      className={cn('text-sm leading-snug font-medium', className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      className={cn('mt-gap-tight text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function ToastClose({ className, ...props }: ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      className={cn(
        '-m-hitslop shrink-0 cursor-pointer rounded-sm p-hitslop text-muted-foreground transition-colors duration-120 ease-standard hover:text-foreground',
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-icon"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
      <span className="sr-only">閉じる</span>
    </ToastPrimitive.Close>
  )
}

export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport }
