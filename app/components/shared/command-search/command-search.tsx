"use client";

import { useEffect, useState } from "react";
import type { SearchableItem } from "@/lib/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { useKeyboardShortcut } from "@/app/hooks";
import { useCommandSearch } from "./use-command-search";

/**
 * キーボードショートカット対応のCommand検索ダイアログ
 */
export function CommandSearch() {
  const [items, setItems] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    open,
    search,
    filteredItems,
    setSearch,
    handleSelect,
    handleOpen,
    handleClose,
  } = useCommandSearch(items);

  // ダイアログが開いたときにデータをfetch（初回のみ）
  useEffect(() => {
    if (open && items.length === 0 && !isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      fetch("/notes-index.json")
        .then((res): Promise<SearchableItem[]> => res.json())
        .then((data: SearchableItem[]) => {
          setItems(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load notes index:", error);
          setIsLoading(false);
        });
    }
  }, [open, items.length, isLoading]);

  // キーボードショートカット (Cmd+K / Ctrl+K)
  useKeyboardShortcut(
    {
      key: "k",
      metaKey: true,
      ctrlKey: true,
    },
    () => {
      if (open) {
        handleClose();
      } else {
        handleOpen();
      }
    },
  );

  const toggleOpen = () => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  // アイテムをタイプ別にグループ化
  const itemsByType = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, SearchableItem[]>,
  );

  return (
    <>
      <button
        onClick={toggleOpen}
        className="text-sm rounded-xl px-3 py-1 bg-primary text-primary-foreground font-semibold cursor-pointer"
      >
        ⌘K
      </button>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="p-0 max-w-lg">
          <DialogTitle className="sr-only">検索</DialogTitle>
          <Command>
            <CommandInput
              placeholder="検索..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "読み込み中..." : "検索結果が見つかりませんでした"}
              </CommandEmpty>
              {Object.entries(itemsByType).map(([type, typeItems]) => (
                <CommandGroup key={type} heading={type}>
                  {typeItems.map((item) => (
                    <CommandItem
                      key={item.url}
                      onSelect={() => handleSelect(item.url)}
                      value={`${item.metadata.title} ${item.metadata.tags?.join(" ") ?? ""}`}
                    >
                      <div className="flex items-center justify-between flex-1">
                        <div className="font-medium">{item.metadata.title}</div>
                        {item.metadata.tags &&
                          item.metadata.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {item.metadata.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
