import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Note, NoteMetadata, NoteWithMetadata } from "./types/note";

const notesDirectory = path.join(process.cwd(), "content/notes");

/**
 * Get all note slugs for static path generation
 */
export async function getNoteSlugs(): Promise<string[]> {
  if (!fs.existsSync(notesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(notesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

/**
 * Get a specific note by slug
 */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  try {
    const fullPath = path.join(notesDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      metadata: data as NoteMetadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading note ${slug}:`, error);
    return null;
  }
}

/**
 * Get all notes with full content
 */
export async function getAllNotes(): Promise<Note[]> {
  const slugs = await getNoteSlugs();
  const notes = await Promise.all(
    slugs.map((slug) => getNoteBySlug(slug))
  );

  return notes
    .filter((note): note is Note => note !== null)
    .filter((note) => !note.metadata.draft)
    .sort((a, b) => {
      const dateA = new Date(a.metadata.date);
      const dateB = new Date(b.metadata.date);
      return dateB.getTime() - dateA.getTime();
    });
}

/**
 * Get all note metadata only (for list pages)
 */
export async function getAllNoteMetadata(): Promise<NoteWithMetadata[]> {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
    metadata: note.metadata,
  }));
}
