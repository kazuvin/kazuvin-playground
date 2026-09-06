# Agentation

画面を見て気づいたことを、そのまま Claude Code に渡すための仕組み。

「サイドバーの青いボタン」と言葉で説明する代わりに、その要素をクリックしてコメントを書く。
[Agentation](https://agentation.com) がセレクタ・クラス名・周辺のテキスト・位置を添えてくれるので、
エージェントは `grep` で該当のコードに直行できる。

## 使い方

```bash
pnpm dev          # http://localhost:4321
```

右下にツールバーが出る。クリックして有効にすると、ページ上の要素を選んでコメントを書ける。
テキスト選択・複数選択・範囲選択のほか、アニメーションを止めて途中の状態を指すこともできる。

書いた指摘のエージェントへの渡し方は 2 通りある。

| 渡し方 | 手順 | MCP サーバー |
| --- | --- | --- |
| コピー | ツールバーの copy で markdown を取り、チャットに貼る | 不要 |
| MCP | 指摘を書くだけ。エージェント側から読む | 必要 |

MCP を使う場合は、Claude Code に「Agentation の指摘を見て」と頼めばよい。
`agentation_get_all_pending` で未処理の指摘が読める。

## MCP の構成

`.mcp.json` に `agentation-mcp` を登録してある。Claude Code はセッション開始時にこれを
stdio で起動し、そのプロセスが 2 つの口を開ける。

```
ブラウザのツールバー ──HTTP :4747──> agentation-mcp ──stdio(MCP)──> Claude Code
```

- **HTTP (:4747)** — ツールバーが指摘を投げる先。`src/components/dev/agentation-toolbar.tsx`
  の `ENDPOINT` がこのポートを指している
- **MCP (stdio)** — エージェントが指摘を読み書きするための口

つまり **MCP サーバーは Claude Code が起きている間だけ動く**。`pnpm dev` だけを起動している
ときはツールバーが接続先を見つけられず、指摘は localStorage に残る (コピーでの受け渡しは
そのまま使える)。手で常駐させたいときは `npx agentation-mcp server` を別のシェルで動かす。
ポートが埋まっていれば HTTP は諦めて MCP だけが立つので、二重起動しても壊れない。

エージェントに公開されるツールは 9 つ。

| ツール | 用途 |
| --- | --- |
| `agentation_list_sessions` | セッション (ページ単位) の一覧 |
| `agentation_get_session` | セッションと、そこに付いた指摘を取る |
| `agentation_get_pending` | そのセッションの未処理の指摘 |
| `agentation_get_all_pending` | 全セッションの未処理の指摘 |
| `agentation_acknowledge` | 読んだことを記す |
| `agentation_resolve` | 対応したことを、要約を添えて記す |
| `agentation_dismiss` | 理由を添えて見送る |
| `agentation_reply` | 指摘のスレッドに返信する |
| `agentation_watch_annotations` | 新しい指摘が来るまで待ち、まとめて受け取る |

`agentation_watch_annotations` はブロックして待つので、「指摘を書く → 直る」を
繰り返す使い方ができる。エージェントに「watch モードで」と頼むと、
acknowledge → 修正 → resolve のループに入る。

## 本番には出ない

ツールバーは `src/layouts/base-layout.astro` の `<script>` から、
`import.meta.env.DEV` の枝の中で dynamic import している。本番ビルドでは Vite が
`DEV` を `false` に畳み、枝ごと消えるので、チャンク自体が生まれない。

island (`client:only="react"`) で書くとこうはならない。テンプレート側を
`import.meta.env.DEV` で切ってもビルドはチャンクを吐き、どこからも参照されない 412KB が
`dist/` に残って、そのまま Cloudflare に上がる。**dev 専用のものを island にしない**のは
そのため。

## 更新するとき

- ポートを変える → `agentation-mcp server --port` と `agentation-toolbar.tsx` の
  `ENDPOINT` の両方
- 指摘の保存先 → 既定は `~/.agentation/store.db` (SQLite)。リポジトリの中には置かれない
