import type { Metadata } from 'next'
import { PageShell } from '@/components/layouts/page-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { NoteCard } from '@/features/notes/note-card'
import { getPublishedNotes, toNoteSummary } from '@/features/notes/notes'

const TITLE = 'Notes'
const DESCRIPTION = 'A collection of notes and thoughts'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/notes' },
}

export default async function NotesPage() {
  const notes = (await getPublishedNotes()).map(toNoteSummary)

  return (
    <PageShell>
      <div>
        <PageHeader title={TITLE} description={DESCRIPTION} />

        {notes.length === 0 ? (
          <Text role="caption">No notes yet. Check back later!</Text>
        ) : (
          <div className="grid gap-6">
            {notes.map((note) => (
              <NoteCard key={note.slug} note={note} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
