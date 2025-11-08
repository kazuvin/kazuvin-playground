"use client";

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

// モックデータ
const MOCK_ITEMS: SearchableItem[] = [
  {
    type: "note",
    url: "/notes/react-hooks",
    metadata: {
      title: "React Hooksの使い方",
      date: "2024-06-01",
      description: "useState, useEffect, useCallbackなどの基本的なフックの解説",
      tags: ["React", "Hooks", "Frontend"],
    },
  },
  {
    type: "note",
    url: "/notes/typescript-basics",
    metadata: {
      title: "TypeScript基礎",
      date: "2024-06-02",
      description: "型定義とジェネリクスの基本",
      tags: ["TypeScript", "型安全"],
    },
  },
  {
    type: "playground",
    url: "/playground/nextjs-app",
    metadata: {
      title: "Next.js App Router",
      date: "2024-06-03",
      description: "App Routerを使ったプロジェクトのサンプル",
      tags: ["Next.js", "React", "App Router"],
    },
  },
  {
    type: "playground",
    url: "/playground/tailwind-components",
    metadata: {
      title: "Tailwind CSS コンポーネント集",
      date: "2024-06-04",
      description: "再利用可能なUIコンポーネント",
      tags: ["Tailwind", "CSS", "UI"],
    },
  },
];

/**
 * キーボードショートカット対応のCommand検索ダイアログ
 */
export function CommandSearch() {
  const {
    open,
    search,
    filteredItems,
    setSearch,
    handleSelect,
    handleOpen,
    handleClose,
  } = useCommandSearch(MOCK_ITEMS);

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
              <CommandEmpty>検索結果が見つかりませんでした</CommandEmpty>
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
