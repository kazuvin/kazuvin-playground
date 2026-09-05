// @ts-check
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

/* Fontsource が配る latin サブセットの unicode-range。Noto Sans Mono も同一。 */
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
  /* サイトの書体は欧文が Noto Sans Mono、和文が Noto Sans JP。本文も見出しも
     コードも等幅で通す。同じ Noto なので骨格もウェイトの刻みも揃っていて、
     和欧が混ざる行でも濃度が破綻しない。配信経路は 2 通りに分かれていて、
     分けている理由がそのままレイアウトシフト対策になっている。

     欧文はここ (Astro の Fonts API) から出す。CSS を import するだけの場合と
     違い、(1) <link rel="preload"> が出る (2) フォント実体のメトリクスから
     算出した代替 @font-face (size-adjust / ascent-override) が生成される。
     差し替わった瞬間に行の高さも字幅も変わらないので、画面遷移のたびに
     出ていたレイアウトシフトが消える。

     ファイル実体は既存の @fontsource-variable/* をそのまま使う (local
     プロバイダ)。ビルド時にネットワークへ出ないので CI が外部に依存しない。
     latin 以外のサブセットは載せない: preload は宣言した全 variant に効くため、
     この英日サイトでまず出番のない latin-ext や cyrillic まで毎回落ちてしまう。
     漏れた文字は下の Noto Sans JP → system mono にグリフ単位で落ちる。

     Noto Sans JP をここに載せないのは別の理由で、
     src/styles/globals.css の import 側コメントを参照。 */
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Noto Sans Mono Variable',
      cssVariable: '--font-noto-sans-mono',
      /* 代替の先に CJK を挟む。Astro は実書体の直後に補正済み代替を差し込むので、
         結果は 実書体 → 補正済み代替 → Noto Sans JP → system mono の順になる。 */
      fallbacks: ['Noto Sans JP Variable', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            unicodeRange: [LATIN],
            src: [
              '@fontsource-variable/noto-sans-mono/files/noto-sans-mono-latin-wght-normal.woff2',
            ],
          },
        ],
      },
    },
  ],
  /* React Compiler を通す。再レンダーの抑制はコンパイラに任せる方針なので
     （biome.jsonc の noRestrictedImports のメッセージと対）、useMemo /
     useCallback / memo を手で置かない。

     Biome の nursery/useReactCompiler は入れていない。2.5.12 時点では
     日本語コメントを含むファイルで panic する（バイト境界の扱いのバグ）。

     @astrojs/react の babel オプションは中の @vitejs/plugin-react にそのまま
     渡る。ランタイムは react/compiler-runtime として React 19 に同梱されて
     いるので、追加の依存は babel プラグインだけ。

     効くのは client:* の island だけで、.astro が出す静的 HTML は対象外。
     Storybook は @storybook/react-vite が別に react プラグインを持つため
     コンパイラを通らない。意味論は変えない前提なので揃えていない。 */
  integrations: [react({ babel: { plugins: ['babel-plugin-react-compiler'] } }), mdx(), sitemap()],
  markdown: {
    /* Kotoba は白地・単一色相の系なので、ハイライトも明色テーマで揃える */
    shikiConfig: { theme: 'github-light' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
