# Kotoba Design System

言語学習モバイルアプリ (React Native) 向けのデザインシステム。
claude.ai/design のプロジェクト **"Kotoba Design System"** からこのリポジトリに取り込んだもの。

- 出典: https://claude.ai/design/p/92cf75bb-e4dd-49ec-aca3-9b5bdb437b3c
- _Kotoba_ (ことば) は**プレースホルダ名**。ブランド・ロゴ・Figma ファイルは未提供で、
  すべて 1 通のブリーフから導出されている。実名が決まったらリネームする。

トークン層は `src/styles/globals.css`、コンポーネントは `src/components/ui/{button,text,screen}.tsx` にある
(クラス定義は各ファイル内の private な定数)。

---

## 壊してはいけない 2 つの制約

この 2 つは事故で壊しやすく、壊すとデザインシステムとして成立しなくなる。

1. **プライマリアクションの面は黒** (`--color-gray-900`)。アクセントカラーではない。
2. **アクセント (`rgb(60,130,247)`) はフォーカスリングと選択状態にのみ使う。**
   塗り・ステータス・装飾には一切使わない。1 画面あたりの塗り面積は「線」の量に収まる。

赤いエラー・緑の成功といった**セマンティックカラーは存在しない**。
ブリーフが色によるステータス表現を禁じているため、失敗状態は「言葉と位置」で表す。
状態を色だけで伝えることはしない (選択状態は 枠線 + ティント + `✓` の 3 つで冗長化されている)。

---

## トークン表

### semanticColor

ニュートラルランプ 11 段がすべての面・境界・テキスト、**そしてプライマリアクションの塗り**を担う。
色相は 1 つだけ。

| 役割                    | Tailwind キー                    | 値                    | 元トークン                            |
| ----------------------- | -------------------------------- | --------------------- | ------------------------------------- |
| 画面背景                | `background`                     | `#FFFFFF`             | `--color-bg-screen`                   |
| 本文テキスト            | `foreground`                     | `#16161A`             | `--color-text-primary`                |
| カード面                | `card` / `popover`               | `#FFFFFF`             | `--color-bg-raised`                   |
| 唯一のティント          | `muted` / `subtle`               | `#F4F4F6`             | `--color-bg-subtle`                   |
| 二次テキスト            | `subtle-foreground`              | `#56565E`             | `--color-text-secondary`              |
| 三次テキスト            | `muted-foreground`               | `#74747C`             | `--color-text-tertiary`               |
| 反転面                  | `inverse` / `inverse-foreground` | `#16161A` / `#FFFFFF` | `--color-bg-inverse`                  |
| **プライマリ塗り (黒)** | `primary`                        | `#16161A`             | `--color-action-primary-bg`           |
| プライマリラベル        | `primary-foreground`             | `#FFFFFF`             | `--color-action-primary-label`        |
| プライマリ押下          | `primary-pressed`                | `#2C2C31`             | `--color-action-primary-bg-pressed`   |
| セカンダリ面            | `secondary`                      | `#F4F4F6`             | `--color-action-secondary-bg-pressed` |
| ヘアライン              | `border-hairline`                | `#EBEBEE`             | `--color-border-hairline`             |
| 標準境界                | `border`                         | `#DEDEE3`             | `--color-border-default`              |
| 強い境界                | `border-strong` / `input`        | `#C3C3CB`             | `--color-border-strong`               |
| 無効面                  | `disabled`                       | `#EBEBEE`             | `--color-action-disabled-bg`          |
| 無効ラベル              | `disabled-foreground`            | `#9A9AA3`             | `--color-action-disabled-label`       |
| **アクセント**          | `accent`                         | `rgb(60,130,247)`     | `--accent-500`                        |
| フォーカスリング        | `ring`                           | = `accent`            | `--color-focus-ring`                  |
| 選択ティント            | `selected`                       | `#EFF5FE`             | `--color-selected-bg`                 |
| 選択枠線                | `selected-border`                | = `accent`            | `--color-selected-border`             |

