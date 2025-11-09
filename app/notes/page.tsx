import { getAllNoteMetadata } from "@/lib/notes";
import { NoteCard } from "@/app/components/notes";
import { Typography } from "@/app/components/ui";
import { PageHeader } from "@/app/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "A collection of notes and thoughts",
};

export const dynamic = "force-static";

export default async function NotesPage() {
  const notes = await getAllNoteMetadata();

  return (
    <div>
      <PageHeader
        title="Notes"
        description="A collection of notes and thoughts"
      />

      {notes.length === 0 ? (
        <Typography variant="small">
          No notes yet. Check back later!
        </Typography>
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
