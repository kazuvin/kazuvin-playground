# コーディング規約

命名と import の書き方。いずれも Biome で機械的に落とす。
ファイルの置き場所と層の境界は [ディレクトリ構成](directory-structure.md) にある。

## リンター / フォーマッター

**Biome が唯一のリンター兼フォーマッター**で、ESLint と Prettier（の大半）を置き換えている。
設定は `biome.jsonc` の 1 ファイルに集約し、層の境界も `overrides` でここに書く。

| 対象 | lint | format |
| --- | --- | --- |
| `.ts` / `.tsx` / `.mts` / `.mjs` / `.json` / `.jsonc` / `.css` | Biome | Biome |
| `.astro` | (なし) | Prettier + `prettier-plugin-astro` |
| すべて | `astro check`（型） | — |

### なぜ .astro だけ Prettier なのか

Biome の `.astro` 対応は**フロントマター（`---` で囲んだスクリプト）に限られる**。
テンプレートは整形されず、さらに**テンプレートでしか使わない変数や import を
`noUnusedVariables` / `noUnusedImports` が未使用と誤検知する**。

```astro
---
const title = "Notes"   // ← Biome はここだけを見て「未使用」と判定する
---
<h1>{title}</h1>        <!-- ← この参照が見えていない -->
```

そのため `biome.jsonc` の `files.includes` で `.astro` を対象から外し、整形は Prettier に、
型は `astro check` に渡している。**`.astro` には Biome のガードレールが効かない**ので、
ロジックは `.astro` に書かず `features/` に置く。テスト可能にするためであると同時に、
lint を効かせるためでもある。

Prettier が `.astro` 以外に手を出さないよう、`.prettierignore` で全ファイルを除外してから
`.astro` だけを戻している。gitignore 記法では**除外したディレクトリの中身は再包含できない**
ため、`!*/` でディレクトリの探索を残す 3 行の順序が必要になる。ここを崩すと Prettier は
黙って何も整形しなくなる。

### 整形スタイル

シングルクォート・セミコロンなし・行幅 100。JSX の属性だけダブルクォート。
Biome と Prettier の両方に同じ値を書いてあるので、`.astro` とそれ以外で見た目は揃う。

## 命名規則

bulletproof-react に倣い、**ファイル名は React コンポーネントも含めてすべて kebab-case** に
統一する（`note-card.tsx`、`app-header.astro`）。Biome の `useFilenamingConvention` で
`kebab-case` のみを許可し、違反は lint で落ちる。

- **ディレクトリ名も kebab-case**。ただし Biome が検査するのはファイル名だけなので、
  ディレクトリ名はレビューで担保する。
- **`.astro` も Biome の対象外**なので同じくレビューで担保する。`HeroSection.astro` ではなく
  `hero-section.astro`。
- フレームワークが名前を固定しているものだけが例外（`astro.config.mjs`、
  `src/content.config.ts`、`404.astro`、`[slug].astro`）。

| 種類 | 形 | 例 |
| --- | --- | --- |
| コンポーネント | `kebab-case.tsx` / `.astro` | `note-card.tsx` |
| フック | `use-kebab-case.ts` | `use-window-scroll.ts` |
| ストア | `kebab-case-store.ts` | `theme-store.ts` |
| テスト | `*.test.ts` / `*.test.tsx` | `cn.test.ts` |
| Storybook | `*.stories.tsx` | `button.stories.tsx` |

## import の書き方

### barrel（`index.ts`）を置かない

**再エクスポート専用の `index.ts` は作らない。** import は実ファイルを直接指す。
`noBarrelFile` と `noReExportAll` で lint に落とす。

```ts
import { Card, CardHeader } from '@/components/ui/card'  // OK
import { Card, CardHeader } from '@/components/ui'       // NG
```

理由は **knip が export 単位で未使用を追跡できなくなる**こと。barrel を経由すると
「エントリから参照されている」とだけ見え、どの export が実際に使われているかを
knip が判定できない。実際、`DialogClose` / `TimelineIcon` / `CONTENT_ROLES` が
未使用として見つかったのは barrel が無かったからで、これらは削除済み。
再エクスポートの連鎖が循環参照の温床になりやすいのも避けたい点。

**バンドルサイズは理由にならない。** このリポジトリで実測したところ、`ui/` の 7 部品を
再エクスポートする barrel を挟んでも island のチャンクは 76,482 B → 76,499 B の
**17 バイト増**に留まった。使っていない部品は Rollup が完全に落とす。
「barrel はツリーシェイキングを壊す」は、少なくともこの構成では成り立たない。