ニュートラルランプは `gray-0 / 25 / 50 / 100 / 200 / 300 / 400 / 500 / 600 / 800 / 900` の 11 段。
Tailwind 標準の `gray` は `--color-gray-*: initial` で消してあるので、`gray-700` や `gray-950`
といった**システム外の灰色は書いても効かない**。

**エレベーションは存在しない。** 影のシステムはなく、分離は 1px のヘアラインか余白で行う。
透過・ブラーも使わない (薄い文字はアルファではなく濃いグレーの不透明で表現し、コントラストを計測可能に保つ)。

### typography

Latin は `Source Sans 3`、CJK は `Noto Sans JP`。`src/layouts/base-layout.astro` で
`@fontsource-variable/*` により self-host。Fontsource は可変フォントを
`"Source Sans 3 Variable"` のような別名で登録するため、トークンの family 名は静的版と
互換ではない。
7 つの role が**コンテンツ / クローム**の 2 群に分かれる。

| role         | size | line | tracking | weight | 群         | 既定タグ |
| ------------ | ---- | ---- | -------- | ------ | ---------- | -------- |
| `expression` | 24   | 32   | -0.2     | 600    | コンテンツ | `h1`     |
| `reading`    | 20   | 28   | -0.2     | 600    | コンテンツ | `h2`     |
| `gloss`      | 17   | 24   | 0        | 400    | コンテンツ | `p`      |
| `body`       | 15   | 22   | 0        | 400    | コンテンツ | `p`      |
| `label`      | 14   | 18   | 0.2      | 600    | クローム   | `span`   |
| `support`    | 12   | 16   | 0.1      | 400    | クローム   | `p`      |
| `overline`   | 11   | 14   | 0.8      | 600    | クローム   | `p`      |

- **コンテンツ role は 15px が下限で、レイアウトを収めるために縮めない。**
  学習素材が画面の主題であり、収まらないならスクロールさせる。密度は余白で作る。
- `support` と `overline` だけが 14px 未満を許される。
- line-height と letter-spacing は全 role で絶対値の px (React Native 向けに `em` / `%` は使わない)。
- 大文字は `overline` のみ。それ以外はボタンを含めすべてセンテンスケース。

### spacing

基本単位 **4px**。出荷される値はすべて `4 × n`。

| tier | 用途                             | Tailwind キー | px  |
| ---- | -------------------------------- | ------------- | --- |
| 1    | 画面端 (左右)                    | `edge-h`      | 24  |
| 1    | 画面端 (上)                      | `edge-top`    | 32  |
| 1    | 画面端 (下)                      | `edge-bottom` | 24  |
| 2    | ブロック間                       | `block`       | 32  |
| 2    | アクション群の前                 | `block-loose` | 48  |
| 2    | 1 つの考えの 2 行                | `block-tight` | 20  |
| 3    | コントロール内 padding x         | `inset-x`     | 20  |
| 3    | コントロール内 padding y         | `inset-y`     | 12  |
| 3    | アイコン↔ラベル、ボタン↔ボタン | `gap`         | 8   |
| 3    | バッジオフセット                 | `gap-tight`   | 4   |

**tier の順序がルール**: ブロック間 (32) > 画面端 (24) > 要素内 (≤20)。
上の値だけが許可された値で、それ以外は使わない。

- tier 1 は `Screen` の専有。他のどこでも画面端 padding を宣言しない。
- tier 2 は兄弟要素間のスペーサー。
- tier 3 はコンポーネントの内側にあり、margin として外に漏れない。

タップ形状 — **視覚的な箱とタップ領域は別トークン**。ラベルサイズを変えても箱は動かない。

| キー         | px  | 用途                               |
| ------------ | --- | ---------------------------------- |
| `tap-min`    | 44  | 最小タップ領域                     |
| `control`    | 40  | 既定ボタンの視覚高                 |
| `control-lg` | 52  | large ボタンの視覚高               |
| `hitslop`    | 2   | 40 の箱を 44 に広げる透明帯 (上下) |

### radius

