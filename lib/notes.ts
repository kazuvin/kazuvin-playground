import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface NoteMetadata {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

export interface Note {
  slug: string;
  metadata: NoteMetadata;
  content: string;
}

export interface NoteWithMetadata {
  slug: string;
  metadata: NoteMetadata;
}

const notesDirectory = path.join(process.cwd(), "content/notes");

/**
 * Get all note slugs for static path generation
 * This only runs at build time (SSG), so Node.js APIs are available
 */
export async function getNoteSlugs(): Promise<string[]> {
  const files = fs.readdirSync(notesDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get a specific note by slug
 * This only runs at build time (SSG), so Node.js APIs are available
 */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  try {
    const fullPath = path.join(notesDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      metadata: {
        title: data.title || "",
        date: data.date || "",
        description: data.description,
        tags: data.tags,
        draft: data.draft,
      },
      content,
    };
  } catch {
    return null;
  }
}

/**
 * Get all notes with full content
 * This only runs at build time (SSG), so Node.js APIs are available
 */
export async function getAllNotes(): Promise<Note[]> {
  const slugs = await getNoteSlugs();
  const notes = await Promise.all(
    slugs.map((slug) => getNoteBySlug(slug))
  );

  // Filter out null values and sort by date (newest first)
  return notes
    .filter((note): note is Note => note !== null)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    );
}

/**
 * Get all note metadata only (for list pages)
 * This only runs at build time (SSG), so Node.js APIs are available
 */
export async function getAllNoteMetadata(): Promise<NoteWithMetadata[]> {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
    metadata: note.metadata,
  }));
}
