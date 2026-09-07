'use client'

import { useRef } from 'react'
import type { ThemeToken } from './parse-theme'

/* 流し込む値は parse-theme が解決した実値なので、globals.css を変えれば動きも変わる。 */

const EASE_DURATION_MS = 600

/** 同じ animation は「一度消してから付け直す」でないと再生されない。 */
function replayAnimation(target: HTMLElement, value: string): void {
  target.style.animation = 'none'
  // 差し替えを別フレーム扱いにさせるための強制レイアウト
  target.getBoundingClientRect()
  target.style.animation = value
}

/* 走行距離はトラックの実寸から測る。定数で持つとプレビュー列の幅を変えたときに
   ドットだけが枠から出る (w-28 前提の 104px がまさにそれだった)。 */
function replayEase(track: HTMLElement, dot: HTMLElement, value: string, toEnd: boolean): void {
  const travel = track.clientWidth - dot.offsetWidth
  dot.style.transition = 'none'
  dot.getBoundingClientRect()
  dot.style.transition = `transform ${EASE_DURATION_MS}ms ${value}`
  dot.style.transform = `translateX(${toEnd ? travel : 0}px)`
}

export interface MotionButtonProps {
  token: ThemeToken
  kind: 'ease' | 'animation'
}

export function MotionButton({ token, kind }: MotionButtonProps) {
  const trackRef = useRef<HTMLSpanElement>(null)
  const targetRef = useRef<HTMLSpanElement>(null)
  const isAtEnd = useRef(false)

  function play(): void {
    const target = targetRef.current
    if (target === null) {
      return
    }

    if (kind === 'animation') {
      replayAnimation(target, token.resolved)
      return
    }

    const track = trackRef.current
    if (track === null) {
      return
    }
    isAtEnd.current = !isAtEnd.current
    replayEase(track, target, token.resolved, isAtEnd.current)
  }

  return (
    <button
      type="button"
      aria-label={`${token.name} を再生`}
      onClick={play}
      className="flex h-12 w-full cursor-pointer items-center overflow-hidden rounded-control border border-border-hairline bg-transparent px-1 transition-colors duration-120 ease-standard hover:bg-muted"
    >
      {kind === 'ease' ? (
        /* ease は端から端まで走らせて曲線を見せる。押すたびに往復し、行きも帰りも
           同じ曲線をたどる。 */
        <span ref={trackRef} className="relative block h-2 flex-1">
          <span
            ref={targetRef}
            className="absolute top-0 left-0 block size-2 rounded-chip bg-foreground"
          />
        </span>
      ) : (
        /* 休止位置をヘアラインの枠で残す。これが無いと 20px 動いたのか 5% 縮んだのかが
           読めない (0.95 の差は 1px 前後しかない)。休止中は面が枠をぴったり覆うので、
           止まっているあいだ枠は見えない。

           動かす面に translate を持たせないのも要点。中央寄せを transform で書くと、
           keyframes の transform がそれを上書きして面が隅に飛ぶ。中央寄せは flex に
           任せて、transform は keyframes の専有にしてある。 */
        <span className="relative flex flex-1 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute block size-8 rounded-sm border border-border-strong"
          />
          <span ref={targetRef} className="relative block size-8 rounded-sm bg-foreground" />
        </span>
      )}
    </button>
  )
}
