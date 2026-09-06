#!/bin/sh
#
# 開発に要るものをまとめて起こす / 落とす。
#
#   :3000  Next.js の dev サーバー     画面そのもの
#   :4747  Agentation のサーバー       ツールバーが指摘を投げる先 (docs/agentation.md)
#
# どちらも二重には起こさない。Agentation のサーバーは Claude Code も .mcp.json
# 経由で起こすので、まず /health に応答があるかを見る。落とすときに殺すのは
# このスクリプトが起こしたものだけで、pid は .next/ に控える (.next/ は gitignore 済み)。

set -eu

cd "$(dirname "$0")/.."
# 直接叩かれても node_modules/.bin を引けるようにする (pnpm run 経由なら既に通っている)
PATH="$PWD/node_modules/.bin:$PATH"

NEXT_PORT=3000
AGENTATION_PORT=4747
STATE_DIR=.next
NEXT_PID_FILE="$STATE_DIR/dev.pid"
NEXT_LOG_FILE="$STATE_DIR/dev.log"
AGENTATION_PID_FILE="$STATE_DIR/agentation.pid"
AGENTATION_LOG_FILE="$STATE_DIR/agentation.log"

mkdir -p "$STATE_DIR"

is_up() {
  curl -sf -m 2 "$1" > /dev/null 2>&1
}

# 自分で起こしたプロセスが今も生きていれば、その pid を返す
own_pid() {
  [ -f "$1" ] || return 1
  pid=$(cat "$1")
  kill -0 "$pid" 2> /dev/null || return 1
  echo "$pid"
}

up() {
  if own_pid "$NEXT_PID_FILE" > /dev/null; then
    echo "Next.js already running at http://localhost:$NEXT_PORT"
  else
    # nohup + stdin を切る。next dev は前面に居座るので、ここで背後に回す
    nohup next dev --port "$NEXT_PORT" > "$NEXT_LOG_FILE" 2>&1 < /dev/null &
    echo $! > "$NEXT_PID_FILE"
    echo "Next.js dev server started at http://localhost:$NEXT_PORT (log: $NEXT_LOG_FILE)"
  fi

  if is_up "http://localhost:$AGENTATION_PORT/health"; then
    echo "Agentation already running at http://localhost:$AGENTATION_PORT"
  else
    # MCP の口は stdio だが、ここでは HTTP しか使わない
    nohup agentation-mcp server > "$AGENTATION_LOG_FILE" 2>&1 < /dev/null &
    echo $! > "$AGENTATION_PID_FILE"
    echo "Agentation server started at http://localhost:$AGENTATION_PORT (log: $AGENTATION_LOG_FILE)"
  fi

  echo
  echo "  logs   tail -f $NEXT_LOG_FILE"
  echo "  stop   pnpm dev:down"
}

down() {
  if pid=$(own_pid "$NEXT_PID_FILE"); then
    kill "$pid"
    rm -f "$NEXT_PID_FILE"
    echo "Next.js dev server stopped"
  else
    rm -f "$NEXT_PID_FILE"
    echo "Next.js dev server is not running"
  fi

  if pid=$(own_pid "$AGENTATION_PID_FILE"); then
    kill "$pid"
    rm -f "$AGENTATION_PID_FILE"
    echo "Agentation server stopped"
  elif is_up "http://localhost:$AGENTATION_PORT/health"; then
    # Claude Code が .mcp.json 経由で起こしたもの。自分の持ち物でなければ触らない
    rm -f "$AGENTATION_PID_FILE"
    echo "Agentation server is running but was not started here — left as is"
  else
    rm -f "$AGENTATION_PID_FILE"
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
