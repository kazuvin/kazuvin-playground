import type { Metadata } from 'next'
import { PageShell } from '@/components/layouts/page-shell'
import { renderMdx } from '@/features/notes/mdx'
import { getPublishedNote, getPublishedNotes } from '@/features/notes/notes'

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const notes = await getPublishedNotes()

  return notes.map((note) => ({ slug: note.slug }))
}

interface NotePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params
  const note = await getPublishedNote(slug)

  return {
    title: note.data.title,
    description: note.data.description,
    alternates: { canonical: `/notes/${slug}` },
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params
  const note = await getPublishedNote(slug)
  const { content: Content, headings } = await renderMdx(note.body)

  return (
    <PageShell headings={headings}>
      <article className="note-content">
        <Content />
      </article>
    </PageShell>
  )
}
