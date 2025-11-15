"use client";

import { useState, useCallback, useMemo } from "react";
import type { SearchableItem } from "@/lib/types";

/**
 * Command検索のフック
 */
export function useCommandSearch(items: SearchableItem[] = []) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /**
   * 検索でフィルタリング
   */
  const filteredItems = useMemo(() => {
    if (!search) return items;

    const searchLower = search.toLowerCase();
    return items.filter((item) => {
      const { title, description, tags } = item.metadata;

      // 各フィールドで検索
      const titleMatch = title.toLowerCase().includes(searchLower);
      const descriptionMatch =
        description?.toLowerCase().includes(searchLower) ?? false;
      const tagsMatch =
        tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ?? false;

      return titleMatch || descriptionMatch || tagsMatch;
    });
  }, [items, search]);

  /**
   * アイテム選択のハンドラー
   */
  const handleSelect = useCallback((url: string) => {
    setOpen(false);
    setSearch("");
    // ページ遷移を実行
    window.location.href = url;
  }, []);

  /**
   * ダイアログを開く
   */
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  /**
   * ダイアログを閉じる
   */
  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  return {
    open,
    search,
    filteredItems,
    setSearch,
    handleSelect,
    handleOpen,
    handleClose,
  };
}
