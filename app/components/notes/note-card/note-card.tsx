import Link from "next/link";
import type { NoteWithMetadata } from "@/lib/notes";
import { formatDate } from "@/lib/utils";

interface NoteCardProps {
  note: NoteWithMetadata;
}

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = formatDate(note.metadata.date, "ja-JP");

  return (
    <Link
      href={`/notes/${note.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
    >
      <article>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {note.metadata.title}
        </h2>
        <time
          dateTime={note.metadata.date}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {formattedDate}
        </time>
        {note.metadata.description && (
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {note.metadata.description}
          </p>
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
      </article>
    </Link>
  );
}
