/*
 * src/styles/globals.css の @theme をそのまま読み下して、トークンの一覧に落とす。
 *
 * カタログ (/design-system) が値を書き写さないための層。ここが CSS を唯一の出典に
 * している限り、globals.css にトークンを 1 つ足せばカタログの行も 1 つ増える。
 * 「値のコピーを TS 側に持たない」が設計方針のすべてで、プレビューの色もサイズも
 * ここで解決した実値をそのまま inline style に流す。Tailwind は使われていない
 * @theme 変数を出力から落とすので、`var(--color-gray-25)` のような未使用トークンを
 * カタログ側で参照すると値が無い。実値まで解決しておくのはそのため。
 *
 * 拾うのは @theme 直下の `--*` 宣言だけで、@keyframes のような入れ子は深さで弾く。
 * 宣言の直前のコメントはトークン群の設計意図そのものなので、見出し (`---- x ----`)
 * と本文に分けて一緒に持ち上げる。
 */

interface TokenModifier {
  /** --text-base--line-height の `line-height` の部分 */
  property: string
  value: string
  resolved: string
}

export interface ThemeToken {
  /** 宣言そのままの名前 (--color-gray-900) */
  name: string
  /** 宣言そのままの値。var() を含むことがある */
  value: string
  /** var() を @theme の中で辿りきった値。辿れなければ value と同じ */
  resolved: string
  /** --text-base--line-height のような派生宣言を基準トークンに畳んだもの */
  modifiers: TokenModifier[]
  /** 直前のコメントが `---- x ----` 形式だったときの見出し。無ければ空文字 */
  label: string
  /** 直前のコメントの段落。無ければ空配列 */
  note: string[]
}

interface RawDeclaration {
  name: string
  value: string
  comment: string | null
}

/** 和文の行は連結時に空白を挟まない。CSS のコメントは折り返しで改行されているだけで、
    そこに空白を入れると「〜に振って 「1rem = 14px」」のように字間が割れる。 */
const CJK = /[　-ヿ㐀-䶿一-鿿＀-￯]/

/** `---- typography ----` のような、コメント 1 行目に閉じまである見出し */
const SECTION_MARKER = /^-{3,}\s*(.+?)\s*-{3,}$/

/** --text-2xs--line-height を「基準 --text-2xs」と「派生 line-height」に割る。
    名前の途中に `--` を持つのは派生宣言だけなので、これで一意に判定できる。 */
const DERIVED_NAME = /^(--.+?)--([a-z-]+)$/

const VAR_REFERENCE = /var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)/g

/** @theme { ... } の中身を取り出す。コメントを読み飛ばしてから波括弧を数える。 */
function extractThemeBlock(css: string): string {
  const start = css.indexOf('@theme')
  if (start === -1) {
    return ''
  }
  const open = css.indexOf('{', start)
  if (open === -1) {
    return ''
  }

  let depth = 0
  let index = open
  while (index < css.length) {
    if (css.startsWith('/*', index)) {
      const end = css.indexOf('*/', index + 2)
      index = end === -1 ? css.length : end + 2
      continue
    }
    const char = css[index]
    if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return css.slice(open + 1, index)
      }
    }
    index += 1
  }
  return ''
}

/** ブロック直下の `--name: value;` を、直前のコメントとともに拾う。 */
function scanDeclarations(block: string): RawDeclaration[] {
  const declarations: RawDeclaration[] = []
  let depth = 0
  let buffer = ''
  let comment: string | null = null
  let index = 0

  while (index < block.length) {
    if (block.startsWith('/*', index)) {
      const end = block.indexOf('*/', index + 2)
      const body = block.slice(index + 2, end === -1 ? block.length : end)
      // 宣言の途中に挟まったコメントは、その宣言の説明ではないので捨てる
      if (depth === 0 && buffer.trim() === '') {
        comment = body
      }
      index = end === -1 ? block.length : end + 2
      continue
    }

    const char = block[index]
    if (char === '{') {
      depth += 1
      buffer = ''
    } else if (char === '}') {
      depth -= 1
      buffer = ''
    } else if (char === ';') {
      const declaration = buffer.trim()
      const colon = declaration.indexOf(':')
      if (depth === 0 && declaration.startsWith('--') && colon > 0) {
        declarations.push({
          name: declaration.slice(0, colon).trim(),
          value: declaration.slice(colon + 1).trim(),
          comment,
        })
        comment = null
      }
      buffer = ''
    } else {
      buffer += char
    }
    index += 1
  }

  return declarations
}

/** var() を @theme の中だけで辿る。辿れない参照 (Astro が出す font 変数など) は
    そのまま残す。循環は seen で止める。 */
function resolveValue(value: string, values: Map<string, string>, seen: Set<string>): string {
  return value.replace(VAR_REFERENCE, (reference, name: string) => {
    const next = values.get(name)
    if (next === undefined || seen.has(name)) {
      return reference
    }
    seen.add(name)
    return resolveValue(next, values, seen)
  })
}

function joinLines(lines: string[]): string {
  return lines.reduce((joined, line) => {
    if (joined === '') {
      return line
    }
    const previous = joined.slice(-1)
    const next = line.slice(0, 1)
    return CJK.test(previous) && CJK.test(next) ? joined + line : `${joined} ${line}`
  }, '')
}

/** 空行で段落に割る。罫線代わりの `----` は落とす。 */
function toParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = []
  let current: string[] = []

  for (const line of lines) {
    const text = line.replace(/-{3,}/g, '').trim()
    if (text === '') {
      if (current.length > 0) {
        paragraphs.push(joinLines(current))
        current = []
      }
      continue
    }
    current.push(text)
  }
  if (current.length > 0) {
    paragraphs.push(joinLines(current))
  }

  return paragraphs
}

function describeComment(comment: string | null): Pick<ThemeToken, 'label' | 'note'> {
  if (comment === null) {
    return { label: '', note: [] }
  }

  // `/**` の残りと、行頭に揃えられた `*` を落とす
  const lines = comment.split('\n').map((line) => line.replace(/^\s*\*+/, '').trimEnd())
  const marker = (lines[0] ?? '').trim().match(SECTION_MARKER)

  return {
    label: marker === null ? '' : marker[1],
    note: toParagraphs(marker === null ? lines : lines.slice(1)),
  }
}

/**
 * globals.css の文字列から @theme のトークン一覧を作る。
 *
 * 並びは宣言順のまま。CSS 側で意味のまとまりごとに並べてあるので、
 * カタログはそれをそのまま表に写せばよい。
 */
export function parseThemeTokens(css: string): ThemeToken[] {
  const declarations = scanDeclarations(extractThemeBlock(css))
  const values = new Map(declarations.map((declaration) => [declaration.name, declaration.value]))
  const resolve = (value: string): string => resolveValue(value, values, new Set())

  const tokens: ThemeToken[] = []
  const byName = new Map<string, ThemeToken>()

  for (const declaration of declarations) {
    const derived = declaration.name.match(DERIVED_NAME)
    const base = derived === null ? undefined : byName.get(derived[1])

    if (derived !== null && base !== undefined) {
      base.modifiers.push({
        property: derived[2],
        value: declaration.value,
        resolved: resolve(declaration.value),
      })
      continue
    }

    const token: ThemeToken = {
      name: declaration.name,
      value: declaration.value,
      resolved: resolve(declaration.value),
      modifiers: [],
      ...describeComment(declaration.comment),
    }
    tokens.push(token)
    byName.set(token.name, token)
  }

  return tokens
}
