/*
 * 日付を組み立てる唯一の場所。
 *
 * ノートの日付は frontmatter の YYYY-MM-DD が出典で、それ以外の形では持ち回らない。
 * `new Date('2025-11-03')` は UTC 0 時と解釈され、日本時間では前日になる。各所で
 * 直に触られると同じ間違いが何度でも入るので、Date に触れてよいのはこのファイルだけに
 * 限り、no-raw-date.grit（Biome プラグイン）が他のファイルでの使用を lint で落とす。
 */

interface IsoDateParts {
  year: number
  month: number
  day: number
}

/** YYYY-MM-DD を年・月・日に分解する（月は 1 始まり） */
function splitIsoDate(dateString: string): IsoDateParts {
  const [year, month, day] = dateString.split('-').map(Number)

  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`日付は YYYY-MM-DD 形式で渡してください: ${dateString}`)
  }

  return { year, month, day }
}

/** YYYY-MM-DD を暦の上の日付として読む（ローカルタイムゾーンで解釈させない） */
function parseIsoDate(dateString: string): Date {
  const { year, month, day } = splitIsoDate(dateString)

  // Date.UTC の month は 0 始まり。UTC で組んで UTC で読み出す限り
  // タイムゾーンの影響を受けない
  return new Date(Date.UTC(year, month - 1, day))
}

/**
 * YYYY-MM-DD を読み手向けの表記に整える
 *
 * @param dateString - ISO の日付文字列（例: "2025-11-03"）
 * @param locale - 表記に使うロケール（既定: "en-US"）
 * @returns 整形済みの文字列（例: "November 3, 2025"）
 */
export function formatDate(dateString: string, locale = 'en-US'): string {
  return parseIsoDate(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * YYYY-MM-DD から並べ替え用の月キー（YYYY-MM）を作る
 *
 * 文字列の切り出しだけで済ませる。Date を経由すると解釈のタイムゾーン次第で
 * 月末・月初が隣の月に落ちるため。
 */
export function toMonthKey(dateString: string): string {
  const { year, month } = splitIsoDate(dateString)

  return `${year}-${String(month).padStart(2, '0')}`
}

/** YYYY-MM-DD から表示用の月ラベル（例: "2025年11月"）を作る */
export function toMonthLabel(dateString: string): string {
  const { year, month } = splitIsoDate(dateString)

  return `${year}年${month}月`
}
