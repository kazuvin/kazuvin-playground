'use client'

import { useRef } from 'react'
import type { ThemeToken } from './parse-theme'

/* 流し込む値は parse-theme が解決した実値なので、globals.css を変えれば動きも変わる。 */

/** ease のドットが走る距離。プレビュー列 (w-28 = 112px) からドットの 8px を引いた分。 */
const EASE_TRAVEL_PX = 104

const EASE_DURATION_MS = 600

/** 同じ animation は「一度消してから付け直す」でないと再生されない。 */
function replayAnimation(target: HTMLElement, value: string): void {
  target.style.animation = 'none'
  // 差し替えを別フレーム扱いにさせるための強制レイアウト
  target.getBoundingClientRect()
  target.style.animation = value
}

/** 押すたびに端から端へ往復させる。曲線の形は行きも帰りも同じ。 */
function replayEase(target: HTMLElement, value: string): void {
  const parked = target.style.transform === `translateX(${EASE_TRAVEL_PX}px)`
  target.style.transition = 'none'
  target.getBoundingClientRect()
  target.style.transition = `transform ${EASE_DURATION_MS}ms ${value}`
  target.style.transform = parked ? 'translateX(0px)' : `translateX(${EASE_TRAVEL_PX}px)`
}

export interface MotionButtonProps {
  token: ThemeToken
  kind: 'ease' | 'animation'
}

export function MotionButton({ token, kind }: MotionButtonProps) {
  const targetRef = useRef<HTMLSpanElement>(null)

  return (
    <button
      type="button"
      aria-label={`${token.name} を再生`}
      onClick={() => {
        const target = targetRef.current
        if (target === null) {
          return
        }
        if (kind === 'animation') {
          replayAnimation(target, token.resolved)
          return
        }
        replayEase(target, token.resolved)
      }}
      className="relative block h-8 w-full cursor-pointer rounded-control border border-border-hairline bg-transparent p-0 transition-colors duration-120 ease-standard hover:bg-muted"
    >
      {/* ease は端から端まで走らせて曲線を見せ、animation は面そのものを動かす */}
      {kind === 'ease' ? (
        <span
          ref={targetRef}
          className="absolute top-1/2 left-1 block size-2 -translate-y-1/2 rounded-chip bg-foreground"
        />
      ) : (
        <span
          ref={targetRef}
          className="absolute top-1/2 left-1/2 block size-5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-foreground"
        />
      )}
    </button>
  )
}