| キー             | px  | 用途                                  |
| ---------------- | --- | ------------------------------------- |
| `control` (`md`) | 12  | ボタン等のコントロール                |
| `card` (`lg`)    | 16  | カード                                |
| `focus`          | 14  | フォーカスリング (control + offset 2) |
| `chip`           | 999 | ピル                                  |
| `sm`             | 8   | —                                     |

これ以外の値は使わない。

### motion

120ms / `cubic-bezier(0.2, 0, 0.2, 1)` (`ease-standard`)、**color と opacity のみ**。
バウンス・スプリング・スケールイン・ページトランジションは無い。
押下は暗い塗りへの差し替えであって、縮小でもフェードでもない。
意味の開示はアニメーションではなく即時のレイアウト変更 — 学習者は読んでいる最中で、
文字の下で動きが起きるのはコストだから。

---

## コンポーネント

### `Button`

画面のアクションコントロール。**1 画面に primary は 1 つ**、他はすべて secondary。

```tsx
<Button variant="primary" size="large" fullWidth onClick={reveal}>Show meaning</Button>
<Button variant="secondary" fullWidth onClick={skip}>Skip for now</Button>
<Button variant="secondary" selected onClick={pick}>Formal register</Button>
```

| prop        | 値                            | 既定      |
| ----------- | ----------------------------- | --------- |
| `variant`   | `primary` / `secondary`       | `primary` |
| `size`      | `default` (40) / `large` (52) | `default` |
| `disabled`  | boolean                       | `false`   |
| `selected`  | boolean (secondary 専用)      | `false`   |
| `fullWidth` | boolean                       | `false`   |

- `size="default"` は 40px の箱を描き、タップ領域を 2px ずつ広げて 44 にする。
  `size="large"` は 52px でスロップ不要。**箱を 40 未満に縮めない。**
- `selected` は必ず `✓` グリフを伴う。状態を色だけで伝えないため。
- `disabled` はグレー塗りに落とすが、**ラベルの文言は変えない** (何をする物か読めるまま残す)。
- **第 3 の variant は無い。** secondary より静かに見せたいものはボタンではなく、
  本文テキスト + リンク。

DOM は 2 層になっている。外側の `<button>` がタップ領域とフォーカスリングを持ち、
内側の `<span>` が視覚的な箱を描く。これが React Native の `hitSlop` の web での対応物。

### `Text`

画面上のすべてのコピー。role が typography トークン一式を選ぶ。

```tsx
<Text role="overline">Unit 4 · Requests</Text>
<Text role="expression" lang="ja">お願いできますか</Text>
<Text role="gloss">Could I ask you a favour?</Text>
<Text role="support">Tap the phrase to hear it again</Text>
```

- 色は role が決める。`className` で上書きする場合も `--color-text-*` 相当の
  セマンティックキー (`text-muted-foreground` 等) を使い、生の hex は書かない。
- `as` で既定タグを上書きできる。
- 学習コンテンツ (expression / reading / gloss) は**引用素材**であり、
  切り詰め・省略記号・略記は禁止。

### `Screen`

tier-1 の画面端スペーシング (24 / 32 / 24) を供給するシェル。

```tsx
<Screen>
  <Text role="overline">Unit 4</Text>
  <div className="h-block" />
  <Text role="expression" lang="ja">
    お願いできますか
  </Text>
</Screen>
```

`width` は既定 390 (設計時のビューポート幅)。子はシェルと喧嘩する margin を足さない。

---

## コンテンツの書き方

**声**: 二人称・現在形・感嘆符なし。アプリは自分自身ではなく言語の話をする。
読み手は作業の途中で、少し急いでいる学習者。

- ボタンラベルは動詞始まりの 1〜3 語 — "Show meaning" / "Got it" / "Practice again"。
- 補助テキストは仕組みを述べる。気分は述べない。
  ○ "Tap the phrase to hear it again" / ✕ "Great work, keep going!"
- 用法注記は事実ベースで語域を意識する。近い形との比較が標準の型。
  "Softer than 〜してください. Safe with people you have just met."
