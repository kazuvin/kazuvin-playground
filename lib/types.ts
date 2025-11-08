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
  /** 下書きフラグ */
  draft?: boolean;
}

/**
 * 検索可能なアイテム（コマンドパレット用）
 */
export interface SearchableItem {
  /** アイテムの種類 */
  type: SearchableItemType;
  /** メタデータ */
  metadata: SearchableMetadata;
  /** 遷移先のURL */
  url: string;
}
