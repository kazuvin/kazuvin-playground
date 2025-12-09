import { getAllNoteMetadata } from "@/lib/notes";
import type { NoteWithMetadata } from "./types";

/**
 * すべてのノートのメタデータを取得する
 * Server Action として使用可能
 */
export async function getNotes(): Promise<NoteWithMetadata[]> {
  return await getAllNoteMetadata();
}