- **ゲーミフィケーション語彙を使わない** — streak / XP / レベル / 祝辞。"Oops" も "Nice!" も無し。
- **絵文字は使わない。** システム内の非アルファベット記号は選択状態に付く `✓` (U+2713) だけ。
- ケーシングはセンテンスケース (ボタンも)。例外は `overline` のみ。
- 中黒 `·` はメタデータの区切り ("Unit 4 · Requests")。カウンタは裸で空けて "1 / 2"。
  目標言語のテキストはネイティブの約物 (？ 。) をそのまま保つ。

## アイコン

**アイコンセットは無い。** ブリーフの 1 画面には不要だったので作っていない。
使っている唯一のグリフは選択状態の `✓` で、これはアイコンではなくテキスト。

将来必要になったら **Lucide** (24px グリッド / 2px ストローク / ラウンドキャップ) を推奨。
このシステムのヘアライン太さと 12px のコントロール半径に合う。
その際はサイズと色をトークン化したままにするため `Icon` ラッパーを追加すること。

---

## このリポジトリに取り込むにあたっての判断

元プロジェクトは React Native 前提の JSX + 素の CSS。ここでは Astro + React + Tailwind v4 + TSX
に移植し、既存の `src/components/ui/` に統合した。以下は 1:1 ではない箇所。

### 意図的な差分

| 項目                    | 元                            | ここ                                                         | 理由                                                                               |
| ----------------------- | ----------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| フォント配信            | Google Fonts CDN の `@import` | `@fontsource-variable/*` で self-host                        | レイアウトシフトとサードパーティ接続を避ける                                       |
| `accent` の意味         | 唯一の色相                    | 同左                                                         | shadcn 系の `bg-accent` (ホバー面) とは非互換。既存 5 箇所は `bg-muted` に移行済み |
| `destructive`           | 存在しない                    | `primary` と同じ黒にマップ                                   | 既存の `bg-destructive` を壊さず、かつ色でステータスを伝えない                     |
| `chart-1`〜`chart-5`    | 存在しない                    | 削除                                                         | 未使用で、チャートパレットはこのシステムに無い                                     |
| Tailwind `gray`         | —                             | `initial` で消してから 11 段を定義                           | システム外の灰色を書けなくする                                                     |
| `Typography`(`variant`) | `Text`(`role`)                | `Text`(`role`) に置換                                        | 元のコンポーネント名と API に合わせた                                              |
| `Button` の variant     | —                             | `outline`/`ghost`/`link`/`destructive` と `sm`/`icon` を削除 | 「第 3 の variant は無い」ルール                                                   |

`Typography` からの移行対応:
`variant="h1"` → `role="expression"` / `variant="p"` → `role="body"` / `variant="small"` → `role="support"`

### `cn` の拡張 (`src/lib/cn.ts`)

クラス結合と競合解決は shadcn の [`cn`](https://github.com/shadcn-ui/cn) を使う
(`clsx` + `tailwind-merge` のドロップイン後継。両方を 1 パッケージに統合している)。

Kotoba の 7 role は `text-` プレフィックスを font-size として使う。`cn` の既定設定は
標準スケールしか知らないため、素のままだと `text-label` を**テキスト色**と誤判定し、
後続の色クラスで黙って捨ててしまう (ボタンが継承フォントサイズで描画される)。
`cn/config` の `createCn` で 7 role を `font-size` グループに登録して回避している。
`src/lib/cn.test.ts` に回帰テストあり。

### 未対応 / 既知の不整合

以下は今回のスコープ外。Kotoba のルールと衝突したまま残っている。

- `card` / `dialog` / `timeline` / `command` が影 (`shadow-*`) を使っている。
  Kotoba にエレベーションは無い (分離はヘアラインか余白)。
- `dialog` / `command` が `scale-in` / `scale-out` アニメーションを使っている。
  Kotoba のモーションは color と opacity のみ。
- `note-card.tsx` に `dark:` クラスが残っている。Kotoba にダークモードは無く、
  ダークテーマの切り替え機構もこのリポジトリには無いので現状は無害。
- `not-found.tsx` と `note-card.tsx` が `text-2xl` を直接使っている。
  Kotoba の 7 role の外にあるサイズなので、本来は `<Text role="expression">` に寄せたい。
