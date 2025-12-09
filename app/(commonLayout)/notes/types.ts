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
 * ノートのメタデータのみを含むデータ
 */
export interface NoteWithMetadata {
  /** ノートのスラッグ */
  slug: string;
  /** ノートのメタデータ */
  metadata: NoteMetadata;
}
