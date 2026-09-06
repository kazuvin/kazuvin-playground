import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Storybook 用の Vite 設定。
 *
 * アプリ本体のビルドは next.config.ts (と postcss.config.mjs) が担当するため、ここは
 * Storybook が src/styles/globals.css を解決できるようにするための最小構成に留める。
 * 同じ理由で vitest.config.mts にも同じプラグインを入れている。
 */
export default defineConfig({
  plugins: [tailwindcss()],
})
