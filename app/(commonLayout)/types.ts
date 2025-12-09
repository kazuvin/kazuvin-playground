export interface NoteMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface NoteItem {
  type: string;
  url: string;
  metadata: NoteMetadata;
}

export interface NotesByMonth {
  label: string;
  notes: NoteItem[];
}
