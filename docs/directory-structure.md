# ディレクトリ構成

## 概要

このプロジェクトは Astro (静的サイト生成) を採用しており、以下の原則に基づいてディレクトリを構成しています。

- **コロケーション**: ドメイン固有のロジック (store, utils, types など) は使用する場所の近くで管理
- **プレゼンテーションとロジックの分離**: コンポーネントは UI に専念し、ロジックは features/hooks/stores で管理
- **ドメイン駆動設計**: コンポーネントをドメイン非依存/依存で分類
- **islands**: 対話が必要なコンポーネントだけを React として hydrate し、それ以外は静的 HTML として配信

## ルートディレクトリ構成

```
kazuvin-playground/
├── src/                    # アプリケーションのソース
├── content/                # MDX などのコンテンツファイル (Content Collections の実体)
├── public/                 # 静的アセット (そのまま dist/ にコピーされる)
├── docs/                   # プロジェクトドキュメント
├── astro.config.mjs        # Astro の設定
└── wrangler.jsonc          # Cloudflare 配信の設定 (静的アセットのみ)
```

## src/ ディレクトリ構成

```
src/
├── pages/                  # ルーティング (このディレクトリの構造がそのまま URL になる)
├── layouts/                # ページを包むレイアウト (.astro)
├── components/             # すべてのコンポーネント (プレゼンテーションのみ)
├── features/               # ドメイン固有のロジック (データ取得・変換・純粋関数)
├── hooks/                  # グローバルに使用するカスタムフック
├── stores/                 # アプリケーション全体で共有するグローバルステート
├── lib/                    # ドメイン非依存のユーティリティ・共通型
├── config/                 # アプリケーション設定
├── styles/globals.css      # デザイントークンとグローバルスタイル
└── content.config.ts       # Content Collections のスキーマ定義
```

### pages/ ディレクトリ

```
src/pages/
├── index.astro             # /
├── 404.astro               # 404 ページ
├── notes/
│   ├── index.astro         # /notes
│   └── [slug].astro        # /notes/:slug (getStaticPaths で全件を静的生成)
├── playgrounds/
│   └── index.astro         # /playgrounds
└── notes-index.json.ts     # /notes-index.json (静的エンドポイント)
```

**重要**: `src/pages/` 配下は**ルーティング専用**です。ここに置いた `.ts` は
API ルートとして扱われ URL を持ってしまうため、ページ固有の utils / types / hooks を
ページと同階層にコロケーションすることはできません。**ページ固有のロジックは
`src/features/<domain>/` に置きます。**

#### ページファイルの役割

- `*.astro`: URL に対応するページ。frontmatter (`---` で囲まれた部分) はビルド時にのみ実行される
- `*.json.ts` などのエンドポイント: ビルド時に JSON などの静的ファイルを出力する
- ページの frontmatter ではデータ取得と整形の**呼び出し**のみを行い、実装は `features/` に置く

```astro
---
// src/pages/notes/index.astro
import { getPublishedNotes, toNoteSummary } from "@/features/notes";
import CommonLayout from "@/layouts/common-layout.astro";

const notes = (await getPublishedNotes()).map(toNoteSummary);
---

<CommonLayout title="Notes">
  {notes.map((note) => <NoteCard note={note} />)}
</CommonLayout>
```

### layouts/ ディレクトリ

```
src/layouts/
├── base-layout.astro       # <html>/<head>/<body>・フォント・globals.css・メタタグ
└── common-layout.astro     # base-layout + ヘッダー + main (通常のページはこちらを使う)
```

複数ページで共有する外枠 (ヘッダー・`<main>` の幅・メタタグ) は、
すべてこのディレクトリのレイアウトコンポーネントで表現します。

### features/ ディレクトリ

ドメイン固有のロジックを置きます。`src/pages/` にコロケーションできないものの受け皿であり、
コンテンツの取得・変換・純粋関数・ドメイン固有のフックが対象です。

```
src/features/
└── notes/
    ├── notes.ts                 # コレクションの取得と変換 (getPublishedNotes など)
    ├── group-by-month.ts        # 純粋関数
    ├── group-by-month.test.ts    # 対応するテスト
    └── index.ts                 # エクスポートをまとめる
```

#### ビルド時と クライアント の責務分離

Astro ではページの frontmatter と `features/` の関数は**ビルド時にのみ**実行され、
クライアントには一切送られません。ブラウザで動くのは island として明示的に hydrate した
React コンポーネントだけです。

| ファイル                       | 実行環境     | 責務                           |
| ------------------------------ | ------------ | ------------------------------ |
| `*.astro` の frontmatter       | ビルド時     | データ取得・整形の呼び出し     |
| `features/*.ts`                | ビルド時     | コンテンツ取得、変換、純粋関数 |
| `components/**/*.tsx` (island) | クライアント | UI 状態、イベント処理          |
| `stores/*.ts`                  | クライアント | island 間で共有するステート    |
| `lib/*.ts`                     | 両方         | 純粋関数、共通型               |

#### island の作り方

対話が必要なコンポーネントだけを `client:*` ディレクティブ付きで読み込みます。
ディレクティブを付けない React コンポーネントは、ビルド時に HTML へ描画されて JS を送りません。

