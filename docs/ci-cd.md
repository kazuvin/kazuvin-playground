# CI/CD ガイド

## 概要

このプロジェクトでは GitHub Actions を使用して CI/CD パイプラインを構築しています。

## CI ワークフロー

### 実行タイミング

- `main` ブランチへの push
- `main` ブランチへの Pull Request

### ジョブ構成

CI ワークフローは以下の 3 つのジョブで構成されています：

#### 1. Lint and Type Check

コードの品質チェックを実行します。

```yaml
- Run lint: pnpm run lint
- Type check: pnpm run typecheck
```

**実行内容**:

- Biome による lint と整形チェック (`.ts` / `.tsx` / `.json` / `.css`)
- Prettier による整形チェック (`.astro`)
- `astro check` による型チェック (`.astro` を含む)

#### 2. Test

テストを実行します。

```yaml
- Install Playwright browsers
- Run tests: pnpm run test
```

**実行内容**:

- Unit テスト（Vitest）
- Storybook テスト（Playwright）

#### 3. Build

プロジェクトのビルドを実行します。

```yaml
- Build project: pnpm run build
- Upload build artifacts
```

**実行内容**:

- Astro のプロダクションビルド (静的サイトを `dist/` に出力)
- ビルド成果物を 7 日間保存

## ローカルで CI を実行する

### 前提条件

[act](https://github.com/nektos/act) をインストールする必要があります。

#### macOS (Homebrew)

```bash
brew install act
```

#### Windows (Chocolatey)

```bash
choco install act-cli
```

#### Linux

```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### 使い方

プロジェクトルートで以下のコマンドを実行します。

#### すべてのジョブを実行

```bash
act
```

#### 特定のジョブのみ実行

```bash
# Lint and Type Check のみ
act -j lint-and-typecheck

# Test のみ
act -j test

# Build のみ
act -j build
```

#### Pull Request イベントをシミュレート

```bash
act pull_request
```

#### 特定のワークフローファイルを指定

```bash
act -W .github/workflows/ci.yml
```

#### 詳細ログを表示

```bash
act -v
```

### act の設定

`.actrc` ファイルでデフォルトの設定を行っています：

```bash
# Use medium-sized Docker image for better compatibility
-P ubuntu-latest=catthehacker/ubuntu:act-latest

# Reuse Docker containers for faster runs
--reuse

# Bind workspace to avoid permission issues
--bind
```

**設定の説明**:

- `-P`: より互換性の高い Docker イメージを使用
- `--reuse`: Docker コンテナを再利用して実行速度を向上
- `--bind`: ワークスペースをバインドしてパーミッションエラーを回避

### トラブルシューティング

#### Docker が起動していない

```bash
# Docker Desktop を起動してください
```

#### 権限エラーが発生する

```bash
# Docker に十分な権限があることを確認
act --bind
```

#### ディスク容量不足

```bash
# 古い Docker イメージを削除
docker system prune -a
```

#### act が古いイメージを使用している

```bash
# イメージを更新
docker pull catthehacker/ubuntu:act-latest
```

## CI の高速化

### キャッシュの活用

GitHub Actions では pnpm のキャッシュを活用しています：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version-file: ".node-version"
    cache: "pnpm"
```

これにより、2 回目以降の実行で依存関係のインストールが高速になります。

Node のバージョンはローカルが `mise.toml`、CI が `.node-version` を見ます。
どちらかを上げるときは両方を揃えてください。

### 並列実行

3 つのジョブは並列で実行されるため、全体の実行時間が短縮されます。

## ローカル開発での CI チェック

CI を実行する前に、ローカルで以下のコマンドを実行して問題を事前に検出できます。

### 1. Lint

```bash
pnpm run lint
```

自動修正する場合：

```bash
pnpm run lint:fix
```

### 2. Type Check

```bash
pnpm run typecheck
```

### 3. Format

`pnpm run lint` に整形チェックが含まれています。自動整形する場合：

```bash
pnpm run format
```

### 4. Test

```bash
pnpm run test
```

### 5. Build

```bash
pnpm run build
```

### すべてを一度に実行

CI と同じチェックを通しで実行するスクリプトが `package.json` に定義済みです。

```json
{
  "scripts": {
    "ci:check": "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build"
  }
}
```

実行：

```bash
pnpm run ci:check
```

## CI 失敗時の対応

### Lint エラー

```bash
# エラーを確認
pnpm run lint

# 自動修正を試みる
pnpm run lint:fix

# 残ったエラーを手動で修正
```

### Type エラー

```bash
# エラーを確認
pnpm run typecheck

# 型定義を修正
# @ts-ignore は lint で禁止しているので、握り潰すときは
# @ts-expect-error に理由を添える
```

### Test エラー

```bash
# ローカルでテストを実行
pnpm run test

# 失敗したテストを修正
# 変更しながら確認する場合はウォッチで回す：
pnpm run test:watch
```

### Build エラー

```bash
# ローカルでビルドを実行
pnpm run build

# エラーを修正
# ビルドキャッシュをクリアする場合：
rm -rf dist .astro node_modules/.vite
pnpm run build
```

## ベストプラクティス

### 1. コミット前のチェックは自動で走る

lefthook が pre-commit で Biome (staged なファイルのみ)、Prettier (`.astro`)、
`astro check` を実行し、commit-msg で commitlint が Conventional Commits を検証します。
`pnpm install` 時に `prepare` スクリプトからフックが同期されます。

手動で通したい場合：

```bash
pnpm run lint
pnpm run typecheck
```

### 2. PR 作成前にローカル CI を実行

```bash
# act でローカル CI を実行
act
```

### 3. エディタの設定

VS Code や WebStorm などのエディタで、保存時に自動整形や lint を実行するように設定すると便利です。

#### VS Code の設定例 (.vscode/settings.json)

`.vscode/settings.json` に設定済みです。`.astro` だけ Prettier に渡している点に注意
してください (Biome はテンプレートを扱えないため)。

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit"
  },
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## CI ワークフローのカスタマイズ

### 新しいジョブを追加

`.github/workflows/ci.yml` にジョブを追加できます：

```yaml
jobs:
  security-check:
    name: Security Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm audit
```

### 特定のファイル変更時のみ実行

```yaml
on:
  push:
    paths:
      - "src/**"
      - "content/**"
```

### マトリックスビルド

複数の Node.js バージョンでテストする場合 (`package.json` の `engines` を
下回るバージョンは対象にできません):

```yaml
strategy:
  matrix:
    node-version: [24]
```

## 参考リンク

- [GitHub Actions 公式ドキュメント](https://docs.github.com/en/actions)
- [act (ローカル CI ツール)](https://github.com/nektos/act)
- [pnpm + GitHub Actions](https://pnpm.io/continuous-integration#github-actions)

## まとめ

- CI は GitHub Actions で自動実行される
- ローカルでは `act` を使って CI をテストできる
- コミット前のチェックは lefthook が自動で走らせる (`pnpm run lint` / `pnpm run typecheck` を手動で通してもよい)
- PR 作成前に `act` でローカル CI を実行して問題を事前に検出
