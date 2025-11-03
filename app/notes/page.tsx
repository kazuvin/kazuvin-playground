import { getAllNoteMetadata } from "@/lib/notes";
import { NoteCard } from "@/app/components/notes/note-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "A collection of notes and thoughts",
};

export default async function NotesPage() {
  const notes = await getAllNoteMetadata();

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          A collection of notes and thoughts
        </p>
      </header>

      {notes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No notes yet. Check back later!
        </p>
      ) : (
        <div className="grid gap-6">
          {notes.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
