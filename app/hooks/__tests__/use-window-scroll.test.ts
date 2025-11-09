import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWindowScroll } from "../use-window-scroll";

describe("useWindowScroll", () => {
  beforeEach(() => {
    // Mock window.scrollX and scrollY
    Object.defineProperty(window, "scrollX", {
      writable: true,
      configurable: true,
      value: 0,
    });

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock window.scrollTo
    const scrollToMock = vi.fn((x?: number | ScrollToOptions, y?: number) => {
      if (typeof x === "object") {
        if (x.left !== undefined) {
          Object.defineProperty(window, "scrollX", {
            writable: true,
            configurable: true,
            value: x.left,
          });
        }
        if (x.top !== undefined) {
          Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: x.top,
          });
        }
      } else if (typeof x === "number") {
        Object.defineProperty(window, "scrollX", {
          writable: true,
          configurable: true,
          value: x,
        });
        if (y !== undefined) {
          Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: y,
          });
        }
      }
    });

    Object.defineProperty(window, "scrollTo", {
      writable: true,
      configurable: true,
      value: scrollToMock,
    });

    // Reset window scroll position before each test
    window.scrollTo(0, 0);
  });

  it("should initialize with current window scroll position", () => {
    const { result } = renderHook(() => useWindowScroll());
    const [scrollPosition] = result.current;

    expect(scrollPosition).toEqual({ x: 0, y: 0 });
  });

  it("should update scroll position when window scrolls", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      window.scrollTo(100, 200);
      window.dispatchEvent(new Event("scroll"));
    });

    const [scrollPosition] = result.current;
    expect(scrollPosition).toEqual({ x: 100, y: 200 });
  });

  it("should provide scrollTo function that scrolls the window", () => {
    const { result } = renderHook(() => useWindowScroll());
    const [, scrollTo] = result.current;

    const scrollToSpy = vi.spyOn(window, "scrollTo");

    act(() => {
      scrollTo({ x: 150, y: 250, behavior: "smooth" });
    });

    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 150,
      top: 250,
      behavior: "smooth",
    });

    scrollToSpy.mockRestore();
  });

  it("should use smooth behavior by default when scrolling", () => {
    const { result } = renderHook(() => useWindowScroll());
    const [, scrollTo] = result.current;

    const scrollToSpy = vi.spyOn(window, "scrollTo");

    act(() => {
      scrollTo({ x: 100, y: 100 });
    });

    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 100,
      top: 100,
      behavior: "smooth",
    });

    scrollToSpy.mockRestore();
  });

  it("should allow scrolling to only x coordinate", () => {
    const { result } = renderHook(() => useWindowScroll());
    const [, scrollTo] = result.current;

    const scrollToSpy = vi.spyOn(window, "scrollTo");

    act(() => {
      scrollTo({ x: 300 });
    });

    expect(scrollToSpy).toHaveBeenCalledWith({
      left: 300,
      top: undefined,
      behavior: "smooth",
    });

    scrollToSpy.mockRestore();
  });

  it("should allow scrolling to only y coordinate", () => {
    const { result } = renderHook(() => useWindowScroll());
    const [, scrollTo] = result.current;

    const scrollToSpy = vi.spyOn(window, "scrollTo");

    act(() => {
      scrollTo({ y: 400 });
    });

    expect(scrollToSpy).toHaveBeenCalledWith({
      left: undefined,
      top: 400,
      behavior: "smooth",
    });

    scrollToSpy.mockRestore();
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useWindowScroll());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
