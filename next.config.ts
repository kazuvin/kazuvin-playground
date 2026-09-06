import type { NextConfig } from 'next'

/*
 * Next.js (App Router) の Static Export。
 *
 * `output: 'export'` はサーバーを一切持たない完全な静的サイトを out/ に書き出す。
 * SSR / ISR / Middleware / 画像最適化 API といった「実行時のサーバー」を前提にした
 * 機能は使えなくなる代わりに、成果物がただの HTML + JS + アセットになるので、
 * Cloudflare Workers の静的アセット配信 (wrangler.jsonc) にそのまま載る。
 *
 * URL は末尾スラッシュなし。trailingSlash の既定 (false) がそれで、/notes は
 * out/notes.html として書き出される。Cloudflare 側は拡張子なしの URL を
 * そのファイルに解決し、/notes/ で来たら /notes へ 307 で寄せる。
 */
const nextConfig: NextConfig = {
  output: 'export',

  /* Static Export にはリクエスト時に画像を変換するサーバーが無いので、
     next/image の最適化を切る必要がある。このサイトが持つ画像はロゴ 1 枚
     (src/assets/logo.png) だけで、表示サイズが 32/40px に固定なうえ書き出し済みの
     104x160 から先の最適化で得るものも無い。実際の描画は素の <img> で行い
     (src/components/layouts/app-sidebar.tsx)、静的 import からは src / width / height だけを取る。 */
  images: { unoptimized: true },

  /* React Compiler を通す。再レンダーの抑制はコンパイラに任せる方針なので
     (biome.jsonc の noRestrictedImports のメッセージと対)、useMemo /
     useCallback / memo を手で置かない。

     Biome の nursery/useReactCompiler は入れていない。2.5.12 時点では
     日本語コメントを含むファイルで panic する (バイト境界の扱いのバグ)。

     Storybook は @storybook/react-vite が別のパイプラインを持つためコンパイラを
     通らない。意味論は変えない前提なので揃えていない。 */
  reactCompiler: true,
}

export default nextConfig
