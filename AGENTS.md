# AGENTS.md

## ブランチ

- 開発は `main` のみ。作業ブランチもフォークも作らず、`main` に直接コミットする。

## push 前

- push の前に必ず `pnpm ci:check` をローカルで通す。1 つでも落ちたら push しない。
- `pnpm ci:check` は lint → typecheck → test → build の順に走り、
  GitHub Actions の CI と同じ内容を再現する。
