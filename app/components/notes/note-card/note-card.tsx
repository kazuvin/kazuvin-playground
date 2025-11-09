import Link from "next/link";
import type { NoteWithMetadata } from "@/lib/notes";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui";

interface NoteCardProps {
  note: NoteWithMetadata;
}

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = formatDate(note.metadata.date, "ja-JP");

  return (
    <Link href={`/notes/${note.slug}`} className="block">
      <Card className="transition-colors hover:border-gray-300 dark:hover:border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl">{note.metadata.title}</CardTitle>
          <time
            dateTime={note.metadata.date}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {formattedDate}
          </time>
        </CardHeader>
        {(note.metadata.description ||
          (note.metadata.tags && note.metadata.tags.length > 0)) && (
          <CardContent>
            {note.metadata.description && (
              <CardDescription className="text-base">
                {note.metadata.description}
              </CardDescription>
            )}
            {note.metadata.tags && note.metadata.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {note.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
