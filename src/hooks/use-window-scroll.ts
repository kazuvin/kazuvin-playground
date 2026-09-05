import { useState, useEffect, useCallback } from "react";

export type WindowScrollPosition = {
  x: number;
  y: number;
};

export type ScrollToOptions = {
  x?: number;
  y?: number;
  behavior?: ScrollBehavior;
};

export function useWindowScroll(): [
  WindowScrollPosition,
  (options: ScrollToOptions) => void,
] {
  const [scrollPosition, setScrollPosition] = useState<WindowScrollPosition>({
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    // 初期値を設定
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = useCallback((options: ScrollToOptions) => {
    if (typeof window === "undefined") return;

    window.scrollTo({
      left: options.x,
      top: options.y,
      behavior: options.behavior || "smooth",
    });
  }, []);

  return [scrollPosition, scrollTo];
}
