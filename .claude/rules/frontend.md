---
paths:
  - "src/**/*.{ts,tsx,astro,css}"
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

## 書く前に決まっていること

- **依存は `共有層 → features → pages / layouts` の一方向**。feature 間の直接 import は禁止。
  ファイルの置き場所はこの向きから決まる。
- **ファイル名はディレクトリ名も含めてすべて kebab-case**。`.astro` も例外ではない。
- **`index.ts` の barrel は置かない**。import は実ファイルを直接指す
  （`@/components/ui/card`）。Astro は island 単位でバンドルを切るので、barrel を挟むと
  使っていないコンポーネントまで island のチャンクに入る。
- **既定は静的**。`client:*` を付けるのは、本当にブラウザで動く必要があるものだけ。
- **色は `src/styles/globals.css` の `@theme` にあるものだけ**。

## lint が落とさないもの

古い React の書き方・依存の向き・ファイル名は Biome と `astro check` が落とし、
理由はそのメッセージに出る。機械が判定できないのは次の 3 つで、これはレビューでしか止まらない。

- **`src/components/` にビジネスロジックを持ち込まない**。データ取得と整形はページの
  frontmatter か `features/` で行い、コンポーネントは props で受け取る。
- **island の中で `fetch` しない**。ビルド時に解決できない場合
  （コマンドパレットの検索インデックスなど）だけの例外。
- **`useMemo` / `useCallback` / `memo` を手で足さない**。まず本当に遅いのかを測る。

## .astro の扱い

Biome は `.astro` の**フロントマターしか見ない**。テンプレートは整形されず、しかも
テンプレートでしか使わない変数を未使用と誤検知する。そのため `biome.jsonc` の
`files.includes` で `.astro` を対象外にし、整形は Prettier（`prettier-plugin-astro`）、
型は `astro check` が受け持つ。

- **`.astro` には Biome のガードレールが効かない。** 層をまたぐ import や命名は
  レビューで担保する。ロジックを `.astro` に書かず `features/` に置くのは、
  テスト可能にするためであると同時に、lint を効かせるためでもある。
- `.astro` コンポーネントは `.ts` から re-export できない。利用側からパスを直接 import する
  （`./app-sidebar.astro`）。

## 変更後に通すもの

```sh
pnpm lint        # Biome + Prettier(.astro)。--write 相当は pnpm lint:fix
pnpm typecheck   # astro check
pnpm test        # vitest run
```
