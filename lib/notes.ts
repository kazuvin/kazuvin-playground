import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";

/**
 * ノートのメタデータ
 */
export interface NoteMetadata {
  /** ノートのタイトル */
  title: string;
  /** 公開日 (YYYY-MM-DD形式) */
  date: string;
  /** ノートの説明 */
  description?: string;
  /** タグのリスト */
  tags?: string[];
  /** 下書きフラグ */
  draft?: boolean;
}

/**
 * ノートの完全なデータ（メタデータとコンテンツを含む）
 */
export interface Note {
  /** ノートのスラッグ */
  slug: string;
  /** ノートのメタデータ */
  metadata: NoteMetadata;
  /** MDXコンテンツ */
  content: string;
}

/**
 * ノートのメタデータのみを含むデータ
 */
export interface NoteWithMetadata {
  /** ノートのスラッグ */
  slug: string;
  /** ノートのメタデータ */
  metadata: NoteMetadata;
}

/**
 * ノート取得のオプション
 */
export interface NoteOptions {
  /** 下書きを含めるかどうか（デフォルト: false） */
  includeDrafts?: boolean;
}

const NOTES_DIR = path.join(process.cwd(), "content/notes");

/**
 * 静的パス生成用にすべてのノートスラッグを取得
 * content/notesディレクトリから動的に読み込みます
 * @param options - 取得オプション
 * @param options.includeDrafts - 下書きを含めるかどうか（デフォルト: false）
 * @returns ノートスラッグの配列
 */
export async function getNoteSlugs(
  options: NoteOptions = {}
): Promise<string[]> {
  const { includeDrafts = false } = options;

  try {
    const files = await fs.readdir(NOTES_DIR);
    const slugs = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));

    if (includeDrafts) {
      return slugs;
    }

    // Filter out drafts by checking metadata
    const slugsWithMetadata = await Promise.all(
      slugs.map(async (slug) => {
        const note = await getNoteBySlug(slug);
        return { slug, isDraft: note?.metadata.draft };
      })
    );

    return slugsWithMetadata
      .filter(({ isDraft }) => !isDraft)
      .map(({ slug }) => slug);
  } catch {
    return [];
  }
}

/**
 * スラッグを指定して特定のノートを取得
 * gray-matterを使用してMDXファイルを読み込み、frontmatterを解析します
 * @param slug - ノートのスラッグ
 * @returns ノートデータ、存在しない場合はnull
 */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  try {
    const filePath = path.join(NOTES_DIR, `${slug}.mdx`);
    const fileContents = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const note: Note = {
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

    return note;
  } catch {
    return null;
  }
}

/**
 * すべてのノートをメタデータ付きで取得
 * gray-matterを使用してfrontmatterを解析し、日付順（新しい順）でソートします
 * @param options - 取得オプション
 * @param options.includeDrafts - 下書きを含めるかどうか（デフォルト: false）
 * @returns ノートの配列（日付順、新しい順）
 */
export async function getAllNotes(options: NoteOptions = {}): Promise<Note[]> {
  const slugs = await getNoteSlugs(options);
  const notes = await Promise.all(slugs.map((slug) => getNoteBySlug(slug)));

  // null値を除外し、日付順（新しい順）でソート
  return notes
    .filter((note): note is Note => note !== null)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    );
}

/**
 * すべてのノートのメタデータのみを取得（一覧ページ用）
 * コンテンツを除外し、メタデータのみを返します
 * @param options - 取得オプション
 * @param options.includeDrafts - 下書きを含めるかどうか（デフォルト: false）
 * @returns ノートメタデータの配列（日付順、新しい順）
 */
export async function getAllNoteMetadata(
  options: NoteOptions = {}
): Promise<NoteWithMetadata[]> {
  const notes = await getAllNotes(options);
  return notes.map((note) => ({
    slug: note.slug,
    metadata: note.metadata,
  }));
}