```astro
---
// src/components/shared/app-header/app-header.astro
import { CommandSearch } from "@/components/shared/command-search";
---

<header>
  <a href="/">Kazuvin Playground</a>
  {/* このコンポーネントだけが JS として配信される */}
  <CommandSearch client:idle />
</header>
```

| ディレクティブ   | 使いどころ                                       |
| ---------------- | ------------------------------------------------ |
| なし             | 静的な表示のみ (既定。まずここを検討する)        |
| `client:idle`    | すぐには不要だが操作される可能性があるもの       |
| `client:load`    | 初期表示直後から操作されるもの                   |
| `client:visible` | ページ下部にあり、スクロールされて初めて使うもの |

### components/ ディレクトリ構成

`src/components/` 配下のコンポーネントは**必ずプレゼンテーションコンポーネント**として実装します。
ビジネスロジックは含まず、props を受け取って UI を描画することに専念します。

**重要**: この制約は `src/components/` 配下のコンポーネントに適用されます。
`src/pages/**/*.astro` などのページコンポーネントには適用されません。

```
src/components/
├── ui/                     # ドメイン非依存の UI 要素
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.stories.tsx
│   │   ├── variants.ts
│   │   ├── index.ts
│   │   └── button.test.tsx (optional)
│   ├── card/
│   ├── dialog/
│   ├── command/
│   ├── screen/
│   ├── text/
│   ├── timeline/
│   └── index.ts            # エクスポートをまとめる
│
├── shared/                 # ドメイン依存の共通 UI 要素
│   ├── app-header/
│   │   └── app-header.astro
│   ├── page-header/
│   │   ├── page-header.tsx
│   │   └── index.ts
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
└── home/                   # home ドメイン固有の UI 要素
    └── index.ts
```

#### .astro と .tsx の使い分け

- **`.astro`**: 対話を持たないコンポーネント。JS を一切送らない
- **`.tsx`**: island になりうるもの、Storybook で単体確認したいもの、
  `ui/` のようにどこからでも再利用する部品

`.astro` コンポーネントは `.ts` の barrel (`index.ts`) から re-export すると型が解決できないため、
利用側からパスを直接 import します (例: `@/components/shared/app-header/app-header.astro`)。

#### コンポーネントの分類基準

