import { toMonthKey, toMonthLabel } from '@/lib/date'
import type { NotesByMonth, SearchableItem } from '@/lib/types'

export function groupNotesByMonth(notes: SearchableItem[]): Record<string, NotesByMonth> {
  return notes.reduce(
    (acc, note) => {
      const monthKey = toMonthKey(note.metadata.date)
      const monthLabel = toMonthLabel(note.metadata.date)

      if (!acc[monthKey]) {
        acc[monthKey] = {
          label: monthLabel,
          notes: [],
        }
      }
      acc[monthKey].notes.push(note)
      return acc
    },
    {} as Record<string, NotesByMonth>,
  )
}

export function sortMonthsDescending(
  notesByMonth: Record<string, NotesByMonth>,
): [string, NotesByMonth][] {
  return Object.entries(notesByMonth).sort(([a], [b]) => b.localeCompare(a))
}
