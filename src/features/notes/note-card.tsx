import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/date'
import type { NoteSummary } from '@/lib/types'

interface NoteCardProps {
  note: NoteSummary
}

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = formatDate(note.metadata.date, 'ja-JP')

  return (
    <a href={`/notes/${note.slug}`} className="block">
      <Card className="transition-colors hover:border-border-strong">
        <CardHeader>
          <CardTitle>{note.metadata.title}</CardTitle>
          <time dateTime={note.metadata.date} className="text-muted-foreground text-sm">
            {formattedDate}
          </time>
        </CardHeader>
        {(Boolean(note.metadata.description) || note.metadata.tags.length > 0) && (
          <CardContent>
            {note.metadata.description && (
              <CardDescription>{note.metadata.description}</CardDescription>
            )}
            {note.metadata.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {note.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-chip bg-secondary px-2 py-1 text-secondary-foreground text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </a>
  )
}