1. **ui/**: ドメイン非依存
   - Button, Card, Dialog などの汎用的な UI コンポーネント
   - プロジェクト固有のビジネスロジックを含まない
   - どのプロジェクトでも再利用可能

2. **shared/**: ドメイン依存の共通コンポーネント
   - AppHeader, PageHeader など複数ページで使用
   - プロジェクト固有だが特定ドメインには依存しない

3. **[domain]/**: 特定ドメイン固有
   - notes/, home/ など
   - そのドメインのページでのみ使用

#### コンポーネントディレクトリ構成

```
component-name/
├── component-name.tsx          # コンポーネント本体 (静的なら .astro)
├── component-name.stories.tsx  # Storybook ストーリー
├── component-name.test.tsx     # テスト (optional)
├── store.ts                    # コンポーネント専用ストア (optional)
├── use-component-name.ts       # コンポーネント専用フック (optional)
├── utils.ts                    # コンポーネント専用ユーティリティ (optional)
├── variants.ts                 # variant 定義 (optional)
├── types.ts                    # 型定義 (optional、複雑な場合のみ)
└── index.ts                    # エクスポート (.astro のみの場合は不要)
```

### hooks/ ディレクトリ構成

カスタムフックは使用範囲に応じて配置場所を決定します。**コロケーション**を優先します。

1. **src/hooks/**: 複数の island で使う汎用フック

   ```
   src/hooks/
   ├── use-keyboard-shortcut.ts
   ├── use-window-scroll.ts
   ├── use-window-scroll.test.ts
   └── index.ts
   ```

2. **src/components/[component]/use-\*.ts**: 特定コンポーネント専用のフック

   ```
   src/components/shared/command-search/
   ├── command-search.tsx
   ├── use-command-search.ts   # このコンポーネント専用
   └── index.ts
   ```

3. **src/features/[domain]/use-\*.ts**: 特定ドメイン専用のフック

### stores/ ディレクトリ構成

ページ単位のサーバーステートは存在しない (ビルド時に解決される) ため、
ストアが扱うのは **island 間で共有するクライアントステート**だけです。

1. **src/stores/**: 複数の island で共有するグローバルステート

   ```
   src/stores/
   ├── theme-store.ts
   ├── theme-store.test.ts
   └── index.ts
   ```

2. **src/components/[component]/store.ts**: 特定コンポーネント専用のストア

   ```
   src/components/shared/command-search/
   ├── command-search.tsx
   ├── store.ts                # このコンポーネント専用
   ├── use-command-search.ts
   └── index.ts
   ```

## その他のディレクトリ

### lib/ と utils の配置

1. **src/lib/**: プロジェクト全体で使用される汎用ロジックと共通型

   ```
   src/lib/
   ├── cn/                     # className 結合ユーティリティ
   ├── utils.ts                # 汎用ユーティリティ (formatDate など)
   └── types.ts                # 複数レイヤーで共有する型 (SearchableItem など)
   ```

2. **src/features/[domain]/**: ドメイン固有のロジック

3. **src/components/[component]/utils.ts**: コンポーネント専用のユーティリティ

   ```
   src/components/notes/note-card/
   ├── note-card.tsx
   ├── utils.ts                # このコンポーネント専用
   └── index.ts
   ```

### content/ ディレクトリ

MDX などのコンテンツファイルを配置します。スキーマは `src/content.config.ts` で定義し、
frontmatter はビルド時に検証されます。**frontmatter の型はここが唯一の出典**です。

```
content/
└── notes/                  # ノートの MDX ファイル
    ├── note-1.mdx
    └── note-2.mdx
```

`draft: true` のノートは `getPublishedNotes()` が除外するため、ビルド出力にも含まれません。

## テストファイルの配置

テストファイルの配置は、対象ファイルの数と複雑さに応じて決定します。

### パターン 1: 単一ファイルの場合

```
src/features/notes/
├── group-by-month.ts
├── group-by-month.test.ts  # ✅ シンプルで見つけやすい
└── index.ts
```

### パターン 2: 複数の関連ファイルがある場合

関連する複数のユーティリティ (3 つ以上) がある場合は、ディレクトリでまとめます。

```
src/features/notes/
├── utils/
│   ├── formatters.ts
│   ├── formatters.test.ts
│   ├── validators.ts
│   ├── validators.test.ts
│   └── index.ts
└── index.ts
```

### パターン 3: 複数のフックがある場合

```
src/features/notes/
├── hooks/
│   ├── use-notes-filter.ts
│   ├── use-notes-filter.test.ts
│   ├── use-notes-sort.ts
│   ├── use-notes-sort.test.ts
│   └── index.ts
└── index.ts
```

### 判断基準

| 状況                                | 推奨パターン                        | 例                                     |
| ----------------------------------- | ----------------------------------- | -------------------------------------- |
| 単一のユーティリティ/フック         | `*.ts` + `*.test.ts` を同階層       | ドメイン固有のヘルパー関数、単一フック |
| 複数の関連ユーティリティ (3 つ以上) | `utils/` ディレクトリでまとめる     | formatters, validators, helpers など   |
| 複数の関連フック (3 つ以上)         | `hooks/` ディレクトリでまとめる     | filter, sort, pagination など          |
| グローバルフック                    | `src/hooks/` に配置し同階層にテスト | 汎用的なカスタムフック                 |

なお、`src/pages/` 配下にはテストを置けません (ルートとして扱われるため)。
ページから呼ばれるロジックを `features/` に置くのは、テスト可能にするためでもあります。

## 命名規則

### ファイル名

- **コンポーネント**: `kebab-case.tsx` / `kebab-case.astro` (例: `note-card.tsx`, `app-header.astro`)
- **レイアウト**: `kebab-case.astro` (例: `base-layout.astro`)
- **フック**: `use-kebab-case.ts` (例: `use-media-query.ts`)
- **ストア**: `kebab-case-store.ts` (例: `theme-store.ts`)
- **ユーティリティ**: `kebab-case.ts` (例: `group-by-month.ts`)
- **テスト**: `*.test.ts` または `*.test.tsx`
- **Storybook**: `*.stories.tsx`

`.astro` も例外ではありません。`HeroSection.astro` ではなく `hero-section.astro` とします。
フレームワークが名前を固定しているもの (`astro.config.mjs`, `src/content.config.ts`,
`404.astro`, `[slug].astro`) のみが例外です。

### ディレクトリ名

- **kebab-case** を使用 (例: `note-card/`, `app-header/`)
- **動的ルート**: `[param]` を使用 (例: `[slug].astro`)

## ベストプラクティス

### 1. components/ 配下のコンポーネントはプレゼンテーションに専念

`src/components/` 配下のコンポーネントはプレゼンテーションに専念し、ビジネスロジックを含めません。

```tsx
// ❌ Bad: src/components/ 配下でデータ取得
// src/components/notes/note-card/note-card.tsx
export function NoteCard() {
  const [note, setNote] = useState(null);
  useEffect(() => {
    fetchNote().then(setNote);
  }, []);
  return <div>{note?.title}</div>;
}

// ✅ Good: props でデータを受け取る
// src/components/notes/note-card/note-card.tsx
export function NoteCard({ note }: { note: NoteSummary }) {
  return <div>{note.metadata.title}</div>;
}
```

### 2. 既定は静的、島は最小限に

`client:*` を付けるのは、そのコンポーネントが**本当にブラウザで動く必要がある**ときだけです。
ヘッダー全体を island にするのではなく、コマンドパレットだけを island にします。

### 3. データ取得はページの frontmatter か features/ で行う

island の中で `fetch` してデータを取りに行くのは、ビルド時に解決できない場合
(コマンドパレットの検索インデックスなど) に限ります。

### 4. 型の出典を一箇所にする

コンテンツの型は `src/content.config.ts` のスキーマから導出します。
同じ形の interface を複数箇所に書き写さないでください。
