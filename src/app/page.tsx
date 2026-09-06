import type { Metadata } from 'next'
import { PageShell } from '@/components/layouts/page-shell'
import { groupNotesByMonth, sortMonthsDescending } from '@/features/notes/group-by-month'
import { getPublishedNotes, toSearchableItem } from '@/features/notes/notes'
import { NotesTimeline } from '@/features/notes/notes-timeline'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const notes = (await getPublishedNotes()).map(toSearchableItem)
  const sortedMonths = sortMonthsDescending(groupNotesByMonth(notes))

  return (
    <PageShell>
      <div className="space-y-12">
        <header className="space-y-1 leading-relaxed">
          <p>Hello, my name is Kazuvin.</p>
          <p>This is my playground for experimenting with new web technologies</p>
          <p>Please take a look around and enjoy your stay!</p>
        </header>
        <NotesTimeline sortedMonths={sortedMonths} />
      </div>
    </PageShell>
  )
}
