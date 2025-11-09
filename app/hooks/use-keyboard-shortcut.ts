import { useEffect, useRef } from "react";

export type KeyboardShortcutOptions = {
  /** キーの組み合わせ (例: "k", "Enter", "Escape") */
  key: string;
  /** Ctrlキーが押されている必要があるか */
  ctrlKey?: boolean;
  /** Metaキー(Cmd/Win)が押されている必要があるか */
  metaKey?: boolean;
  /** Shiftキーが押されている必要があるか */
  shiftKey?: boolean;
  /** Altキーが押されている必要があるか */
  altKey?: boolean;
  /** デフォルトの動作を防ぐか (デフォルト: true) */
  preventDefault?: boolean;
  /** イベントの伝播を停止するか (デフォルト: false) */
  stopPropagation?: boolean;
  /** ショートカットを有効にするか (デフォルト: true) */
  enabled?: boolean;
  /** キャプチャフェーズでイベントを処理するか (デフォルト: false) */
  capture?: boolean;
};

/**
 * キーボードショートカットを登録する汎用カスタムフック
 *
 * @example
 * ```tsx
 * // Cmd+K / Ctrl+K でトグル
 * useKeyboardShortcut({
 *   key: "k",
 *   metaKey: true,
 *   ctrlKey: true,
 *   callback: () => setOpen(prev => !prev),
 * });
 *
 * // Escapeで閉じる
 * useKeyboardShortcut({
 *   key: "Escape",
 *   callback: () => setOpen(false),
 *   enabled: open,
 * });
 * ```
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: (event: KeyboardEvent) => void
) {
  const {
    key,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    altKey = false,
    preventDefault = true,
    stopPropagation = false,
    enabled = true,
    capture = false,
  } = options;

  // callbackの最新の参照を保持
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // キーの一致をチェック
      const keyMatch = event.key === key;

      // 修飾キーのチェック
      // metaKeyとctrlKeyは OR 条件（どちらかが押されていればOK）
      const modifierMatch =
        (!metaKey && !ctrlKey) || event.metaKey || event.ctrlKey;
      const shiftMatch = shiftKey === event.shiftKey;
      const altMatch = altKey === event.altKey;

      if (keyMatch && modifierMatch && shiftMatch && altMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callbackRef.current(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture });
    };
  }, [
    key,
    ctrlKey,
    metaKey,
    shiftKey,
    altKey,
    preventDefault,
    stopPropagation,
    enabled,
    capture,
  ]);
}
