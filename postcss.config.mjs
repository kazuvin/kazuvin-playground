/*
 * Tailwind v4 を Next.js のビルドに載せる口。
 *
 * Vite 側 (Storybook / Vitest) は @tailwindcss/vite を使うので、同じ Tailwind を
 * 2 通りの経路で読み込んでいることになる。トークンの出典はどちらも
 * src/styles/globals.css の @theme で、設定ファイルは持たない (v4 の CSS-first)。
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
