import type { NoteSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";

interface NoteCardProps {
  note: NoteSummary;
}

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = formatDate(note.metadata.date, "ja-JP");

  return (
    <a href={`/notes/${note.slug}`} className="block">
      <Card className="hover:border-border-strong transition-colors">
        <CardHeader>
          <CardTitle className="text-2xl">{note.metadata.title}</CardTitle>
          <time
            dateTime={note.metadata.date}
            className="text-muted-foreground text-sm"
          >
            {formattedDate}
          </time>
        </CardHeader>
        {(note.metadata.description || note.metadata.tags.length > 0) && (
          <CardContent>
            {note.metadata.description && (
              <CardDescription className="text-base">
                {note.metadata.description}
              </CardDescription>
            )}
            {note.metadata.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {note.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground rounded-chip px-2 py-1 text-xs"
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
  );
}
