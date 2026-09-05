// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  /* TODO: 実際のデプロイ先ドメインに差し替える。sitemap の絶対 URL に使われる。 */
  site: "https://kazuvin-playground.workers.dev",
  /* Next.js と同じく末尾スラッシュなしの URL に揃える。
     build.format: "file" で /notes → dist/notes.html となり、Cloudflare の
     静的アセット配信がリダイレクトを挟まずに 200 を返す。 */
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    /* Kotoba は白地・単一色相の系なので、ハイライトも明色テーマで揃える */
    shikiConfig: { theme: "github-light" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
