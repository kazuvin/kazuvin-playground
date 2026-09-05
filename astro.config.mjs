// @ts-check
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

/* Fontsource が配る latin サブセットの unicode-range。
   Source Sans 3 と Geist Mono で同一。 */
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'

// https://astro.build/config
export default defineConfig({
  /* TODO: 実際のデプロイ先ドメインに差し替える。sitemap の絶対 URL に使われる。 */
  site: 'https://kazuvin-playground.workers.dev',
  /* Next.js と同じく末尾スラッシュなしの URL に揃える。
     build.format: "file" で /notes → dist/notes.html となり、Cloudflare の
     静的アセット配信がリダイレクトを挟まずに 200 を返す。 */
  trailingSlash: 'never',
  build: { format: 'file' },
  /* Latin の 2 書体は Astro の Fonts API 経由で配信する。CSS を import する
     だけの場合と違い、(1) <link rel="preload"> が出る (2) フォント実体の
     メトリクスから算出した代替 @font-face (size-adjust / ascent-override) が
     生成される。差し替わった瞬間に行の高さも字幅も変わらないので、
     画面遷移のたびに出ていたレイアウトシフトが消える。

     ファイル実体は既存の @fontsource-variable/* をそのまま使う (local
     プロバイダ)。ビルド時にネットワークへ出ないので CI が外部に依存しない。
     latin 以外のサブセットは載せない: preload は宣言した全 variant に効くため、
     この英日サイトでまず出番のない latin-ext (60KB) まで毎回落ちてしまう。
     漏れた文字は下の Noto Sans JP → system-ui にグリフ単位で落ちる。

     Noto Sans JP をここに載せないのは別の理由で、
     src/styles/globals.css の import 側コメントを参照。 */
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Source Sans 3 Variable',
      cssVariable: '--font-source-sans-3',
      /* 代替の先に CJK を挟む。Astro は実書体の直後に補正済み代替を差し込むので、
         結果は 実書体 → 補正済み代替 → Noto → system-ui の順になる。 */
      fallbacks: ['Noto Sans JP Variable', 'system-ui', '-apple-system', 'sans-serif'],
      options: {
        variants: [
          {
            weight: '200 900',
            style: 'normal',
            unicodeRange: [LATIN],
            src: ['@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono Variable',
      cssVariable: '--font-geist-mono',
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            unicodeRange: [LATIN],
            src: ['@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'],
          },
        ],
      },
    },
  ],
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    /* Kotoba は白地・単一色相の系なので、ハイライトも明色テーマで揃える */
    shikiConfig: { theme: 'github-light' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
