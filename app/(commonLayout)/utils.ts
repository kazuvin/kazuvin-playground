import type { NoteItem, NotesByMonth } from "./types";

/**
 * ノートを月ごとにグループ化する
 */
export function groupNotesByMonth(
  notes: NoteItem[]
): Record<string, NotesByMonth> {
  return notes.reduce(
    (acc, note) => {
      const date = new Date(note.metadata.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = `${date.getFullYear()}年${date.getMonth() + 1}月`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          label: monthLabel,
          notes: [],
        };
      }
      acc[monthKey].notes.push(note);
      return acc;
    },
    {} as Record<string, NotesByMonth>
  );
}

/**
 * 月ごとのノートを新しい順にソートする
 */
export function sortMonthsDescending(
  notesByMonth: Record<string, NotesByMonth>
): [string, NotesByMonth][] {
  return Object.entries(notesByMonth).sort(([a], [b]) => b.localeCompare(a));
}
