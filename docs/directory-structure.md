# ディレクトリ構成

## 概要

このプロジェクトは Next.js App Router を採用しており、以下の原則に基づいてディレクトリを構成しています。

- **コロケーション**: ページ固有のロジック(store, actions, types など)はページと同階層で管理
- **プレゼンテーションとロジックの分離**: コンポーネントは UI に専念し、ビジネスロジックは hooks/stores/services で管理
- **ドメイン駆動設計**: コンポーネントをドメイン非依存/依存で分類

## ルートディレクトリ構成

```
kazuvin-playground/
├── app/                    # Next.js App Router のルート
├── content/                # MDX やマークダウンなどのコンテンツファイル
├── lib/                    # ユーティリティ関数・ヘルパー
├── public/                 # 静的アセット
├── scripts/                # ビルド・デプロイスクリプト
├── config/                 # 設定ファイル
└── docs/                   # プロジェクトドキュメント
```

## app/ ディレクトリ構成

### トップレベル構成

```
app/
├── (commonLayout)/         # Route Group: 共通レイアウトを適用するページ群
│   ├── layout.tsx          # 共通レイアウト定義
│   ├── page.tsx            # ホームページ
│   ├── notes/              # ノートページ
│   └── playgrounds/        # プレイグラウンドページ
├── components/             # すべてのコンポーネント (プレゼンテーションのみ)
├── hooks/                  # グローバルに使用するカスタムフック
├── stores/                 # アプリケーション全体で共有するグローバルステート
├── layout.tsx              # ルートレイアウト
├── globals.css             # グローバルスタイル
├── not-found.tsx           # 404 ページ
└── favicon.ico             # ファビコン
```

### ページ構成 (Route Group 配下)

各ページは以下の構成で管理します。ページ固有のロジックはページと同階層に配置します（**コロケーション**）。

```
app/(commonLayout)/notes/
├── page.tsx                # ページコンポーネント (UI のみ)
├── actions.ts              # Server Actions (データ取得・更新)
├── store.ts                # ページ固有のクライアントステート
├── store.test.ts           # ストアのテスト
├── use-notes-filter.ts     # ページ固有のカスタムフック
├── utils.ts                # ページ固有のユーティリティ関数
├── types.ts                # ページ固有の型定義
├── [slug]/                 # 動的ルート
│   ├── page.tsx
│   ├── actions.ts
│   ├── use-note-editor.ts  # このページ専用のフック
│   ├── utils.ts            # このページ専用のユーティリティ
│   └── types.ts
└── lib/                    # notes ドメイン内で共通使用するロジック
    ├── note-formatter.ts
    └── note-validator.ts
```

#### ページファイルの役割

- `page.tsx`: UI の描画のみを担当。Server Component として実装
- `actions.ts`: Server Actions を定義。データ取得・更新・削除など
- `store.ts`: ページ固有のクライアントステート (UI 状態、フォーム状態など)
- `use-*.ts`: ページ固有のカスタムフック
- `utils.ts`: ページ固有のユーティリティ関数・ヘルパー関数
- `types.ts`: ページで使用する型定義
- `lib/`: ドメイン内の複数ページで共通使用するロジック
- `*.test.ts`: 対応するファイルのテスト

#### Server と Client の責務分離

Next.js App Router では、Server と Client で実行環境が異なるため、適切に責務を分離します。

**実行環境の違い**:

| ファイル | 実行環境 | ディレクティブ | 責務 |
|---------|---------|--------------|------|
| `actions.ts` | Server | `"use server"` | データの取得・永続化、Server 処理 |
| `store.ts` | Client | `"use client"` | UI 状態、Client ロジック、actions の呼び出し |
| `utils.ts` | Both | なし | 純粋関数、ヘルパー（状態を持たない） |

**actions.ts (Server Actions)**:

```typescript
// app/(commonLayout)/notes/actions.ts
"use server"

import { db } from "@/lib/db"

/**
 * Server でのみ実行可能な処理
 * - データベースアクセス
 * - 外部 API 呼び出し
 * - サーバー側の環境変数使用
 */
export async function getNotes() {
  return await db.notes.findMany()
}

export async function createNote(data: NoteInput) {
  return await db.notes.create({ data })
}

export async function deleteNote(id: string) {
  return await db.notes.delete({ where: { id } })
}
```

**store.ts (Client State)**:

