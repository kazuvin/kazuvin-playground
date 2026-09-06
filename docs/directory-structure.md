# ディレクトリ構成

## 概要

このプロジェクトは Next.js の App Router を Static Export (`output: "export"`) で使っており、
以下の原則に基づいてディレクトリを構成しています。

- **コロケーション**: ドメイン固有のロジック (store, utils, types など) は使用する場所の近くで管理
- **プレゼンテーションとロジックの分離**: コンポーネントは UI に専念し、ロジックは features/hooks/stores で管理
- **ドメイン駆動設計**: コンポーネントをドメイン非依存/依存で分類
- **既定は Server Component**: ブラウザで動く必要があるものだけ `'use client'` を付け、境界は葉に寄せる
- **一方向の依存**: 共有層 → features → app / layouts。向きは Biome が lint で強制する

命名と import の書き方は [コーディング規約](coding-standards.md) にあります。

## ルートディレクトリ構成

```
kazuvin-playground/
├── src/                    # アプリケーションのソース
├── content/                # MDX などのコンテンツファイル (記事の実体)
├── public/                 # URL を固定したいものだけ (favicon / _headers。そのまま out/ にコピーされる)
├── docs/                   # プロジェクトドキュメント
├── .claude/rules/          # Claude Code 用のルール (frontmatter の paths で対象を絞る)
├── .mcp.json               # Claude Code が起動する MCP サーバー (Agentation)
├── next.config.ts          # Next.js の設定 (Static Export の宣言もここ)
├── postcss.config.mjs      # Tailwind v4 を Next のビルドに載せる口
├── biome.jsonc             # lint / format と層の境界の設定 (ガードレールの本体)
├── no-raw-date.grit        # Biome の GritQL プラグイン (生の Date を禁じる)
├── knip.jsonc              # 未使用ファイル・export・依存の検出
├── lefthook.yml            # commit 前に走るフック
├── mise.toml               # Node / pnpm のバージョン (単一の情報源)
└── wrangler.jsonc          # Cloudflare 配信の設定 (静的アセットのみ)
```

## src/ ディレクトリ構成

```
src/
├── app/                    # ルーティング (このディレクトリの構造がそのまま URL になる)
├── components/             # すべてのコンポーネント
│   ├── layouts/            # ページを包む外枠 (レール・grid・dev ツール)
│   ├── ui/                 # ドメインを知らない UI プリミティブ
│   └── dev/                # 開発時だけ動くもの
├── features/               # ドメイン固有のロジック (データ取得・変換・純粋関数)
├── hooks/                  # グローバルに使用するカスタムフック
├── stores/                 # アプリケーション全体で共有するグローバルステート
├── lib/                    # ドメイン非依存のユーティリティ・共通型
├── config/                 # アプリケーション設定
├── assets/                 # import して使う画像 (ハッシュ付きで out/_next/static/media/ に出る)
└── styles/
    ├── globals.css         # デザイントークンとグローバルスタイル
    └── fonts.ts            # next/font の宣言 (欧文の self-host)
```

