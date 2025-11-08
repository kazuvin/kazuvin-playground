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
      className="block p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800"
    >
      <article>
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
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
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
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