```typescript
// app/(commonLayout)/notes/store.ts
"use client"

import { proxy } from "valtio"
import { getNotes, createNote } from "./actions"

/**
 * Client で完結するロジックは store 内部に定義
 * - UI 状態管理
 * - フィルタリング・ソート
 * - クライアント側の計算
 * - Server Actions の呼び出し
 */
export const notesStore = proxy({
  notes: [],
  filterText: "",
  sortOrder: "desc" as "asc" | "desc",
  isLoading: false,

  // Client ロジック（純粋関数として computed）
  get filteredNotes() {
    return this.notes.filter(note =>
      note.title.toLowerCase().includes(this.filterText.toLowerCase())
    )
  },

  get sortedNotes() {
    return [...this.filteredNotes].sort((a, b) =>
      this.sortOrder === "desc"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    )
  },

  // Client ロジック（状態更新）
  setFilterText(text: string) {
    this.filterText = text
  },

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === "desc" ? "asc" : "desc"
  },

  // Server Actions の呼び出し
  async load() {
    this.isLoading = true
    try {
      this.notes = await getNotes()
    } finally {
      this.isLoading = false
    }
  },

  async create(data: NoteInput) {
    const note = await createNote(data)
    this.notes.push(note)
  }
})
```

**utils.ts (Pure Functions)**:

```typescript
// app/(commonLayout)/notes/utils.ts

import type { Note } from "./types"

/**
 * 純粋関数 - Server/Client どちらでも使用可能
 * - 状態を持たない
 * - 副作用がない
 * - 同じ入力には常に同じ出力
 */
export function groupNotesByMonth(notes: Note[]) {
  return notes.reduce((acc, note) => {
    const monthKey = formatMonthKey(note.date)
    if (!acc[monthKey]) {
      acc[monthKey] = { label: formatMonthLabel(note.date), notes: [] }
    }
    acc[monthKey].notes.push(note)
    return acc
  }, {} as Record<string, { label: string; notes: Note[] }>)
}

export function formatMonthKey(date: string): string {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export function formatMonthLabel(date: string): string {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}
```

**重要なポイント**:

1. **actions.ts と store.ts は分離する**
   - Server と Client で実行環境が異なる
   - それぞれ異なるディレクティブ (`"use server"`, `"use client"`) を使用
   - 密接に関連していても、別ファイルで管理

2. **Client ロジックは store 内部に定義**
   - フィルタリング、ソート、UI 状態更新など
   - Client で完結する処理は外部に切り出さない
   - Computed values (getter) を活用

3. **純粋関数は utils.ts に分離**
   - Server/Client どちらでも使える
   - テストしやすい
   - 再利用可能

4. **まとめるべきケース**
   - 状態管理関連のファイルが 3 つ以上ある場合は `state/` ディレクトリでまとめることを検討
   - ただし、基本は Server (actions) と Client (store) の分離を維持

### components/ ディレクトリ構成

`app/components/` 配下のコンポーネントは**必ずプレゼンテーションコンポーネント**として実装します。
ビジネスロジックは含まず、props を受け取って UI を描画することに専念します。

**重要**: この制約は `app/components/` 配下のコンポーネントに適用されます。
`app/(commonLayout)/[page]/page.tsx` などのページコンポーネントには適用されません。

```
app/components/
├── ui/                     # ドメイン非依存の UI 要素
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.stories.tsx
│   │   ├── variants.ts
│   │   ├── index.ts
│   │   └── button.test.tsx (optional)
│   ├── card/
│   ├── dialog/
│   ├── typography/
│   ├── command/
│   ├── timeline/
│   └── index.ts            # エクスポートをまとめる
│
├── shared/                 # ドメイン依存の共通 UI 要素
│   ├── app-header/
│   │   ├── app-header.tsx
│   │   ├── index.ts
│   │   └── app-header.test.tsx (optional)
│   ├── page-header/
│   ├── command-search/
│   │   ├── command-search.tsx
│   │   ├── use-command-search.ts  # コンポーネント固有のロジック
│   │   └── index.ts
│   └── index.ts
│
├── notes/                  # notes ドメイン固有の UI 要素
│   ├── note-card/
│   │   ├── note-card.tsx
│   │   └── index.ts
│   └── index.ts
│
├── home/                   # home ドメイン固有の UI 要素
│   └── index.ts
│
└── index.ts                # すべてのコンポーネントのエクスポート
```

#### コンポーネントの分類基準

