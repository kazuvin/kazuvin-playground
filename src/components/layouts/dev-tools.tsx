'use client'

import { useEffect } from 'react'

/* 開発時だけ Agentation のツールバーを載せる (docs/agentation.md)。 */
export function DevTools() {
  useEffect(() => {
    // biome-ignore lint/style/noProcessEnv: 設定値の読み出しではなく、バンドラに枝を畳ませるための目印。定数に逃がすと畳めなくなる
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // biome-ignore lint/style/noRestrictedImports: 本番では上の枝ごと消える必要があるので、静的な import にはできない
    void import('@/components/dev/agentation-toolbar').then((module) => {
      module.mountAgentationToolbar()
    })
  }, [])

  return null
}