`components/layouts/` は Next.js の規約ではなく、このプロジェクトの層の名前です。
`app/layout.tsx` は `<html>` と外枠の**呼び出し**だけを持ち、中身 (3 カラムの grid・
左右のレール) は `src/components/layouts/` にあります。ディレクトリは `components/` の
下にありますが、features を呼んでページの骨格を組み立てるので、層としては app と同じ
高さに立ちます ([レイヤー境界](#レイヤー境界))。

### assets/ と public/ の使い分け

**画像はまず `src/assets/` に置いて import します。** `public/` に置くと URL は
`/logo.png` のまま固定されますが、ファイル名にハッシュが付かないぶん長いキャッシュを
当てられません。`public/_headers` の `immutable` は `/_next/static/*` にしか掛かっておらず、
それ以外は Cloudflare の既定 (`max-age=0, must-revalidate`) になるため、**初回表示のたびに
304 の往復が入り、その間その画像の箱は空で描かれます**。

```tsx
import logo from '@/assets/logo.png'

;<img src={logo.src} alt="…" width={logo.width} height={logo.height} className="h-8 w-auto" />
```

import すると `out/_next/static/media/logo.<hash>.png` として書き出され、`immutable` が
効くので 2 回目以降はネットワークに出ません。`width` / `height` も原画の実寸が
メタデータで返るので、手で書き写さずに箱を確保できます。Next はさらに、その画像を使う
ページの `<head>` に `<link rel="preload">` を入れます。

**`next/image` は使いません。** Static Export には変換を行うサーバーが無く
(`next.config.ts` の `images.unoptimized`)、素の `<img>` から得られないものがありません。

`public/` に残すのは、URL が固定されている必要があるもの (`favicon.png`) と、
Cloudflare が読む `_headers` だけです。

## レイヤー境界

依存は **`共有層 → features → app / layouts`** の一方向に限ります。
Biome の `noRestrictedImports` を `overrides` で層ごとに設定しており、違反は lint で落ちます。

| 層 | ディレクトリ | 参照してよい先 |
| --- | --- | --- |
| app | `app/` `components/layouts/` | すべて |
| features | `features/<domain>/` | 共有層と、自分自身の feature のみ |
| 共有層 | `hooks/` `stores/` `lib/` `config/` `components/dev/` | 共有層のみ |
| ui | `components/ui/` | `lib/cn` などドメインを知らないものだけ |

ディレクトリ名がそのまま層の名前になっています。唯一またいでいるのが `components/` で、
この下の `layouts/` だけが app 層、残り (`ui/` `dev/`) は共有層です。置き場所ではなく
**何を参照してよいか**が層を決めるので、`biome.jsonc` では共有層の override
(`components/**` を含む) の後に `components/layouts/**` の override を置いて上書きしています。
`app-sidebar.tsx` が `components/ui/` ではなく `components/layouts/` にあるのも、
features (コマンドパレット) を参照する必要があるためです。

- **feature 間の直接 import は禁止**。共有したくなったら `lib/` へ引き上げるか、
  ページで両方を呼んで合成する。
- **自 feature 内は相対 import で書く**（`@/features/**` は自分自身を含めて全面禁止のため）。
  feature ごとに例外を書かず、1 つの override で境界を表現するための割り切り。
- **`components/ui/` はドメインを知らない**。`@/lib/types` の `NoteSummary` のような型を
  import した時点で、その画面でしか使えない部品になる。表示に必要な値は素の props
  (string / number) で受け取り、ドメインの型からの変換は `features/<domain>/` の UI で行う。
- **親を遡る相対 import (`../`) は共有層・features・ui・layouts で禁止**。この記法を許すと
  `@/` エイリアスに対する境界チェックを表記の違いだけですり抜けられるため。
- `overrides` の options はグローバル設定を**マージではなく上書き**する。そのため各 override で
  React まるごと取り込み禁止の `paths` を再掲している。消すとその配下だけ素通りになる。

テンプレートも含めてすべてが `.tsx` なので、この lint はサイトの全ファイルに効きます
(`.astro` を Biome の対象外にしていた頃の抜け穴はもうありません)。

### app/ ディレクトリ

```
src/app/
├── layout.tsx              # 全ページの外枠 (<html>・書体・メタデータの既定)
├── page.tsx                # /
├── not-found.tsx           # 404 (out/404.html として書き出される)
├── sitemap.ts              # /sitemap.xml
├── notes/
│   ├── page.tsx            # /notes
│   └── [slug]/page.tsx     # /notes/:slug (generateStaticParams で全件を静的生成)
├── notes-index.json/
│   └── route.ts            # /notes-index.json (Route Handler。force-static)
├── playgrounds/page.tsx    # /playgrounds
├── products/page.tsx       # /products
└── design-system/
    ├── page.tsx            # /design-system
    └── page.module.css     # そのページでしか使わないスタイル
```

**重要**: `src/app/` 配下は**ルーティング専用**です。規約の名前 (`page` / `layout` /
`route` / `sitemap` など) だけがルートとして扱われるので、ページ固有の utils / types /
hooks を同階層にコロケーションすることは技術的には可能ですが、**この構成では行いません**。
ページ固有のロジックは `src/features/<domain>/` に置きます (層の向きが読めなくなるため)。

#### ページファイルの役割

- `page.tsx`: URL に対応するページ。既定で Server Component なので、本体はビルド時にしか動かない
- `route.ts`: ビルド時に JSON などの静的ファイルを出力する。`export const dynamic = 'force-static'` が要る
- ページではデータ取得と整形の**呼び出し**のみを行い、実装は `features/` に置く
- タイトルや canonical は `export const metadata` (動的なら `generateMetadata`) で宣言する

```tsx
// src/app/notes/page.tsx
import { getPublishedNotes, toNoteSummary } from '@/features/notes/notes'
import { PageShell } from '@/components/layouts/page-shell'

export const metadata = { title: 'Notes', alternates: { canonical: '/notes' } }

export default async function NotesPage() {
  const notes = (await getPublishedNotes()).map(toNoteSummary)

  return (
    <PageShell>
      {notes.map((note) => (
        <NoteCard key={note.slug} note={note} />
      ))}
    </PageShell>
  )
}
```

`PageShell` が返すのは Fragment で、`<main>` と右レールの 2 つが並びます。どちらも
`app/layout.tsx` が敷いた grid の**直接の子**である必要があるためで、`<div>` で包むと
3 トラックが 2 つに潰れます。

### components/layouts/ ディレクトリ

```
src/components/layouts/
├── app-shell.tsx               # 3 カラムの grid + 左レール。app/layout.tsx が使う
├── app-sidebar.tsx             # 左レール: ロゴ・検索・ナビ (Server Component)
├── site-nav.tsx                # 　└ 行き先 (Client。usePathname で現在地を出す)
├── mobile-nav.tsx              # 　└ lg 未満のハンバーガー (Client。中身は site-nav)
├── command-search-trigger.tsx  # 　└ ⌘K のボタン (Client。押されて初めて本体を読む)
├── page-shell.tsx              # <main> + 右レール。各ページが使う
├── toc-sidebar.tsx             # 右レール: ページ専用ナビ (記事の目次)
└── dev-tools.tsx               # 開発時だけ Agentation を載せる
```

**外枠は 2 つに割れています。** `app-shell` は `app/layout.tsx` に置かれてページの外に
居るので、遷移しても作り直されません。`page-shell` はページと同じ枝なので、遷移のたびに
中身ごと差し替わります。左レールが残り、`<main>` と目次だけが入れ替わるのはこの分け方に
よるものです。

サイトの外枠は**ヘッダーを持たない 3 カラム**です。サイト名・検索・行き先は左レールが
すべて引き取り、右レールにはそのページ専用のナビ (今は記事の目次) が入ります。

3 つは `app-shell.tsx` の 1 本の grid に並んでいて、**レールは画面の端ではなく
本文の両脇に付きます**。トラックは `auto` (左) / `minmax(0, 39rem)` (中央) / `15rem` (右) で、
どれも画面幅では伸びません。余った幅は `justify-center` が grid ごと中央に寄せて左右の外へ
落とすので、読み幅もレールとの間隔も画面幅で動きません。中央のトラックは読み幅
`max-w-xl` (576px) と左右の `px-edge-h` (24px) の和 (624px) です。

- **左レールは固定幅ではなく中身に追従します** (`auto`)。下限は `app-sidebar.tsx` の
  `RAIL_MIN_WIDTH` で、「一番長いラベル + 左右の `px-edge-h`」と右レールと同じ `15rem` の
  広いほうを取ります。ラベルだけに張り付かせると幅を借りている検索フィールドが 13ch まで
  縮むので、フィールドが要る 192px (= 15rem - 左右の `px-edge-h`) を下限にしてあります。
  ラベルがそれを超えて伸びれば、左レールの幅もそのぶん動きます。
- **右レールはトラックだけ `15rem` 固定**で、箱 (`<aside>`) の幅は `w-fit` が中身に
  追従させます。トラックを固定するのは次項の理由です。
- **本文とレールの間隔は 80px** = 両側の `px-edge-h` (24 + 24) + トラック間の
  `gap-x-block` (32)。レールの中身がどこで終わろうと変わりません。
- **レールは `fixed` ではなく `sticky` + `self-start` + `h-dvh`。** `fixed` だと本文の脇に
  置けず `left` / `right` を calc で当てることになりますが、`sticky` なら grid の
  トラックに乗ったまま上端に貼り付きます。見た目の挙動は `fixed` と同じです。
- 左レールは `lg` (1024px) 以上で縦レール、それ未満では 1 カラムに畳まれた grid の
  1 行目 (全幅の横バー) になります。通常フローに残るので `<main>` にバーの高さを
  px で焼き込まずに済みます。
- **`lg` 未満のバーに並ぶのはロゴとハンバーガーだけ**です (高さ 57px)。行き先は
  `mobile-nav.tsx` がバーの下に開くパネルへ移し、検索ボタンは畳みます (`⌘K` 自体は
  幅に関係なく効きます)。パネルは `site-nav.tsx` を `variant="menu"` で呼ぶので、
  行き先の出典もリンクの現在地判定もレールと 1 つのままです。
- **パネルは塗り切り、閉じる面 (スクリム) は敷きません。** バーが持つ
  `backdrop-filter` は `position: fixed` の containing block になるため、バーの子から
  画面全体を覆う面は作れません。外側を触ったときに閉じるのは `document` の
  `pointerdown` で拾っています。同じ理由でパネル側も半透明にはできません
  (入れ子の `backdrop-filter` は本文をぼかせず、文字が透けて重なります)。
- 右レールは `xl` (1280px) 以上でのみ出ます。3 段が収まる幅は 1168px
  (左レール 240 + 32 + 624 + 32 + 240) ですが、その幅ちょうどで出すとレールがウィンドウの
  端に貼り付くため、左右に 56px 残る `xl` まで待ちます。
- **目次の有無で本文は動きません。** 右のトラックは `grid-template-columns` が常に
  確保していて、埋まるかどうかとは無関係だからです。

`app-sidebar.tsx` が `components/ui/` ではなく `components/layouts/` にあるのは、
`@/config/app` の `NAV_ITEMS` でサイト全体の行き先を並べ、コマンドパレット (features) を
起動する、ページの外枠そのものだからです。features を参照できるのは app 層だけなので、
features を使うコンポーネントは `components/layouts/` か `app/` に置きます。

レール自体は Server Component のままで、`'use client'` が付いているのは中の 2 つだけです
(現在地を知る必要があるナビと、⌘K を待ち受けるボタン)。境界を葉に寄せる例としてそのまま
読めます。

複数ページで共有する外枠 (レール・`<main>` の幅・メタタグ) は、
すべてこのディレクトリのレイアウトコンポーネントで表現します。

### features/ ディレクトリ

ドメイン固有のロジックを置きます。`src/app/` に置かないものの受け皿であり、
コンテンツの取得・変換・純粋関数・ドメイン固有のフックが対象です。

```
src/features/
├── notes/
│   ├── notes.ts                 # content/notes の読み取り・検証・変換 (frontmatter の出典)
│   ├── mdx.ts                   # MDX 本文をコンポーネントと目次に変える
│   ├── group-by-month.ts        # 純粋関数
│   ├── group-by-month.test.ts   # 対応するテスト
│   ├── search-index.ts          # 検索インデックスの取得・絞り込み・グループ化
│   ├── search-index.test.ts
│   ├── note-card.tsx            # ドメインの型を受け取る UI
│   ├── notes-timeline.tsx
│   ├── note-timeline-item.tsx
│   └── command-search.tsx       # コマンドパレット (開かれた時に初めて読まれる)
└── design-system/
    ├── parse-theme.ts           # globals.css の @theme をトークン一覧に落とす
    ├── parse-theme.test.ts
    ├── token-groups.ts          # トークンをカタログの節に振り分ける
    ├── token-groups.test.ts
    ├── catalog.ts               # globals.css をファイルとして読み、目次と節を組む
    ├── token-table.tsx          # 1 節ぶんの表 (Server Component)
    ├── motion-button.tsx        # 　└ 再生ボタンだけが Client
    ├── section-heading.tsx      # 見出し。id から catalog.ts を引く
    ├── dialog-demo.tsx          # compound をひとまとまりで動かす Client Component
    └── command-demo.tsx
```

`/design-system` のカタログが値を持たないのは、この feature が `src/styles/globals.css` の
`@theme` を**ビルド時に読んで**組み立てているからです。トークンを 1 つ足せばカタログの行も
右の目次も増え、接頭辞を知らないトークンは Uncategorised の節に出ます。プレビューの色や
サイズが Tailwind のクラスではなく inline style なのは、Tailwind が**使われていない
`@theme` 変数を出力から落とす**ためで、解決済みの実値を流す以外に一致させる方法が
ありません (経緯は `parse-theme.ts` 冒頭)。CSS をバンドラ経由ではなく `node:fs` で
読むのも同じ理由です。

**features には UI を置けます。** ドメインを知っているコンポーネントは、`components/` では
なくここが居場所です (`components/` は features を import できないため)。

`index.ts` は置きません。利用側は `@/features/notes/notes` のように実ファイルを直接指します。

#### ビルド時とクライアントの責務分離

`page.tsx` と `features/` の関数は Server Component として**ビルド時にのみ**実行され、
その中身はクライアントに送られません。ブラウザに降りるのは `'use client'` を付けた
ファイルとその依存だけです。

| ファイル                            | 実行環境     | 責務                             |
| ----------------------------------- | ------------ | -------------------------------- |
| `app/**/page.tsx` (Server)          | ビルド時     | データ取得・整形の呼び出し       |
| `app/**/route.ts`                   | ビルド時     | 静的ファイル (JSON など) の出力  |
| `features/*.ts` (Server)            | ビルド時     | コンテンツ取得、変換、純粋関数   |
| `'use client'` を付けた `*.tsx`     | 両方         | ビルド時に HTML を出し、そこから先はブラウザ |
| `stores/*.ts`                       | クライアント | Client Component 間で共有するステート |
| `lib/*.ts`                          | 両方         | 純粋関数、共通型                 |

`'use client'` は「クライアントでしか動かない」ではなく「**クライアントでも動く**」の印です。
ビルド時に一度描かれて HTML に載り、そのうえで hydrate されます。左レールも右の目次も、
JS が来る前から HTML に入っているのはこのためです。

`src/**` には `noNodejsModules` を掛けており、ブラウザに届きうるコードに Node の
ビルトインを持ち込めません。例外は `biome.jsonc` で**名指ししたファイルだけ**
(`src/app/**` と、content / CSS を読む 2 つ) で、これは「ビルド時にしか動かない」という
宣言でもあります。`'use client'` のファイルをここに足してはいけません。

#### Client Component の作り方

対話が必要なコンポーネントのファイル先頭に `'use client'` を書きます。付けない
コンポーネントはビルド時に HTML へ描画されて JS を送りません。

```tsx
// src/features/design-system/dialog-demo.tsx
'use client'

export function DialogDemo() { … }
```

**境界はできるだけ葉に寄せます。** 左レール全体ではなくナビとボタンだけ、トークンの表
全体ではなく再生ボタンだけが Client です。Server Component は Client Component を
子として描けるので、対話する部分だけを切り出せば残りは HTML のまま配信されます。

#### 操作されるまで読まない (遅延読み込み)

`'use client'` を付けたコンポーネントは、そのページのチャンクに入って初期ロードで
落ちてきます。**押されるまで何もしない UI** なら、`next/dynamic` で描画そのものを
遅らせたほうが安くなります。コマンドパレットがこの形です。

```tsx
// src/components/layouts/command-search-trigger.tsx
const CommandSearch = dynamic(
  async () => (await import('@/features/notes/command-search')).CommandSearch,
  { ssr: false },
)

export function CommandSearchTrigger() {
  const [isMounted, setIsMounted] = useState(false)
  …
  return (
    <>
      <button onClick={toggle}>⌘K</button>
      {isMounted && <CommandSearch open={isOpen} onClose={close} />}
    </>
  )
}
```

要点は `isMounted` です。木に無いあいだはチャンクの要求すら発生しないので、
**React + Radix + cmdk (gzip 約 17KB)** は初めて押されるまで落ちてきません。
同じ形を `dev-tools.tsx` が Agentation ツールバーに使っています (あちらはさらに
`NODE_ENV` の枝に入れてあるので、本番ではチャンクごと生まれません)。

判断の順序は **Server Component → `next/dynamic` → `'use client'` を直接**。
状態を持つ UI が初期表示から画面に出ているならそのまま Client に、押されて初めて
現れるなら `next/dynamic` に寄せます。

### components/ ディレクトリ構成

`src/components/` 配下のコンポーネントは**必ずプレゼンテーションコンポーネント**として実装します。
ビジネスロジックは含まず、props を受け取って UI を描画することに専念します
(外枠を組み立てる `layouts/` だけは層が違います。前の節を参照)。

**重要**: この制約は `src/components/` 配下のコンポーネントに適用されます。
`src/app/**/page.tsx` などのページコンポーネントには適用されません。

**1 コンポーネント = 1 ファイル**にし、ディレクトリと `index.ts` は作りません。
Compound Components のパーツも 1 ファイルにまとめて flat named export します
(理由は [コーディング規約](coding-standards.md#共有-ui-は-1-ファイルに-flat-named-export))。

```
src/components/
├── layouts/                # ページの外枠 (層は app。前の節を参照)
├── ui/                     # UI プリミティブ
│   ├── button.tsx          # variant のクラス定義も private でこの中
│   ├── button.stories.tsx
│   ├── card.tsx
│   ├── card.stories.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── page-header.tsx
│   ├── screen.tsx
│   ├── text.tsx
│   └── timeline.tsx
└── dev/                    # 開発時だけ動くもの。本番のバンドルには入らない
    └── agentation-toolbar.tsx
```

**`src/components/` は、`layouts/` を除けばドメインを知らない部品だけの置き場です。**
ドメインを知っている UI (`NoteSummary` のような型を受け取るもの) は
`features/<domain>/` に置きます。bulletproof-react
と同じ切り方で、1 つのドメインを理解するのに 2 つのツリーを行き来せずに済みます。

`shared` のような広い名前のディレクトリは作りません。何でも入ってしまうためです。
ドメイン非依存だが UI プリミティブでもないもの (SEO、エラーバウンダリなど) が出てきたら、
そのとき `components/seo/` `components/errors/` のように**役割名で**追加します。
`components/dev/` はその 1 例で、開発時だけ動くものを置きます
([Agentation](agentation.md) のツールバー)。本番に出ないものが `ui/` に混ざると、
どれが配信されるのか読めなくなるため分けています。

#### コンポーネントの置き場所を決める

| 問い | 置き場所 |
| --- | --- |
| ページを包む外枠 (レール・grid) か、features を呼ぶ? | `src/components/layouts/` |
| ドメインの型 (`NoteSummary` など) を受け取る? | `src/features/<domain>/` |
| 1 ページでしか使わない静的なマークアップ? | そのページに直接書く |
| どちらでもない (ドメインを知らない部品) | `src/components/ui/` |

`components/ui/**` には lint が掛かっており、**ドメインの語彙を持ち込めません**。
`@/lib/types` や `@/features/**` の import は落ちます。`PageHeader` のように
ui プリミティブを組み合わせただけの部品も、ドメインを知らない限りここに置きます。
逆にドメインの型を受け取るようになったら、それが features へ移す合図です。

ホームの挨拶文が `src/app/page.tsx` に直接書かれているのは 2 番目の例です。
1 箇所でしか使わず、状態も持たないマークアップに、ファイルを与える理由はありません。

#### ロジックを切り出す基準

**まず、切り出さないことを既定にします。** コンポーネントの中で完結する状態やハンドラを
`use-<component>.ts` のような専用フックに追い出すと、読む側は 2 ファイルを往復することに
なり、可読性はむしろ下がります。1 箇所でしか使わないものに別ファイルを与える理由は
ありません。

切り出す価値が出るのは次の 3 つのどれかに当てはまるときだけです。

| 状況 | 行き先 | 例 |
| --- | --- | --- |
| 2 つ目の利用者が現れた | `src/hooks/` | `use-keyboard-shortcut.ts` |
| ドメインの知識が入っている | `src/features/<domain>/` | `notes/search-index.ts` |
| ドメインに依らない純粋関数 | `src/lib/` | `lib/date.ts` |

**ドメインの知識が入っているものは、テストのためにも切り出します。** 検索の絞り込みが
`features/notes/search-index.ts` にあるのは、コンポーネントに閉じたままでは
単体テストが書けなかったためです。

variant のクラス定義も同じで、コンポーネント本体に private な定数として置きます。
`components/ui/**` の `useComponentExportOnlyModules` が禁じているのは
**値の export** だけなので、export しなければ同じファイルに同居できます
(型の export は許されますが、外から使わないものは export しません)。

この基準は主要な OSS の実態とも一致します。shadcn/ui (505 コンポーネント)、
bulletproof-react、vercel/commerce、Next.js の公式サンプルには**コンポーネント同居の
フックが 1 つもありません**。cal.com と excalidraw を含めて数えても、約 1,850 のコンポーネント
ファイルに対して同居フックは 13 件 (0.7%) で、いずれも大きな機能群の中にあります。
再利用されるフックは中央の `hooks/` へ、ドメインのロジックは feature へ集まり、
残りはコンポーネント本体に留まる、という配分になっています。

### hooks/ ディレクトリ構成

**フックを置くのは「2 つ目の利用者が現れてから」です**
([ロジックを切り出す基準](#ロジックを切り出す基準))。1 つのコンポーネントでしか使わない状態は、
そのコンポーネントの中に書きます。

1. **src/hooks/**: 複数の Client Component で使う汎用フック

   ```
   src/hooks/
   ├── use-keyboard-shortcut.ts
   ├── use-window-scroll.ts
   └── use-window-scroll.test.ts
   ```

2. **src/features/<domain>/use-\*.ts**: ドメインの知識を持つフック

`src/components/` にフックのファイルは置きません。ドメインを知らない部品に、
切り出すほどのロジックは生まれないためです。

### stores/ ディレクトリ構成

ページ単位のサーバーステートは存在しない (ビルド時に解決される) ため、
ストアが扱うのは **Client Component 間で共有するクライアントステート**だけです。

置き場所はフックと同じ基準です。**1 つのコンポーネントに閉じた状態は `useState` のまま
コンポーネントに置き**、島をまたいで共有する必要が出てからストアにします。

1. **src/stores/**: 複数の Client Component で共有するグローバルステート

   ```
   src/stores/
   ├── theme-store.ts
   └── theme-store.test.ts
   ```

2. **src/features/<domain>/<name>-store.ts**: ドメインに閉じた共有ステート

## その他のディレクトリ

### lib/ と utils の配置

1. **src/lib/**: プロジェクト全体で使用される汎用ロジックと共通型

   ```
   src/lib/
   ├── cn.ts                   # className 結合ユーティリティ
   ├── cn.test.ts
   ├── date.ts                 # 日付を組み立てる唯一の場所 (生の Date は lint で禁止)
   └── types.ts                # 複数レイヤーで共有する型 (SearchableItem など)
   ```

2. **src/features/<domain>/**: ドメイン固有のロジック

`src/components/` にユーティリティのファイルは置きません。コンポーネントの中で完結する
処理は本体に書き、切り出す段になったら上の 2 つのどちらかに行き先が決まります。

`src/lib/date.ts` 以外での `new Date()` / `Date.now()` は GritQL プラグイン
(`no-raw-date.grit`) が lint で落とします。詳細は
[コーディング規約](coding-standards.md#日付の扱い) を参照してください。

### config/ ディレクトリ

```
src/config/
└── app.ts                  # サイト名・説明など、ビルド時に決まる定数
```

`index.ts` という名前は使いません (barrel と区別がつかないため)。

### content/ ディレクトリ

MDX などのコンテンツファイルを配置します。スキーマは `src/features/notes/notes.ts` の
zod で定義し、frontmatter はビルド時に検証されます。**frontmatter の型はここが唯一の出典**です
(`z.infer` で TypeScript の型が導出されます)。

```
content/
└── notes/                  # ノートの MDX ファイル
    ├── note-1.mdx
    └── note-2.mdx
```

`draft: true` のノートは `getPublishedNotes()` が除外するため、ビルド出力にも含まれません。

## テストファイルの配置

テストファイルは**対象と同じ階層**に `*.test.ts` として置きます。

```
src/features/notes/
├── group-by-month.ts
└── group-by-month.test.ts
```

関連するユーティリティやフックが 3 つ以上に増えたら、`utils/` や `hooks/` の
サブディレクトリでまとめ、その中でも同じくテストを同階層に置きます。

なお、`src/app/` 配下にはテストを置きません。ページから呼ばれるロジックを `features/` に
置くのは、テスト可能にするためでもあります。

詳細は [テスト](testing.md) を参照してください。

## 命名規則

ファイル名・ディレクトリ名はすべて **kebab-case** です。コンポーネントも例外ではありません
(`HeroSection.tsx` ではなく `hero-section.tsx`)。
一覧と、lint で担保される範囲は [コーディング規約](coding-standards.md#命名規則) にあります。

`src/app/` だけは例外で、名前を決めるのは Next.js と URL です。規約ファイル
(`page.tsx` / `layout.tsx` / `not-found.tsx` / `route.ts` / `sitemap.ts`)、動的ルートの
`[param]`、そして `notes-index.json/` のように拡張子を含むディレクトリ名がそれにあたります。
`biome.jsonc` はこのディレクトリだけ `useFilenamingConvention` を外しています。

## ベストプラクティス

### 1. components/ 配下のコンポーネントはプレゼンテーションに専念

`src/components/` 配下のコンポーネントはプレゼンテーションに専念し、ビジネスロジックを含めません
(`components/layouts/` は features を呼びますが、呼ぶだけで実装は持ちません)。

```tsx
// ❌ Bad: components/ 配下でデータ取得
// src/components/ui/card.tsx
export function NoteCard() {
  const [note, setNote] = useState(null)
  useEffect(() => {
    fetchNote().then(setNote)
  }, [])
  return <div>{note?.title}</div>
}

// ✅ Good: props でデータを受け取る (ドメインの型を受けるので置き場所は features)
// src/features/notes/note-card.tsx
export function NoteCard({ note }: { note: NoteSummary }) {
  return <div>{note.metadata.title}</div>
}
```

### 2. 既定は Server Component、境界は葉に寄せる

`'use client'` を付けるのは、そのコンポーネントが**本当にブラウザで動く必要がある**ときだけです。
左レール全体を Client にするのではなく、現在地を知るナビと ⌘K のボタンだけを Client にします。

### 3. データ取得はページ (Server Component) か features/ で行う

Client Component の中で `fetch` してデータを取りに行くのは、ビルド時に解決できない場合
(コマンドパレットの検索インデックスなど) に限ります。

### 4. 型の出典を一箇所にする

コンテンツの型は `src/features/notes/notes.ts` の zod スキーマから導出します
(`z.infer`)。同じ形の interface を複数箇所に書き写さないでください。

### 5. 未使用のファイル・export は溜めない

barrel を置かない構成なので `pnpm knip` が export 単位で未使用を検出できます。
機能を消したら、その export も一緒に消えているかを確認してください。

**export するのは、他のファイルから実際に使うものだけです。** props 型も例外ではなく、
外から必要になったら `ComponentProps<typeof Button>` で取り出せます
(検証済み)。使う場所ができた時点で export に変えれば済むので、先回りして公開しません。
knip はこの方針を前提に設定してあり、`ignoreExportsUsedInFile` は有効にしていません。
有効にすると「export しているが自ファイル内でしか使わない」という、まさに検出したい
ケースが報告されなくなるためです。