1. **ui/**: ドメイン非依存
   - Button, Card, Dialog などの汎用的な UI コンポーネント
   - プロジェクト固有のビジネスロジックを含まない
   - どのプロジェクトでも再利用可能

2. **shared/**: ドメイン依存の共通コンポーネント
   - AppHeader, PageHeader など複数ページで使用
   - プロジェクト固有だが特定ドメインには依存しない
   - アプリケーション全体で共通する UI パターン

3. **[domain]/**: 特定ドメイン固有
   - notes/, user/, products/ など
   - 特定のビジネスドメインに関連する UI
   - そのドメインのページでのみ使用

#### コンポーネントディレクトリ構成

各コンポーネントは以下のファイル構成を推奨します。

```
component-name/
├── component-name.tsx          # コンポーネント本体
├── component-name.stories.tsx  # Storybook ストーリー
├── component-name.test.tsx     # テスト (optional)
├── store.ts                    # コンポーネント専用ストア (optional)
├── use-component-name.ts       # コンポーネント専用フック (optional)
├── utils.ts                    # コンポーネント専用ユーティリティ (optional)
├── variants.ts                 # variant 定義 (optional)
├── types.ts                    # 型定義 (optional、複雑な場合のみ)
└── index.ts                    # エクスポート
```

### hooks/ ディレクトリ構成

カスタムフックは使用範囲に応じて配置場所を決定します。**コロケーション**を優先し、使用する場所の近くに配置します。

#### フックの配置基準

1. **app/hooks/**: グローバルに使用する汎用的なフック
   - 複数のページ・コンポーネントで使用される汎用フック
   - ドメイン非依存のユーティリティフック

   ```
   app/hooks/
   ├── use-media-query.ts      # メディアクエリフック
   ├── use-local-storage.ts    # ローカルストレージフック
   ├── __tests__/              # フックのテスト
   │   ├── use-media-query.test.ts
   │   └── use-local-storage.test.ts
   └── index.ts                # エクスポートをまとめる
   ```

2. **app/components/[component]/use-*.ts**: 特定コンポーネント専用のフック
   - 特定のコンポーネント内でのみ使用されるフック
   - コンポーネントと同じディレクトリに配置

   ```
   app/components/shared/command-search/
   ├── command-search.tsx
   ├── use-command-search.ts   # このコンポーネント専用
   └── index.ts
   ```

3. **app/(commonLayout)/[page]/use-*.ts**: 特定ページ専用のフック
   - 特定のページ内でのみ使用されるフック
   - ページと同じディレクトリに配置

   ```
   app/(commonLayout)/notes/
   ├── page.tsx
   ├── use-notes-filter.ts     # このページ専用
   └── store.ts
   ```

### stores/ ディレクトリ構成

ステート管理は使用範囲に応じて配置場所を決定します。**コロケーション**を優先し、使用する場所の近くに配置します。

#### ストアの配置基準

1. **app/stores/**: アプリケーション全体で共有するグローバルステート
   - 複数のページ・コンポーネントで使用されるグローバルな状態
   - アプリケーション全体で共通する状態管理

   ```
   app/stores/
   ├── theme-store.ts          # テーマの状態管理
   ├── user-store.ts           # ユーザー情報の状態管理
   ├── theme-store.test.ts     # ストアのテスト
   └── index.ts                # エクスポートをまとめる
   ```

2. **app/components/[component]/store.ts**: 特定コンポーネント専用のストア
   - 特定のコンポーネント内でのみ使用される状態管理
   - コンポーネントと同じディレクトリに配置
   - UI 状態など、コンポーネントに閉じたステート

   ```
   app/components/shared/command-search/
   ├── command-search.tsx
   ├── store.ts                # このコンポーネント専用
   ├── use-command-search.ts
   └── index.ts
   ```

3. **app/(commonLayout)/[page]/store.ts**: 特定ページ専用のストア
   - 特定のページ内でのみ使用されるクライアントステート
   - ページと同じディレクトリに配置
   - フォーム状態、フィルター状態など、ページに閉じたステート

   ```
   app/(commonLayout)/notes/
   ├── page.tsx
   ├── store.ts                # このページ専用
   ├── store.test.ts
   ├── use-notes-filter.ts
   └── actions.ts
   ```

## その他のディレクトリ

### lib/ と utils の配置

ユーティリティ関数やヘルパー関数も**コロケーション**を優先します。使用する場所の近くに配置し、複数箇所で使用される汎用的なもののみグローバルに配置します。

#### lib/utils の配置基準

1. **lib/**: プロジェクト全体で使用される汎用的なロジック
   - 複数のページ・コンポーネントで使用される共通ロジック
   - ドメイン非依存のユーティリティ関数
   - ビジネスロジックのコア部分

   ```
   lib/
   ├── utils.ts                # 汎用ユーティリティ (cn, formatDate など)
   ├── notes.ts                # ノート関連の共通ロジック
   └── validators/             # 汎用バリデーション関数
       └── schema-validator.ts
   ```

2. **app/components/[component]/utils.ts**: コンポーネント専用のユーティリティ
   - 特定のコンポーネント内でのみ使用されるヘルパー関数
   - コンポーネントと同じディレクトリに配置

   ```
   app/components/notes/note-card/
   ├── note-card.tsx
   ├── utils.ts                # このコンポーネント専用
   └── index.ts
   ```

3. **app/(commonLayout)/[page]/utils.ts**: ページ専用のユーティリティ
   - 特定のページ内でのみ使用されるヘルパー関数
   - ページと同じディレクトリに配置

   ```
   app/(commonLayout)/notes/
   ├── page.tsx
   ├── utils.ts                # このページ専用
   ├── validators.ts           # このページ専用のバリデーション
   ├── store.ts
   └── actions.ts
   ```

4. **app/(commonLayout)/[domain]/lib/**: ドメイン固有の共通ロジック
   - 特定ドメイン配下の複数ページで使用されるロジック
   - そのドメイン内でのみ使用される場合

   ```
   app/(commonLayout)/notes/
   ├── page.tsx
   ├── [slug]/
   │   └── page.tsx
   └── lib/
       ├── note-formatter.ts   # notes ドメイン内で共通使用
       └── note-validator.ts
   ```

### content/ ディレクトリ

MDX やマークダウンなどのコンテンツファイルを配置します。

```
content/
├── notes/                  # ノートの MDX ファイル
│   ├── note-1.mdx
│   └── note-2.mdx
└── docs/                   # ドキュメントの MDX ファイル
```

## テストファイルの配置

テストファイルの配置は、対象ファイルの数と複雑さに応じて決定します。

### パターン 1: 単一ファイルの場合

単一の汎用ユーティリティファイルには、同階層に `*.test.ts` を配置します。

```
app/(commonLayout)/notes/
├── page.tsx
├── utils.ts
├── utils.test.ts           # ✅ シンプルで見つけやすい
├── store.ts
└── store.test.ts
```

**メリット**:
- ファイルとテストの対応関係が明確
- ファイル数が少ない場合はディレクトリ構造がフラットで見やすい
- インポートパスがシンプル

### パターン 2: 複数の関連ファイルがある場合

関連する複数のユーティリティ（3つ以上）がある場合は、ディレクトリでまとめてコロケーションします。

```
app/(commonLayout)/notes/
├── page.tsx
├── utils/
│   ├── formatters.ts
│   ├── formatters.test.ts
│   ├── validators.ts
│   ├── validators.test.ts
│   ├── helpers.ts
│   ├── helpers.test.ts
│   └── index.ts            # エクスポートをまとめる
├── store.ts
└── store.test.ts
```

**メリット**:
- 関連する複数のユーティリティを論理的にグループ化
- ファイル数が多い場合に整理しやすい
- 責務ごとに分割できる

### パターン 3: ドメイン共通ロジックの場合

ドメイン配下で共通使用するロジックは、`lib/` ディレクトリ内でファイルごとにテストを配置します。

```
app/(commonLayout)/notes/
├── page.tsx
├── [slug]/
│   └── page.tsx
└── lib/
    ├── note-formatter.ts
    ├── note-formatter.test.ts
    ├── note-validator.ts
    ├── note-validator.test.ts
    └── index.ts
```

### パターン 4: 複数のフックがある場合

ページやコンポーネントに複数のカスタムフックがある場合も、同様にディレクトリでまとめます。

```
app/(commonLayout)/notes/
├── page.tsx
├── hooks/
│   ├── use-notes-filter.ts
│   ├── use-notes-filter.test.ts
│   ├── use-notes-sort.ts
│   ├── use-notes-sort.test.ts
│   ├── use-notes-pagination.ts
│   ├── use-notes-pagination.test.ts
│   └── index.ts            # エクスポートをまとめる
├── store.ts
└── actions.ts
```

または、単一フックの場合:

```
app/(commonLayout)/notes/
├── page.tsx
├── use-notes-filter.ts
├── use-notes-filter.test.ts
├── store.ts
└── actions.ts
```

### 判断基準

| 状況 | 推奨パターン | 例 |
|------|------------|-----|
| 単一のユーティリティ/フック | `utils.ts` + `utils.test.ts` または `use-*.ts` + `use-*.test.ts` | ページ固有のヘルパー関数、単一フック |
| 複数の関連ユーティリティ (3つ以上) | `utils/` ディレクトリでまとめる | formatters, validators, helpers など |
| 複数の関連フック (3つ以上) | `hooks/` ディレクトリでまとめる | filter, sort, pagination などのフック群 |
| ドメイン固有の複雑なロジック | `lib/` ディレクトリ内でファイルごとにテスト | ドメインロジック、バリデーター |
| グローバルフック | `app/hooks/__tests__/` | 汎用的なカスタムフック |

## 命名規則

### ファイル名

- **コンポーネント**: `kebab-case.tsx` (例: `note-card.tsx`, `app-header.tsx`)
- **フック**: `use-kebab-case.ts` (例: `use-media-query.ts`)
- **ストア**: `kebab-case-store.ts` (例: `theme-store.ts`)
- **ユーティリティ**: `kebab-case.ts` (例: `utils.ts`)
- **テスト**: `*.test.ts` または `*.test.tsx`
- **Storybook**: `*.stories.tsx`

### ディレクトリ名

- **kebab-case** を使用 (例: `note-card/`, `app-header/`)
- **Route Group**: `(camelCase)` を使用 (例: `(commonLayout)/`)
- **動的ルート**: `[param]` を使用 (例: `[slug]/`)

## ベストプラクティス

### 1. components/ 配下のコンポーネントはプレゼンテーションに専念

`app/components/` 配下のコンポーネントはプレゼンテーションに専念し、ビジネスロジックを含めません。

```tsx
// ❌ Bad: app/components/ 配下でデータ取得
// app/components/notes/note-card/note-card.tsx
export function NoteCard() {
  const [note, setNote] = useState(null);
  useEffect(() => {
    fetchNote().then(setNote);
  }, []);
  return <div>{note?.title}</div>;
}

// ✅ Good: props でデータを受け取る
// app/components/notes/note-card/note-card.tsx
export function NoteCard({ note }: { note: Note }) {
  return <div>{note.title}</div>;
}
```

**注**: `app/(commonLayout)/[page]/page.tsx` などのページコンポーネントはこの制約の対象外です。
ページコンポーネントでは Server Component としてデータ取得を行うことができます。

### 2. ページ固有のロジックはページと同階層に配置（コロケーション）

```
app/(commonLayout)/login/
├── page.tsx                # UI
├── actions.ts              # Server Actions
├── store.ts                # クライアントステート
├── use-login-form.ts       # ページ固有のフック
├── utils.ts                # ページ固有のユーティリティ
└── store.test.ts           # テスト
```

### 3. Server/Client Components の使い分け

- **Server Component** (デフォルト): データ取得、静的コンテンツ
- **Client Component** (`"use client"`): インタラクティブな UI、状態管理

### 4. index.ts では export * を使用

`index.ts` でエクスポートをまとめる際は、`export *` を使用することで、型のエクスポート漏れを防ぎ、メンテナンスを楽にします。

```tsx
// ❌ Bad: 個別に列挙（型の漏れが発生しやすい）
// app/components/ui/button/index.ts
export { Button } from "./button";
export type { ButtonProps } from "./button";
export type { ButtonVariant } from "./button";  // 追加し忘れる可能性

// ✅ Good: export * で自動エクスポート
// app/components/ui/button/index.ts
export * from "./button";

// 使用側
import { Button, type ButtonProps } from "@/app/components/ui/button";
```

**export * の利点**:
- 型のエクスポート漏れを防ぐ
- 新しいエクスポートを追加してもバレルファイルの修正が不要
- すべてのコンポーネントディレクトリで一貫性を保てる

**複数ファイルがある場合**:

```tsx
// app/components/ui/index.ts
export * from "./button";
export * from "./card";
export * from "./dialog";
export * from "./timeline";
export * from "./typography";
```

### 5. 絶対パスインポートを使用

```tsx
// ❌ Bad
import { Button } from "../../../components/ui/button";

// ✅ Good
import { Button } from "@/app/components/ui/button";
```

## まとめ

- **ページ固有のロジック**: ページと同階層に `store.ts`, `actions.ts`, `use-*.ts`, `utils.ts` を配置（コロケーション）
- **components/ 配下のコンポーネント**: プレゼンテーションのみ、`app/components/` 配下にドメイン別に分類
- **コンポーネント固有のロジック**: コンポーネントと同じディレクトリに `store.ts`, `use-*.ts`, `utils.ts` を配置（コロケーション）
- **ドメイン固有の共通ロジック**: ドメイン配下の複数ページで使用する場合は `app/(commonLayout)/[domain]/lib/` に配置
- **ページコンポーネント**: `app/(commonLayout)/[page]/page.tsx` はデータ取得などのロジックを含めることができる
- **グローバルロジック**: 複数箇所で使用される汎用的なものは `hooks/`, `stores/`, `lib/` に配置
- **コロケーション原則**: 関連するファイルは近くに配置して保守性を向上。グローバルディレクトリは汎用的なもののみ
