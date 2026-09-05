/**
 * 検索可能なアイテムの種類
 */
export type SearchableItemType = "note" | "playground";

/**
 * 検索可能なアイテムの基本メタデータ
 */
export interface SearchableMetadata {
  /** タイトル */
  title: string;
  /** 公開日 (YYYY-MM-DD形式) */
  date: string;
  /** 説明 */
  description?: string;
  /** タグのリスト */
  tags?: string[];
}

/**
 * 検索可能なアイテム（コマンドパレット用）
 *
 * ビルド時に /notes-index.json として出力され、コマンドパレットが fetch する。
 * 生成元は src/pages/notes-index.json.ts。
 */
export interface SearchableItem {
  /** アイテムの種類 */
  type: SearchableItemType;
  /** メタデータ */
  metadata: SearchableMetadata;
  /** 遷移先のURL */
  url: string;
}

/**
 * 一覧表示用のノート情報
 *
 * notes コレクションのエントリを UI が扱いやすい形に落としたもの。
 * 変換は src/features/notes/notes.ts の toNoteSummary が担当する。
 */
export interface NoteSummary {
  /** ノートのスラッグ */
  slug: string;
  /** ノートのメタデータ */
  metadata: {
    /** ノートのタイトル */
    title: string;
    /** 公開日 (YYYY-MM-DD形式) */
    date: string;
    /** ノートの説明 */
    description?: string;
    /** タグのリスト */
    tags: string[];
  };
}

/**
 * 月ごとにグループ化されたノート（ホームのタイムライン表示用）
 */
export interface NotesByMonth {
  /** 表示用の月ラベル (例: "2025年11月") */
  label: string;
  /** その月に属するノート */
  notes: SearchableItem[];
}
