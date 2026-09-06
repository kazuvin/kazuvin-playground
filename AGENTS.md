# AGENTS.md

## ブランチ

- 開発は `main` のみ。作業ブランチもフォークも作らず、`main` に直接コミットする。

## push 前

- push の前に必ず `pnpm ci:check` をローカルで通す。1 つでも落ちたら push しない。
- `pnpm ci:check` は lint → typecheck → test → build の順に走り、
  GitHub Actions の CI と同じ内容を再現する。

## 画面への指摘

`pnpm dev` の右下に出る Agentation のツールバーで書かれた指摘は、MCP 経由で読める。
「Agentation の指摘を見て」と言われたら `agentation_get_all_pending` を呼ぶ。
対応したら `agentation_resolve` に要約を添えて閉じる。詳細は `docs/agentation.md`。
