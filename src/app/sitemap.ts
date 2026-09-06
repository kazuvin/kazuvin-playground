import type { MetadataRoute } from 'next'
import { NAV_ITEMS, SITE_URL } from '@/config/app'
import { getPublishedNotes } from '@/features/notes/notes'

/* 載るのはグローバルナビと公開済みのノートだけ。ページを足しただけでは載らない。 */
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getPublishedNotes()

  return [
    { url: SITE_URL, changeFrequency: 'weekly' },
    ...NAV_ITEMS.map((item) => ({
      url: `${SITE_URL}${item.href}`,
      changeFrequency: 'weekly' as const,
    })),
    ...notes.map((note) => ({
      url: `${SITE_URL}/notes/${note.slug}`,
      lastModified: note.data.date,
      changeFrequency: 'yearly' as const,
    })),
  ]
}
