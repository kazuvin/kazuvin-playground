# kazuvin-playground

MDX で書いたノートを静的サイトとして配信する個人サイト。
[Astro](https://astro.build) で静的生成し、Cloudflare の静的アセットとして配信している。

## 技術スタック

| 領域             | 採用                                                                             |
| ---------------- | -------------------------------------------------------------------------------- |
| フレームワーク   | Astro (静的出力)                                                                 |
| UI               | React (island としてのみ hydrate) + Tailwind CSS v4                              |
| デザインシステム | Kotoba Design System (`src/styles/globals.css` / `docs/kotoba-design-system.md`) |
| コンテンツ       | MDX + Content Collections (`content/notes`)                                      |
| テスト           | Vitest (unit) + Storybook のブラウザテスト                                       |
| lint / format    | Biome (`.astro` の整形のみ Prettier)                                             |
| 配信             | Cloudflare Workers 静的アセット (`wrangler.jsonc`)                               |
| エージェント連携 | Agentation + MCP (`.mcp.json` / `docs/agentation.md`)                            |

## 開発

Node と pnpm のバージョンは `mise.toml` に固定してある。

```bash
mise install      # 任意。Node 24 / pnpm 10 を揃える
pnpm install      # lefthook のフックもここで入る
pnpm dev          # http://localhost:4321
```

`pnpm dev` の画面には右下に [Agentation](docs/agentation.md) のツールバーが出る。
直したい箇所をクリックしてコメントを書くと、セレクタや位置を添えた指摘として
Claude Code に渡せる。本番のバンドルには入らない。

| コマンド          | 内容                                                  |
| ----------------- | ----------------------------------------------------- |
| `pnpm dev`        | 開発サーバーを起動                                    |
| `pnpm build`      | `dist/` に静的サイトを出力                            |
| `pnpm preview`    | ビルド結果をローカルで配信                            |
| `pnpm typecheck`  | 型チェック (`astro check`)                            |
| `pnpm lint`       | Biome + Prettier (`.astro`) のチェック                |
| `pnpm lint:fix`   | 同上を自動修正                                        |
| `pnpm format`     | 整形のみ実行                                          |
| `pnpm test`       | テストを 1 回実行                                     |
| `pnpm test:watch` | テストをウォッチ実行                                  |
| `pnpm knip`       | 未使用のファイル・export・依存を検出                  |
| `pnpm storybook`  | Storybook を起動 (http://localhost:6006)              |
| `pnpm ci:check`   | lint → 型チェック → テスト → ビルドを通しで実行       |

## ガードレール

設計上の決めごとは lint で機械的に落としている。設定は `biome.jsonc` の 1 ファイルに集約
してあり、ルールごとに「なぜそうするか」をコメントで書いてある。

- **層の境界**: 依存は `共有層 → features → pages / layouts` の一方向。
  `noRestrictedImports` を層ごとの `overrides` で設定している
- **barrel の禁止**: `index.ts` の再エクスポートは置かない。knip が export 単位で
  未使用を検出できなくなるため
- **kebab-case**: ファイル名はコンポーネントも含めてすべて kebab-case
- **モダン React**: `import * as React` / `forwardRef` / `FC` などを禁止
- **日付**: 生の `new Date()` は GritQL プラグイン (`no-raw-date.grit`) が落とす。
  組み立ては `src/lib/date.ts` に閉じる
- **commit 時**: lefthook が Biome / Prettier / `astro check` / commitlint を走らせる

`.astro` は Biome がフロントマターしか扱えないため lint の対象外で、整形は Prettier、
型は `astro check` が受け持つ。**`.astro` にはガードレールが効かない**ので、ロジックは
`features/` に置く。詳細は [コーディング規約](docs/coding-standards.md) を参照。

## ノートを書く

`content/notes/` に `.mdx` を追加する。frontmatter のスキーマは
`src/content.config.ts` で定義されており、ビルド時に検証される。

```mdx
---
title: "ノートのタイトル"
date: "2025-11-03"
description: "一覧とコマンドパレットに出る説明"
tags: ["astro", "mdx"]
draft: false
---

本文。
```

`draft: true` のノートはビルド出力にも検索インデックスにも含まれない。

## デプロイ

```bash
pnpm exec wrangler dev   # ローカルで配信を確認
pnpm deploy              # astro build && wrangler deploy
```

Worker スクリプトは持たず、`dist/` を静的アセットとして配信するだけの構成
(`wrangler.jsonc`)。

## ドキュメント

- [ディレクトリ構成](docs/directory-structure.md) — 層の境界と置き場所
- [コーディング規約](docs/coding-standards.md) — 命名・import・lint の決めごと
- [Kotoba Design System](docs/kotoba-design-system.md)
- [テスト](docs/testing.md)
- [CI/CD](docs/ci-cd.md)
- [Agentation](docs/agentation.md) — 画面の指摘をエージェントに渡す (MCP)
