import { getPublishedNotes, toSearchableItem } from '@/features/notes/notes'

/* コマンドパレットが開かれてから fetch する検索インデックス
   (src/features/notes/search-index.ts)。 */
export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  const items = (await getPublishedNotes()).map(toSearchableItem)

  return Response.json(items)
}
