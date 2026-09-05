import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

/**
 * notes コレクション
 *
 * frontmatter の唯一の出典。ページ・検索インデックス・型定義はすべてここから導出する。
 */
const notes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/notes" }),
  schema: z.object({
    /** ノートのタイトル */
    title: z.string(),
    /** 公開日 (YYYY-MM-DD 形式) */
    date: z.coerce.date(),
    /** ノートの説明 */
    description: z.string().optional(),
    /** タグのリスト */
    tags: z.array(z.string()).default([]),
    /** 下書きフラグ。true のものはビルド出力に含めない */
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
