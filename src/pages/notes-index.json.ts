import type { APIRoute } from 'astro'
import { getPublishedNotes, toSearchableItem } from '@/features/notes/notes'

/**
 * コマンドパレット用の検索インデックス
 *
 * ビルド時に dist/notes-index.json として出力され、
 * command-search.tsx がダイアログを開いたときに fetch する。
 */
export const GET: APIRoute = async () => {
  const items = (await getPublishedNotes()).map(toSearchableItem)

  return new Response(JSON.stringify(items, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
