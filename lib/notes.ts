import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";

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

// Define all note slugs statically - update this when adding new notes
const ALL_NOTE_SLUGS = ["getting-started", "nextjs-app-router-tips"] as const;

const NOTES_DIR = path.join(process.cwd(), "content/notes");

/**
 * Get all note slugs for static path generation
 * Uses a static list instead of fs to work in Cloudflare Workers
 */
export async function getNoteSlugs(): Promise<string[]> {
  return [...ALL_NOTE_SLUGS];
}

/**
 * Get a specific note by slug using gray-matter
 * Reads MDX file and parses frontmatter
 */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  try {
    const filePath = path.join(NOTES_DIR, `${slug}.mdx`);
    const fileContents = await fs.readFile(filePath, "utf8");
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
 * Get all notes with metadata
 * Uses gray-matter to parse frontmatter
 */
export async function getAllNotes(): Promise<Note[]> {
  const slugs = await getNoteSlugs();
  const notes = await Promise.all(slugs.map((slug) => getNoteBySlug(slug)));

  // Filter out null values and sort by date (newest first)
  return notes
    .filter((note): note is Note => note !== null)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    );
}

/**
 * Get all note metadata only (for list pages)
 * Uses gray-matter to parse frontmatter
 */
export async function getAllNoteMetadata(): Promise<NoteWithMetadata[]> {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
    metadata: note.metadata,
  }));
}
