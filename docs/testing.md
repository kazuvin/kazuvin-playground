# テストガイド

## 概要

このプロジェクトでは、Vitest を使用してテストを実装します。テストは以下の原則に基づいて配置・実装します。

- **コロケーション**: テストファイルは対象ファイルの近くに配置
- **命名規則**: `*.test.ts` または `*.test.tsx`
- **カバレッジ**: ビジネスロジック、ユーティリティ関数、フックを優先的にテスト

## テストの種類

### 1. Unit テスト

ユーティリティ関数、ビジネスロジック、フックなどの単体テスト。

**対象**:
- `utils.ts`: ビジネスロジック、ヘルパー関数
- `hooks/use-*.ts`: カスタムフック
- `lib/*.ts`: 汎用ユーティリティ

**環境**: happy-dom (Node.js 環境)

### 2. Storybook テスト

コンポーネントのビジュアルリグレッションテストとインタラクションテスト。

**対象**:
- `*.stories.tsx`: Storybook ストーリー

**環境**: Chromium (ブラウザ環境)

## テストファイルの配置

テストファイルの配置については、[ディレクトリ構成ドキュメント](./directory-structure.md#テストファイルの配置)を参照してください。

### 基本パターン

**単一ファイル**:
```
app/(commonLayout)/
├── utils.ts
└── utils.test.ts           # 同階層に配置
```

**複数ファイル**:
```
app/(commonLayout)/
└── utils/
    ├── formatters.ts
    ├── formatters.test.ts
    ├── validators.ts
    └── validators.test.ts
```

## テストコマンド

```bash
# すべてのテストを実行
pnpm test

# テストを1回だけ実行 (CI用)
pnpm test:run

# UI モードでテストを実行
pnpm test:ui

# 特定のテストファイルを実行
pnpm test utils.test

# Storybook のテストのみ実行
pnpm test storybook
```

## テストの書き方

### 基本構造

```typescript
import { describe, it, expect } from "vitest";
import { functionToTest } from "./module";

describe("functionToTest", () => {
  it("should do something correctly", () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });
});
```

### ユーティリティ関数のテスト

#### 例: グルーピング関数のテスト

```typescript
// app/(commonLayout)/utils.test.ts
import { describe, it, expect } from "vitest";
import { groupNotesByMonth } from "./utils";
import type { NoteItem } from "./types";

describe("groupNotesByMonth", () => {
  it("should group notes by month correctly", () => {
    const notes: NoteItem[] = [
      {
        type: "note",
        url: "/notes/note1",
        metadata: {
          title: "Note 1",
          date: "2024-01-15",
          description: "First note",
          tags: ["tag1"],
        },
      },
      {
        type: "note",
        url: "/notes/note2",
        metadata: {
          title: "Note 2",
          date: "2024-01-20",
          description: "Second note",
          tags: ["tag2"],
        },
      },
    ];

    const result = groupNotesByMonth(notes);

    expect(Object.keys(result)).toHaveLength(1);
    expect(result["2024-01"]).toBeDefined();
    expect(result["2024-01"].label).toBe("2024年1月");
    expect(result["2024-01"].notes).toHaveLength(2);
  });

  it("should handle empty array", () => {
    const notes: NoteItem[] = [];
    const result = groupNotesByMonth(notes);

    expect(Object.keys(result)).toHaveLength(0);
  });
});
```

#### テストすべきケース

1. **正常系**: 期待通りに動作するケース
2. **境界値**: 空配列、単一要素、最大値など
3. **エッジケース**: 特殊な入力パターン
4. **エラーケース**: 不正な入力（必要に応じて）

### カスタムフックのテスト

#### 例: シンプルなフックのテスト

```typescript
// app/hooks/use-window-scroll.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWindowScroll } from "./use-window-scroll";

describe("useWindowScroll", () => {
  beforeEach(() => {
    // window オブジェクトのモック
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
  });

  it("should initialize with current window scroll position", () => {
    const { result } = renderHook(() => useWindowScroll());
    const [position] = result.current;

    expect(position).toEqual({ x: 0, y: 0 });
  });

  it("should update scroll position when window scrolls", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    const [position] = result.current;
    expect(position.y).toBe(100);
  });
});
```

#### フックテストのベストプラクティス

1. `@testing-library/react` の `renderHook` を使用
2. `act()` で状態更新を囲む
3. `beforeEach` でモック・初期化を行う
4. `afterEach` でクリーンアップ

### ソート関数のテスト

```typescript
// app/(commonLayout)/utils.test.ts
import { describe, it, expect } from "vitest";
import { sortMonthsDescending } from "./utils";
import type { NotesByMonth } from "./types";

describe("sortMonthsDescending", () => {
  it("should sort months in descending order", () => {
    const notesByMonth: Record<string, NotesByMonth> = {
      "2024-01": { label: "2024年1月", notes: [] },
      "2024-03": { label: "2024年3月", notes: [] },
      "2024-02": { label: "2024年2月", notes: [] },
    };

    const result = sortMonthsDescending(notesByMonth);

    expect(result).toHaveLength(3);
    expect(result[0][0]).toBe("2024-03");
    expect(result[1][0]).toBe("2024-02");
    expect(result[2][0]).toBe("2024-01");
  });

  it("should handle empty object", () => {
    const notesByMonth = {};
    const result = sortMonthsDescending(notesByMonth);

    expect(result).toHaveLength(0);
  });

  it("should sort across different years correctly", () => {
    const notesByMonth: Record<string, NotesByMonth> = {
      "2023-12": { label: "2023年12月", notes: [] },
      "2024-02": { label: "2024年2月", notes: [] },
      "2024-01": { label: "2024年1月", notes: [] },
      "2023-11": { label: "2023年11月", notes: [] },
    };

    const result = sortMonthsDescending(notesByMonth);

    expect(result[0][0]).toBe("2024-02");
    expect(result[1][0]).toBe("2024-01");
    expect(result[2][0]).toBe("2023-12");
    expect(result[3][0]).toBe("2023-11");
  });
});
```

### データ変換関数のテスト

```typescript
// lib/formatters.test.ts
import { describe, it, expect } from "vitest";
import { formatDate, formatCurrency } from "./formatters";

describe("formatDate", () => {
  it("should format date correctly", () => {
    const date = new Date("2024-01-15");
    const result = formatDate(date);

    expect(result).toBe("2024年1月15日");
  });

  it("should handle invalid date", () => {
    const result = formatDate(null);

    expect(result).toBe("");
  });
});

describe("formatCurrency", () => {
  it("should format currency with yen symbol", () => {
    const result = formatCurrency(1000);

    expect(result).toBe("¥1,000");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0);

    expect(result).toBe("¥0");
  });

  it("should handle negative numbers", () => {
    const result = formatCurrency(-500);

    expect(result).toBe("-¥500");
  });
});
```

## Vitest のマッチャー

### 基本的なマッチャー

```typescript
// 等価性
expect(value).toBe(expected);           // 厳密等価 (===)
expect(value).toEqual(expected);        // 深い等価性
expect(value).toStrictEqual(expected);  // より厳密な等価性

// 真偽値
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// 数値
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(4.5);
expect(value).toBeCloseTo(0.3); // 浮動小数点の比較

// 文字列
expect(string).toMatch(/pattern/);
expect(string).toContain("substring");

// 配列・オブジェクト
expect(array).toHaveLength(3);
expect(array).toContain(item);
expect(object).toHaveProperty("key");
expect(object).toHaveProperty("key", value);

// 関数
expect(fn).toThrow();
expect(fn).toThrow(Error);
expect(fn).toThrow("error message");
```

### 非同期のテスト

```typescript
// Promise
it("should resolve with data", async () => {
  const data = await fetchData();
  expect(data).toEqual({ id: 1 });
});

it("should reject with error", async () => {
  await expect(fetchData()).rejects.toThrow("Error");
});

// async/await
it("should wait for async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBe("success");
});
```

## モック

### 関数のモック

```typescript
import { describe, it, expect, vi } from "vitest";

describe("with mocks", () => {
  it("should call function with correct arguments", () => {
    const mockFn = vi.fn();

    mockFn("arg1", "arg2");

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should return mocked value", () => {
    const mockFn = vi.fn().mockReturnValue("mocked");

    const result = mockFn();

    expect(result).toBe("mocked");
  });
});
```

### モジュールのモック

```typescript
import { describe, it, expect, vi } from "vitest";

// モジュール全体をモック
vi.mock("./api", () => ({
  fetchData: vi.fn().mockResolvedValue({ data: "mocked" }),
}));

import { fetchData } from "./api";

describe("with module mocks", () => {
  it("should use mocked module", async () => {
    const result = await fetchData();
    expect(result).toEqual({ data: "mocked" });
  });
});
```

### タイマーのモック

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("with timer mocks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should execute after timeout", () => {
    const callback = vi.fn();
    setTimeout(callback, 1000);

    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

## ベストプラクティス

### 1. テストは明確で読みやすく

```typescript
// ❌ Bad: 何をテストしているか不明確
it("works", () => {
  const result = fn(data);
  expect(result).toBe(true);
});

// ✅ Good: 明確な説明
it("should return true when input is valid", () => {
  const validInput = { name: "John", age: 30 };
  const result = validateUser(validInput);
  expect(result).toBe(true);
});
```

### 2. 各テストは独立させる

```typescript
// ❌ Bad: テスト間で状態を共有
let sharedState = [];

it("should add item", () => {
  sharedState.push(1);
  expect(sharedState).toHaveLength(1);
});

it("should have items", () => {
  // 前のテストに依存
  expect(sharedState).toHaveLength(1);
});

// ✅ Good: 各テストで初期化
describe("array operations", () => {
  let state: number[];

  beforeEach(() => {
    state = [];
  });

  it("should add item", () => {
    state.push(1);
    expect(state).toHaveLength(1);
  });

  it("should start empty", () => {
    expect(state).toHaveLength(0);
  });
});
```

### 3. AAA パターンを使用

```typescript
it("should calculate total correctly", () => {
  // Arrange (準備)
  const items = [
    { price: 100, quantity: 2 },
    { price: 200, quantity: 1 },
  ];

  // Act (実行)
  const total = calculateTotal(items);

  // Assert (検証)
  expect(total).toBe(400);
});
```

### 4. エッジケースをテストする

```typescript
describe("divide", () => {
  it("should divide numbers correctly", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("should handle division by zero", () => {
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
  });

  it("should handle negative numbers", () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it("should handle decimal numbers", () => {
    expect(divide(10, 3)).toBeCloseTo(3.33, 2);
  });
});
```

### 5. テストの粒度

```typescript
// ❌ Bad: 1つのテストで複数のことをテスト
it("should do everything", () => {
  expect(fn1()).toBe(true);
  expect(fn2()).toBe(false);
  expect(fn3()).toEqual({ data: "test" });
});

// ✅ Good: 1つのテストで1つのことをテスト
describe("functions", () => {
  it("should return true for fn1", () => {
    expect(fn1()).toBe(true);
  });

  it("should return false for fn2", () => {
    expect(fn2()).toBe(false);
  });

  it("should return object for fn3", () => {
    expect(fn3()).toEqual({ data: "test" });
  });
});
```

## テストカバレッジ

### カバレッジの確認

```bash
# カバレッジレポートを生成
pnpm test:run --coverage
```

### カバレッジの目標

- **ユーティリティ関数**: 100% を目指す
- **ビジネスロジック**: 80% 以上
- **カスタムフック**: 80% 以上
- **コンポーネント**: Storybook テストでカバー

### カバレッジレポートの見方

```
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
utils.ts            |   100   |   100    |   100   |   100   |
formatters.ts       |   95.5  |   90     |   100   |   95.5  |
```

- **% Stmts**: 文のカバレッジ
- **% Branch**: 分岐のカバレッジ
- **% Funcs**: 関数のカバレッジ
- **% Lines**: 行のカバレッジ

## CI/CD での実行

### GitHub Actions での例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test:run

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()
```

## トラブルシューティング

### よくある問題

#### 1. "window is not defined" エラー

**原因**: happy-dom 環境で window オブジェクトが正しく初期化されていない

**解決策**:
```typescript
beforeEach(() => {
  Object.defineProperty(window, 'property', {
    writable: true,
    configurable: true,
    value: 'value',
  });
});
```

#### 2. 非同期テストのタイムアウト

**原因**: テストが完了する前にタイムアウト

**解決策**:
```typescript
it("should wait for long operation", async () => {
  // タイムアウトを延長
  vi.setConfig({ testTimeout: 10000 });

  const result = await longRunningOperation();
  expect(result).toBeDefined();
}, 10000); // または個別にタイムアウトを指定
```

#### 3. モックがリセットされない

**原因**: テスト間でモックが共有されている

**解決策**:
```typescript
afterEach(() => {
  vi.clearAllMocks();  // すべてのモックをクリア
  vi.restoreAllMocks(); // すべてのモックを復元
});
```

## 参考リンク

- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Testing Library 公式ドキュメント](https://testing-library.com/)
- [Storybook Testing Addon](https://storybook.js.org/docs/writing-tests/test-addon)

## まとめ

- **コロケーション**: テストは対象ファイルの近くに配置
- **命名**: `*.test.ts` または `*.test.tsx`
- **独立性**: 各テストは独立して実行可能
- **明確性**: テストの意図が明確になるように記述
- **カバレッジ**: ビジネスロジックを優先的にテスト
- **AAA パターン**: Arrange, Act, Assert の順で記述
