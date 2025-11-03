import type { Note, NoteWithMetadata } from "./types/note";
// Import the pre-generated notes data (no fs dependency)
import notesData from "@/app/data/notes.json";

/**
 * Get all note slugs for static path generation
 */
export async function getNoteSlugs(): Promise<string[]> {
  return notesData.map((note) => note.slug);
}

/**
 * Get a specific note by slug
 */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const note = notesData.find((n) => n.slug === slug);
  return note || null;
}

/**
 * Get all notes with full content
 */
export async function getAllNotes(): Promise<Note[]> {
  return notesData as Note[];
}

/**
 * Get all note metadata only (for list pages)
 */
export async function getAllNoteMetadata(): Promise<NoteWithMetadata[]> {
  return notesData.map((note) => ({
    slug: note.slug,
    metadata: note.metadata,
  }));
}
