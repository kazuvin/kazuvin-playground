#!/bin/sh
#
# 開発に要るものをまとめて起こす / 落とす。
#
#   :4321  Astro の dev サーバー     画面そのもの
#   :4747  Agentation のサーバー     ツールバーが指摘を投げる先 (docs/agentation.md)
#
# どちらも二重には起こさない。Agentation のサーバーは Claude Code も .mcp.json
# 経由で起こすので、まず /health に応答があるかを見る。落とすときに殺すのは
# このスクリプトが起こしたものだけで、pid は .astro/ に控える (Astro 自身が
# dev.json / dev.log を置くのと同じ場所。.astro/ は gitignore 済み)。

set -eu

cd "$(dirname "$0")/.."
# 直接叩かれても node_modules/.bin を引けるようにする (pnpm run 経由なら既に通っている)
PATH="$PWD/node_modules/.bin:$PATH"

PORT=4747
PID_FILE=.astro/agentation.pid
LOG_FILE=.astro/agentation.log

agentation_is_up() {
  curl -sf -m 2 "http://localhost:$PORT/health" > /dev/null 2>&1
}

# 自分で起こした Agentation が今も生きていれば、その pid を返す
agentation_own_pid() {
  [ -f "$PID_FILE" ] || return 1
  pid=$(cat "$PID_FILE")
  kill -0 "$pid" 2> /dev/null || return 1
  echo "$pid"
}

up() {
  astro dev --background

  if agentation_is_up; then
    echo "Agentation already running at http://localhost:$PORT"
  else
    # nohup + stdin を切る。MCP の口は stdio だが、ここでは HTTP しか使わない
    nohup agentation-mcp server > "$LOG_FILE" 2>&1 < /dev/null &
    echo $! > "$PID_FILE"
    echo "Agentation server started at http://localhost:$PORT (log: $LOG_FILE)"
  fi

  echo
  echo "  logs   pnpm exec astro dev logs --follow"
  echo "  stop   pnpm dev:down"
}

down() {
  astro dev stop

  if pid=$(agentation_own_pid); then
    kill "$pid"
    rm -f "$PID_FILE"
    echo "Agentation server stopped"
  elif agentation_is_up; then
    # Claude Code が .mcp.json 経由で起こしたもの。自分の持ち物でなければ触らない
    rm -f "$PID_FILE"
    echo "Agentation server is running but was not started here — left as is"
  else
    rm -f "$PID_FILE"
    echo "Agentation server is not running"
  fi
}

case "${1:-up}" in
  up) up ;;
  down) down ;;
  *)
    echo "usage: $0 [up|down]" >&2
    exit 1
    ;;
esac
