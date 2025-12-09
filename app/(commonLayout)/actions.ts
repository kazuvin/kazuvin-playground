import notesIndex from "@/public/notes-index.json";
import type { NoteItem } from "./types";

/**
 * すべてのノートを取得する
 * Server Action として使用可能
 */
export async function getNotes(): Promise<NoteItem[]> {
  return notesIndex as NoteItem[];
}