`.astro` コンポーネントはそもそも `.ts` から re-export すると型が解決できないので、
利用側からパスを直接 import する（`./app-header.astro`）。

### 自前モジュールは flat named import で参照する

`import * as X from '@/...'` は lint で落ちる。外部ライブラリは対象外
（Storybook の `setProjectAnnotations` のように、公式 API が名前空間オブジェクトを
要求する場合だけ `biome-ignore` で個別に外す）。

- 自前モジュールの判定は `./**` `../**` `@/**` という**パス形式**で行う。
- エイリアスは `@/*` の 1 系統に固定する。Biome の import 制限は文字列マッチで動くため、
  エイリアスを増やすと境界チェックに穴が開く。

### 共有 UI は 1 ファイルに flat named export

Compound Components は**パーツを 1 ファイルにまとめて flat named export** する
（Radix UI と同じ形）。`Card.Header` ではなく `CardHeader`。

```
src/components/ui/card.tsx        Card / CardHeader / CardTitle / ... を 1 ファイルで
src/components/ui/card.stories.tsx
```

`src/components/ui/**` には `useComponentExportOnlyModules` を掛けており、
**コンポーネント以外の値を export できない**。Radix のプリミティブを公開するときも
`const Dialog = DialogPrimitive.Root` の別名ではなく、薄い関数コンポーネントで包む。

禁じられているのは **export** であって、ファイルの中身ではない。variant のクラス定数や
ヘルパーは private な `const` / `function` として同じファイルに置く。ファイルを分けると
本来不要な `export` が必要になり、公開する名前が増えてしまう。他のコンポーネントからも
使うようになったら、そのとき `lib/` へ引き上げる。

## React の書き方

React 19 + Astro の island。`biome.jsonc` が機械的に落とすのは次のとおり。

- **`import * as React` / `import React` は禁止**。必要な API は named import で取り込む
  （`import type { ComponentProps, ReactNode } from 'react'`）。JSX の変換に React の
  import は不要で、`React.forwardRef` のような旧 API への入口にもなるため。
- **`forwardRef` は使わない**。React 19 では `ref` が通常の props になった。
- **`FC` / `FunctionComponent` / `PropsWithChildren` は使わない**。props の型は引数に
  直接書き、`children` を取るなら `children: ReactNode` と明示する。
- **クラスコンポーネントは使わない**（`componentDidCatch` を持つエラーバウンダリのみ例外）。
- **`<></>` に統一する**。`React.Fragment` を書くのは `key` を渡すときだけ。
- **`Children` / `cloneElement` は使わない**。children の構造に依存するので、
  context か render prop に置き換える。

## 日付の扱い

**日付を組み立てる入口は `src/lib/date.ts` だけ。** 生の `new Date()` と `Date.now()` は
GritQL プラグイン（`no-raw-date.grit`）で lint に落とす。

`new Date('2025-11-03')` は UTC 0 時と解釈され、日本時間では前日になる。各所で直に
触られると同じ間違いが何度でも入るため、Date に触れてよいファイルを 1 つに限っている。

- ノートの日付は frontmatter の `YYYY-MM-DD` が出典。**画面側でもその形の文字列のまま
  持ち回り**、日付として解釈するのは `lib/date.ts` の中だけにする。
- 月ごとのグループ化（`features/notes/group-by-month.ts`）も `toMonthKey` /
  `toMonthLabel` を経由する。Date を挟むと解釈のタイムゾーン次第で月末・月初が
  隣の月に落ちる。
- 例外は `plugins.includes` で外してある。`lib/date.ts` 本体と、frontmatter が
  `Date` にパースされるのを受ける `features/notes/notes.ts`、それにテスト。
- 個別に外したい行には `// biome-ignore lint/plugin: 理由` を置く。
  `lint/plugin` 以外の書き方（`plugin:` など）は効かない。
- 組み込みの `noRestrictedGlobals` で `Date` を禁じると型注釈の `Date` まで落ちるため、
  生成式だけを狙える GritQL 側で書いている。

## 未使用コードの検出

`pnpm knip` で未使用のファイル・export・依存を洗い出す。barrel を置かない構成なので、
export 単位まで追跡できる。CI には入れておらず、手動で回す棚卸し用。
