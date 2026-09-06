---
paths:
  - "src/**/*.{ts,tsx,css}"
  - "biome.jsonc"
---

# src を触るときのルール

設計上の決めごとは `docs/` にある。**コードを書く前に、作業に対応するドキュメントを読むこと。**
どれも「なぜそうするか」まで書いてあるので、以下の要約ではなく本文を参照する。

| 作業 | 読むファイル |
| --- | --- |
| ファイルの置き場所を決める、層をまたぐ import を書く | `docs/directory-structure.md` |
| コンポーネントを追加・修正する、命名や import の形で迷う | `docs/coding-standards.md` |
| 色・余白・書体・角丸を決める、UI プリミティブを足す | `docs/kotoba-design-system.md` |
| テストを書く、置き場所を決める | `docs/testing.md` |
| `biome.jsonc` の lint ルールを変える | `docs/coding-standards.md` / `docs/directory-structure.md` |
| CI を変える | `docs/ci-cd.md` |
| 画面を見た指摘を受け取る、Agentation / MCP を触る | `docs/agentation.md` |

## 書く前に決まっていること

- **依存は `共有層 → features → app / layouts` の一方向**。feature 間の直接 import は禁止。
  ファイルの置き場所はこの向きから決まる。
- **ファイル名はディレクトリ名も含めてすべて kebab-case**。例外は `src/app/` の規約ファイル
  （`page.tsx` / `layout.tsx` / `[slug]` / `notes-index.json`）だけで、これは URL と
  フレームワークが決めている。
- **`index.ts` の barrel は置かない**。import は実ファイルを直接指す
  （`@/components/ui/card`）。Next はルート単位でチャンクを切るので、barrel を挟むと
  使っていないコンポーネントまでそのページのチャンクに入る。
- **既定は Server Component**。`'use client'` を付けるのは、本当にブラウザで動く必要が
  あるものだけ。境界はできるだけ葉に寄せる（レール全体ではなくナビだけ、表全体ではなく
  再生ボタンだけ）。
- **Static Export なので実行時のサーバーは無い**。SSR / ISR / Middleware / 画像最適化 API /
  動的な Route Handler は使えない。データはビルド時に読む。
- **色は `src/styles/globals.css` の `@theme` にあるものだけ**。

## lint が落とさないもの

古い React の書き方・依存の向き・ファイル名・Node ビルトインの持ち込みは Biome と `tsc` が
落とし、理由はそのメッセージに出る。機械が判定できないのは次の 4 つで、これはレビューでしか
止まらない。

- **`src/components/` にビジネスロジックを持ち込まない**。データ取得と整形はページ
  （Server Component）か `features/` で行い、コンポーネントは props で受け取る。
- **Client Component の中で `fetch` しない**。ビルド時に解決できない場合
  （コマンドパレットの検索インデックスなど）だけの例外。
- **`useMemo` / `useCallback` / `memo` を手で足さない**。まず本当に遅いのかを測る。
- **コメントに設計の説明を書き写さない**。docs にあることはコードに複製せず、残すのは
  コードだけでは復元できない「なぜ」に限る（1〜3 行）。基準は
  `docs/coding-standards.md` の「コメント」。
- **`biome.jsonc` の noNodejsModules 例外に `'use client'` のファイルを足さない**。
  あの一覧は「ビルド時にしか動かない」という宣言で、ブラウザに降りるファイルを入れると
  ガードそのものが無意味になる。

## 内部リンクは next/link

サイト内の行き先は `<a href>` ではなく `next/link` の `<Link>` で書く。`<a>` に戻すと
クリックのたびに文書ごと再読み込みになり、左レールまで組み直される（遷移中のちらつきは
それが原因だった）。ページ内アンカー（`#heading`）と外部リンクは素の `<a>` のまま。

## 変更後に通すもの

```sh
pnpm lint        # Biome。--write 相当は pnpm lint:fix
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run
```
