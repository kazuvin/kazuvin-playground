import { useCallback, useEffect, useState } from 'react'

export interface WindowScrollPosition {
  x: number
  y: number
}

export interface ScrollToOptions {
  x?: number
  y?: number
  behavior?: ScrollBehavior
}

export function useWindowScroll(): [WindowScrollPosition, (options: ScrollToOptions) => void] {
  /* 初期値は 0 固定。ここで window を読むと、復元スクロールで開いた回の
     ハイドレーションが SSR の HTML と食い違う。実際の位置は下の effect が
     マウント直後に入れる。 */
  const [scrollPosition, setScrollPosition] = useState<WindowScrollPosition>({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      })
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollTo = useCallback((options: ScrollToOptions) => {
    if (typeof window === 'undefined') {
      return
    }

    window.scrollTo({
      left: options.x,
      top: options.y,
      behavior: options.behavior || 'smooth',
    })
  }, [])

  return [scrollPosition, scrollTo]
}
