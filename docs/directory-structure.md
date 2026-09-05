# ディレクトリ構成

## 概要

このプロジェクトは Astro (静的サイト生成) を採用しており、以下の原則に基づいてディレクトリを構成しています。

- **コロケーション**: ドメイン固有のロジック (store, utils, types など) は使用する場所の近くで管理
- **プレゼンテーションとロジックの分離**: コンポーネントは UI に専念し、ロジックは features/hooks/stores で管理
- **ドメイン駆動設計**: コンポーネントをドメイン非依存/依存で分類
- **islands**: 対話が必要なコンポーネントだけを React として hydrate し、それ以外は静的 HTML として配信
- **一方向の依存**: 共有層 → features → pages / layouts。向きは Biome が lint で強制する

命名と import の書き方は [コーディング規約](coding-standards.md) にあります。

## ルートディレクトリ構成

```
kazuvin-playground/
├── src/                    # アプリケーションのソース
├── content/                # MDX などのコンテンツファイル (Content Collections の実体)
├── public/                 # 静的アセット (そのまま dist/ にコピーされる)
├── docs/                   # プロジェクトドキュメント
├── .claude/rules/          # Claude Code 用のルール (frontmatter の paths で対象を絞る)
├── astro.config.mjs        # Astro の設定
├── biome.jsonc             # lint / format と層の境界の設定 (ガードレールの本体)
├── no-raw-date.grit        # Biome の GritQL プラグイン (生の Date を禁じる)
├── knip.jsonc              # 未使用ファイル・export・依存の検出
├── lefthook.yml            # commit 前に走るフック
├── mise.toml               # Node / pnpm のバージョン (単一の情報源)
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

## レイヤー境界

依存は **`共有層 → features → pages / layouts`** の一方向に限ります。
Biome の `noRestrictedImports` を `overrides` で層ごとに設定しており、違反は lint で落ちます。

| 層 | ディレクトリ | 参照してよい先 |
| --- | --- | --- |
| app | `pages/` `layouts/` | すべて |
| features | `features/<domain>/` | 共有層と、自分自身の feature のみ |
| 共有層 | `hooks/` `stores/` `lib/` `config/` | 共有層のみ |
| ui | `components/ui/` | `lib/cn` などドメインを知らないものだけ |

トップレベルのディレクトリ名がそのまま層の名前になっています。
`app-header.astro` が `components/` ではなく `layouts/` にあるのも、
features (コマンドパレット) を参照する必要があるためです。

- **feature 間の直接 import は禁止**。共有したくなったら `lib/` へ引き上げるか、
  ページの frontmatter で両方を呼んで合成する。
- **自 feature 内は相対 import で書く**（`@/features/**` は自分自身を含めて全面禁止のため）。
  feature ごとに例外を書かず、1 つの override で境界を表現するための割り切り。
- **`components/ui/` はドメインを知らない**。`@/lib/types` の `NoteSummary` のような型を
  import した時点で、その画面でしか使えない部品になる。表示に必要な値は素の props
  (string / number) で受け取り、ドメインの型からの変換は `features/<domain>/` の UI で行う。
- **親を遡る相対 import (`../`) は共有層・features・ui で禁止**。この記法を許すと
  `@/` エイリアスに対する境界チェックを表記の違いだけですり抜けられるため。
- `overrides` の options はグローバル設定を**マージではなく上書き**する。そのため各 override で
  React まるごと取り込み禁止の `paths` を再掲している。消すとその配下だけ素通りになる。

**`.astro` にはこの lint が効きません** (Biome の対象外。理由は
[コーディング規約](coding-standards.md#なぜ-astro-だけ-prettier-なのか))。
ロジックを `.astro` に書かず `features/` に置くのは、テスト可能にするためであると同時に、
境界チェックを効かせるためでもあります。

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
import { getPublishedNotes, toNoteSummary } from '@/features/notes/notes'
import CommonLayout from '@/layouts/common-layout.astro'

const notes = (await getPublishedNotes()).map(toNoteSummary)
---

<CommonLayout title="Notes">
  {notes.map((note) => <NoteCard note={note} />)}
</CommonLayout>
```

### layouts/ ディレクトリ

```
src/layouts/
├── base-layout.astro       # <html>/<head>/<body>・フォント・globals.css・メタタグ
├── app-header.astro        # サイトヘッダー (コマンドパレットの island を置く)
└── common-layout.astro     # base-layout + app-header + main (通常のページはこちらを使う)
```

`app-header.astro` が `components/` ではなく `layouts/` にあるのは、コマンドパレットの
island (`@/features/notes/command-search`) を描画するためです。features を参照できるのは
app 層だけなので、features を使うコンポーネントは `layouts/` か `pages/` に置きます。

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
    ├── group-by-month.test.ts   # 対応するテスト
    ├── search-index.ts          # 検索インデックスの取得・絞り込み・グループ化
    ├── search-index.test.ts
    ├── note-card.tsx            # ドメインの型を受け取る UI
    ├── notes-timeline.tsx
    ├── note-timeline-item.tsx
    └── command-search.tsx       # コマンドパレット (island)
```

**features には UI を置けます。** ドメインを知っている island は、`components/` ではなく
ここが居場所です (`components/` は features を import できないため)。

`index.ts` は置きません。利用側は `@/features/notes/notes` のように実ファイルを直接指します。

#### ビルド時とクライアントの責務分離

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

`src/**` には `noNodejsModules` を掛けており、ブラウザに届きうるコードに Node の
ビルトインを持ち込めません。

#### island の作り方

対話が必要なコンポーネントだけを `client:*` ディレクティブ付きで読み込みます。
ディレクティブを付けない React コンポーネントは、ビルド時に HTML へ描画されて JS を送りません。

```astro
---
// src/layouts/app-header.astro
import { CommandSearch } from '@/features/notes/command-search'
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

**1 コンポーネント = 1 ファイル**にし、ディレクトリと `index.ts` は作りません。
Compound Components のパーツも 1 ファイルにまとめて flat named export します
(理由は [コーディング規約](coding-standards.md#共有-ui-は-1-ファイルに-flat-named-export))。

```
src/components/
└── ui/                     # UI プリミティブ。components 配下はこれだけ
    ├── button.tsx          # variant のクラス定義も private でこの中
    ├── button.stories.tsx
    ├── card.tsx
    ├── card.stories.tsx
    ├── command.tsx
    ├── dialog.tsx
    ├── page-header.tsx
    ├── screen.tsx
    ├── text.tsx
    └── timeline.tsx
```

**`src/components/` はドメインを知らない部品だけの置き場です。** ドメインを知っている UI
(`NoteSummary` のような型を受け取るもの) は `features/<domain>/` に置きます。bulletproof-react
と同じ切り方で、1 つのドメインを理解するのに 2 つのツリーを行き来せずに済みます。

`shared` のような広い名前のディレクトリは作りません。何でも入ってしまうためです。
ドメイン非依存だが UI プリミティブでもないもの (SEO、エラーバウンダリなど) が出てきたら、
そのとき `components/seo/` `components/errors/` のように**役割名で**追加します。

#### .astro と .tsx の使い分け

- **`.astro`**: 対話を持たないコンポーネント。JS を一切送らない
- **`.tsx`**: island になりうるもの、Storybook で単体確認したいもの、
  `ui/` のようにどこからでも再利用する部品

`.astro` コンポーネントは `.ts` から re-export すると型が解決できないため、
利用側からパスを直接 import します (例: `./app-header.astro`)。

#### コンポーネントの置き場所を決める

| 問い | 置き場所 |
| --- | --- |
| ドメインの型 (`NoteSummary` など) を受け取る? | `src/features/<domain>/` |
| 1 ページでしか使わない静的なマークアップ? | そのページに直接書く |
| どちらでもない (ドメインを知らない部品) | `src/components/ui/` |

`components/ui/**` には lint が掛かっており、**ドメインの語彙を持ち込めません**。
`@/lib/types` や `@/features/**` の import は落ちます。`PageHeader` のように
ui プリミティブを組み合わせただけの部品も、ドメインを知らない限りここに置きます。
逆にドメインの型を受け取るようになったら、それが features へ移す合図です。

ホームの挨拶文が `src/pages/index.astro` に直接書かれているのは 2 番目の例です。
1 箇所でしか使わず、状態も持たないマークアップに、ファイルを与える理由はありません。

#### ロジックを切り出す基準

**まず、切り出さないことを既定にします。** コンポーネントの中で完結する状態やハンドラを
`use-<component>.ts` のような専用フックに追い出すと、読む側は 2 ファイルを往復することに
なり、可読性はむしろ下がります。1 箇所でしか使わないものに別ファイルを与える理由は
ありません。

切り出す価値が出るのは次の 3 つのどれかに当てはまるときだけです。

| 状況 | 行き先 | 例 |
| --- | --- | --- |
| 2 つ目の利用者が現れた | `src/hooks/` | `use-keyboard-shortcut.ts` |
| ドメインの知識が入っている | `src/features/<domain>/` | `notes/search-index.ts` |
| ドメインに依らない純粋関数 | `src/lib/` | `lib/date.ts` |

**ドメインの知識が入っているものは、テストのためにも切り出します。** 検索の絞り込みが
`features/notes/search-index.ts` にあるのは、コンポーネントに閉じたままでは
単体テストが書けなかったためです。

variant のクラス定義も同じで、コンポーネント本体に private な定数として置きます。
`components/ui/**` の `useComponentExportOnlyModules` が禁じているのは
**値の export** だけなので、export しなければ同じファイルに同居できます
(型の export は許されますが、外から使わないものは export しません)。

この基準は主要な OSS の実態とも一致します。shadcn/ui (505 コンポーネント)、
bulletproof-react、vercel/commerce、withastro/docs には**コンポーネント同居のフックが
1 つもありません**。cal.com と excalidraw を含めて数えても、約 1,850 のコンポーネント
ファイルに対して同居フックは 13 件 (0.7%) で、いずれも大きな機能群の中にあります。
再利用されるフックは中央の `hooks/` へ、ドメインのロジックは feature へ集まり、
残りはコンポーネント本体に留まる、という配分になっています。

### hooks/ ディレクトリ構成

**フックを置くのは「2 つ目の利用者が現れてから」です**
([ロジックを切り出す基準](#ロジックを切り出す基準))。1 つの island でしか使わない状態は、
そのコンポーネントの中に書きます。

1. **src/hooks/**: 複数の island で使う汎用フック

   ```
   src/hooks/
   ├── use-keyboard-shortcut.ts
   ├── use-window-scroll.ts
   └── use-window-scroll.test.ts
   ```

2. **src/features/<domain>/use-\*.ts**: ドメインの知識を持つフック

`src/components/` にフックのファイルは置きません。ドメインを知らない部品に、
切り出すほどのロジックは生まれないためです。

### stores/ ディレクトリ構成

ページ単位のサーバーステートは存在しない (ビルド時に解決される) ため、
ストアが扱うのは **island 間で共有するクライアントステート**だけです。

置き場所はフックと同じ基準です。**1 つの island に閉じた状態は `useState` のまま
コンポーネントに置き**、島をまたいで共有する必要が出てからストアにします。

1. **src/stores/**: 複数の island で共有するグローバルステート

   ```
   src/stores/
   ├── theme-store.ts
   └── theme-store.test.ts
   ```

2. **src/features/<domain>/<name>-store.ts**: ドメインに閉じた共有ステート

## その他のディレクトリ

### lib/ と utils の配置

1. **src/lib/**: プロジェクト全体で使用される汎用ロジックと共通型

   ```
   src/lib/
   ├── cn.ts                   # className 結合ユーティリティ
   ├── cn.test.ts
   ├── date.ts                 # 日付を組み立てる唯一の場所 (生の Date は lint で禁止)
   └── types.ts                # 複数レイヤーで共有する型 (SearchableItem など)
   ```

2. **src/features/<domain>/**: ドメイン固有のロジック

`src/components/` にユーティリティのファイルは置きません。コンポーネントの中で完結する
処理は本体に書き、切り出す段になったら上の 2 つのどちらかに行き先が決まります。

`src/lib/date.ts` 以外での `new Date()` / `Date.now()` は GritQL プラグイン
(`no-raw-date.grit`) が lint で落とします。詳細は
[コーディング規約](coding-standards.md#日付の扱い) を参照してください。

### config/ ディレクトリ

```
src/config/
└── app.ts                  # サイト名・説明など、ビルド時に決まる定数
```

`index.ts` という名前は使いません (barrel と区別がつかないため)。

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

テストファイルは**対象と同じ階層**に `*.test.ts` として置きます。

```
src/features/notes/
├── group-by-month.ts
└── group-by-month.test.ts
```

関連するユーティリティやフックが 3 つ以上に増えたら、`utils/` や `hooks/` の
サブディレクトリでまとめ、その中でも同じくテストを同階層に置きます。

なお、`src/pages/` 配下にはテストを置けません (ルートとして扱われるため)。
ページから呼ばれるロジックを `features/` に置くのは、テスト可能にするためでもあります。

詳細は [テスト](testing.md) を参照してください。

## 命名規則

ファイル名・ディレクトリ名はすべて **kebab-case** です。`.astro` も例外ではありません
(`HeroSection.astro` ではなく `hero-section.astro`)。
一覧と、lint で担保される範囲は [コーディング規約](coding-standards.md#命名規則) にあります。

動的ルートだけは Astro の記法に従い `[param]` を使います (`[slug].astro`)。

## ベストプラクティス

### 1. components/ 配下のコンポーネントはプレゼンテーションに専念

`src/components/` 配下のコンポーネントはプレゼンテーションに専念し、ビジネスロジックを含めません。

```tsx
// ❌ Bad: components/ 配下でデータ取得
// src/components/ui/card.tsx
export function NoteCard() {
  const [note, setNote] = useState(null)
  useEffect(() => {
    fetchNote().then(setNote)
  }, [])
  return <div>{note?.title}</div>
}

// ✅ Good: props でデータを受け取る (ドメインの型を受けるので置き場所は features)
// src/features/notes/note-card.tsx
export function NoteCard({ note }: { note: NoteSummary }) {
  return <div>{note.metadata.title}</div>
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

### 5. 未使用のファイル・export は溜めない

barrel を置かない構成なので `pnpm knip` が export 単位で未使用を検出できます。
機能を消したら、その export も一緒に消えているかを確認してください。

**export するのは、他のファイルから実際に使うものだけです。** props 型も例外ではなく、
外から必要になったら `ComponentProps<typeof Button>` で取り出せます
(検証済み)。使う場所ができた時点で export に変えれば済むので、先回りして公開しません。
knip はこの方針を前提に設定してあり、`ignoreExportsUsedInFile` は有効にしていません。
有効にすると「export しているが自ファイル内でしか使わない」という、まさに検出したい
ケースが報告されなくなるためです。
