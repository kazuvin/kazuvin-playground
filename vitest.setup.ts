import { beforeEach, vi } from "vitest";

// Mock window.scrollTo for tests
beforeEach(() => {
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

  window.scrollTo = vi.fn((options: ScrollToOptions | number, y?: number) => {
    if (typeof options === "object") {
      if (options.left !== undefined) {
        Object.defineProperty(window, "scrollX", {
          writable: true,
          configurable: true,
          value: options.left,
        });
      }
      if (options.top !== undefined) {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: options.top,
        });
      }
    } else {
      Object.defineProperty(window, "scrollX", {
        writable: true,
        configurable: true,
        value: options,
      });
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: y,
      });
    }
  });
});
