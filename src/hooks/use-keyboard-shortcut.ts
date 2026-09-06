import { useEffect, useRef } from 'react'

export interface KeyboardShortcutOptions {
  /** KeyboardEvent.key の値 (例: "k", "Enter", "Escape") */
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
  enabled?: boolean
  capture?: boolean
}

export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: (event: KeyboardEvent) => void,
) {
  const {
    key,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    altKey = false,
    preventDefault = true,
    stopPropagation = false,
    enabled = true,
    capture = false,
  } = options

  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatch = event.key === key

      /* metaKey と ctrlKey は OR。⌘K と Ctrl+K を 1 つの宣言で受ける */
      const modifierMatch = (!metaKey && !ctrlKey) || event.metaKey || event.ctrlKey
      const shiftMatch = shiftKey === event.shiftKey
      const altMatch = altKey === event.altKey

      if (keyMatch && modifierMatch && shiftMatch && altMatch) {
        if (preventDefault) {
          event.preventDefault()
        }
        if (stopPropagation) {
          event.stopPropagation()
        }
        callbackRef.current(event)
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture })

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture })
    }
  }, [key, ctrlKey, metaKey, shiftKey, altKey, preventDefault, stopPropagation, enabled, capture])
}
