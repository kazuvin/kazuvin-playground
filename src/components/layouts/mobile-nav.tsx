'use client'

import { useEffect, useRef, useState } from 'react'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { SiteNav } from './site-nav'

export function MobileNav() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  function close(): void {
    setIsOpen(false)
  }

  useKeyboardShortcut({ key: 'Escape', enabled: isOpen, preventDefault: false }, close)

  /* 外を触ったら閉じる。閉じるための面を敷かないのは、バーの backdrop-filter が
     fixed の containing block になり、バーの外まで届く面を作れないため。 */
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent): void {
      const root = rootRef.current
      if (root !== null && event.target instanceof Node && root.contains(event.target)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        type="button"
        aria-label="メニュー"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((previous) => !previous)
        }}
        /* -mr-3 = hitslop 2 + 面 (40) の中で 20px の図形が余らせる 10。ロゴの左端と
           図形の右端を同じ px-edge-h に揃えるための光学的な寄せ */
        className="-m-hitslop -mr-3 cursor-pointer p-hitslop"
      >
        <span className="flex size-control items-center justify-center rounded-control text-foreground transition-colors duration-120 ease-standard hover:bg-muted">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            {isOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </span>
      </button>

      {/* top-full はバーの下端 (border 込み)。バーの半透明を継がずに塗り切るのは、
          入れ子の backdrop-filter が本文をぼかせず文字が重なって読めないため。 */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full border-border-hairline border-b bg-background px-edge-h py-gap motion-safe:animate-fade-in">
          <SiteNav variant="menu" onNavigate={close} />
        </div>
      )}
    </div>
  )
}
