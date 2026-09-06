import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import type { NoteSummary, SearchableItem } from '@/lib/types'

/* node:fs を触るのでビルド時からしか呼べない (biome.jsonc の noNodejsModules 例外)。
   MDX 本文の変換は ./mdx。あちらは重いので frontmatter だけで済む経路では読まない。 */

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes')

const MDX_EXTENSION = '.mdx'

/**
 * frontmatter の唯一の出典。
 *
 * 日付を文字列のまま持つのは、ISO の辞書順がそのまま時系列順になるうえ、
 * `new Date('2025-11-03')` を UTC 0 時と解釈する事故が起きないため。
 */
const noteFrontmatterSchema = z.object({
  title: z.string(),
  date: z
    .string({
      error: '日付は文字列で書いてください。YAML の日付型にならないよう引用符で囲みます',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日付は "YYYY-MM-DD" の形式で書いてください'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  /** true のものはビルド出力に含めない */
  draft: z.boolean().default(false),
})

type NoteFrontmatter = z.infer<typeof noteFrontmatterSchema>

/** body は MDX の本文 (frontmatter を除いた残り) */
export interface NoteEntry {
  slug: string
  data: NoteFrontmatter
  body: string
}

async function readNote(fileName: string): Promise<NoteEntry> {
  const slug = path.basename(fileName, MDX_EXTENSION)
  const source = await readFile(path.join(NOTES_DIR, fileName), 'utf8')
  const { data, content } = matter(source)
  const parsed = noteFrontmatterSchema.safeParse(data)

  if (!parsed.success) {
    // 黙って落とさずビルドを止める
    throw new Error(`content/notes/${fileName} の frontmatter が不正です: ${parsed.error.message}`)
  }

  return { slug, data: parsed.data, body: content }
}

/** 公開済みのノートを新しい順に。draft: true は除く。 */
export async function getPublishedNotes(): Promise<NoteEntry[]> {
  const fileNames = (await readdir(NOTES_DIR)).filter((name) => name.endsWith(MDX_EXTENSION))
  const notes = await Promise.all(fileNames.map(readNote))

  return notes
    .filter((note) => !note.data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
}

/** slug からノートを 1 つ引く。generateStaticParams が作った slug しか来ない前提。 */
export async function getPublishedNote(slug: string): Promise<NoteEntry> {
  const note = (await getPublishedNotes()).find((candidate) => candidate.slug === slug)

  if (note === undefined) {
    throw new Error(`公開済みのノートが見つかりません: ${slug}`)
  }

  return note
}

export function toNoteSummary(note: NoteEntry): NoteSummary {
  return {
    slug: note.slug,
    metadata: {
      title: note.data.title,
      date: note.data.date,
      description: note.data.description,
      tags: note.data.tags,
    },
  }
}

export function toSearchableItem(note: NoteEntry): SearchableItem {
  return {
    type: 'note',
    url: `/notes/${note.slug}`,
    metadata: {
      title: note.data.title,
      date: note.data.date,
      description: note.data.description,
      tags: note.data.tags,
    },
  }
}
