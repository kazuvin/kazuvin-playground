# kazuvin-playground

MDX で書いたノートを静的サイトとして配信する個人サイト。
[Next.js](https://nextjs.org) の App Router を Static Export (`output: "export"`) で
静的生成し、Cloudflare の静的アセットとして配信している。

## 技術スタック

| 領域             | 採用                                                                             |
| ---------------- | -------------------------------------------------------------------------------- |
| フレームワーク   | Next.js App Router (Static Export)                                               |
| UI               | React 19 (Server Component 既定 + 必要な箇所だけ Client) + Tailwind CSS v4       |
| デザインシステム | Kotoba Design System (`src/styles/globals.css` / `docs/kotoba-design-system.md`) |
| コンテンツ       | MDX (`content/notes`) + zod で frontmatter を検証                                |
| テスト           | Vitest (unit) + Storybook のブラウザテスト                                       |
| lint / format    | Biome (1 ファイルで全部を見る)                                                   |
| 配信             | Cloudflare Workers 静的アセット (`wrangler.jsonc`)                               |
| エージェント連携 | Agentation + MCP (`.mcp.json` / `docs/agentation.md`)                            |

サーバーは持たない。`output: "export"` はビルド時にすべての HTML を書き出すので、
SSR / ISR / Middleware / 画像最適化 API のような「実行時のサーバー」に依存する機能は
使えない。代わりに成果物がただの静的ファイルになり、そのまま Cloudflare に載る。

一方でページ遷移はクライアント側で行われる。リンクを踏んでも文書は作り直されず、
差し替わるのは `<main>` と右レールだけで、左レール (ロゴ・ナビ・検索) は描かれたまま
残る。MPA のように「次の文書ができるまで白が出る」遷移中のちらつきが構造的に起きない
のはこのため。その代わり、React とルーターぶんの JS (gzip 約 165KB) が初回に落ちてくる。

## 開発

Node と pnpm のバージョンは `mise.toml` に固定してある。

```bash
mise install      # 任意。Node 24 / pnpm 11 を揃える
pnpm install      # lefthook のフックもここで入る
pnpm dev:up       # 開発に要るものをまとめて起こす
```

`pnpm dev:up` は dev サーバー (http://localhost:3000) と
[Agentation](docs/agentation.md) のサーバー (:4747) を両方バックグラウンドで起こす。
止めるのは `pnpm dev:down`、ログは `tail -f .next/dev.log`。
dev サーバーだけを手元のターミナルに出したいときは `pnpm dev`。

画面の右下には Agentation のツールバーが出る。直したい箇所をクリックしてコメントを
書くと、セレクタや位置を添えた指摘として Claude Code に渡せる。本番のバンドルには
入らない。

| コマンド          | 内容                                                  |
| ----------------- | ----------------------------------------------------- |
| `pnpm dev`        | 開発サーバーを起動                                    |
| `pnpm dev:up`     | 開発サーバー + Agentation をまとめて起動              |
| `pnpm dev:down`   | 上で起こしたものを止める                              |
| `pnpm build`      | `out/` に静的サイトを出力                             |
| `pnpm preview`    | ビルドして Cloudflare と同じ条件で配信                |
| `pnpm typecheck`  | 型チェック (`tsc --noEmit`)                           |
| `pnpm lint`       | Biome のチェック                                      |
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

- **層の境界**: 依存は `共有層 → features → app / layouts` の一方向。
  `noRestrictedImports` を層ごとの `overrides` で設定している
- **barrel の禁止**: `index.ts` の再エクスポートは置かない。knip が export 単位で
  未使用を検出できなくなるため
- **kebab-case**: ファイル名はコンポーネントも含めてすべて kebab-case。
  App Router の規約ファイル (`page.tsx` / `[slug]`) だけは `src/app/**` で外している
- **モダン React**: `import * as React` / `forwardRef` / `FC` などを禁止
- **Node のビルトイン**: ブラウザに降りうるコードでは禁止。許すのは
  「ビルド時にしか動かない」と名指ししたファイルだけ (`src/app/**` と content を読む 2 つ)
- **日付**: 生の `new Date()` は GritQL プラグイン (`no-raw-date.grit`) が落とす。
  組み立ては `src/lib/date.ts` に閉じる
- **commit 時**: lefthook が Biome / `tsc` / commitlint を走らせる

詳細は [コーディング規約](docs/coding-standards.md) を参照。

## ノートを書く

`content/notes/` に `.mdx` を追加する。frontmatter のスキーマは
`src/features/notes/notes.ts` で定義されており、ビルド時に検証される。

```mdx
---
title: "ノートのタイトル"
date: "2025-11-03"
description: "一覧とコマンドパレットに出る説明"
tags: ["nextjs", "mdx"]
draft: false
---

本文。
```

`date` は必ず引用符で囲む。囲まないと YAML が日付型として読んでしまい、スキーマが
ビルド時に落とす。`draft: true` のノートはビルド出力にも検索インデックスにも含まれない。

## デプロイ

```bash
pnpm preview   # ビルドしてローカルで配信を確認 (_headers も効く)
pnpm deploy    # next build && wrangler deploy
```

Worker スクリプトは持たず、`out/` を静的アセットとして配信するだけの構成
(`wrangler.jsonc`)。長いキャッシュを当てるのは `_next/static/*` だけで、そこには
JS / CSS のチャンクと `src/assets/` から import した画像が入る (`public/_headers`)。

## ドキュメント

- [ディレクトリ構成](docs/directory-structure.md) — 層の境界と置き場所
- [コーディング規約](docs/coding-standards.md) — 命名・import・lint の決めごと
- [Kotoba Design System](docs/kotoba-design-system.md)
- [テスト](docs/testing.md)
- [CI/CD](docs/ci-cd.md)
- [Agentation](docs/agentation.md) — 画面の指摘をエージェントに渡す (MCP)
