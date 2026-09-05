import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SearchableItem } from '@/lib/types'

export interface NoteTimelineItemProps {
  note: SearchableItem
}

/**
 * タイムライン内の個別のノートカード
 * プレゼンテーションコンポーネント - props を受け取って UI を描画
 */
export function NoteTimelineItem({ note }: NoteTimelineItemProps) {
  return (
    <a href={note.url}>
      <Card className="transition-colors hover:bg-muted">
        <CardHeader>
          <CardTitle className="text-sm">{note.metadata.title}</CardTitle>
          <CardDescription className="text-xs">{note.metadata.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {note.metadata.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
