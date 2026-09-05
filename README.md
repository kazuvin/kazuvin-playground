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
| 配信             | Cloudflare Workers 静的アセット (`wrangler.jsonc`)                               |

## 開発

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

| コマンド         | 内容                                            |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | 開発サーバーを起動                              |
| `pnpm build`     | `dist/` に静的サイトを出力                      |
| `pnpm preview`   | ビルド結果をローカルで配信                      |
| `pnpm check`     | 型チェック (`astro check`)                      |
| `pnpm lint`      | ESLint                                          |
| `pnpm test:run`  | テストを 1 回実行                               |
| `pnpm storybook` | Storybook を起動 (http://localhost:6006)        |
| `pnpm ci:check`  | lint → 型チェック → テスト → ビルドを通しで実行 |

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

- [ディレクトリ構成](docs/directory-structure.md)
- [Kotoba Design System](docs/kotoba-design-system.md)
- [テスト](docs/testing.md)
- [CI/CD](docs/ci-cd.md)
