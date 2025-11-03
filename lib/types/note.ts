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
