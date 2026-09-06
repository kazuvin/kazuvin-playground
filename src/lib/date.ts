/*
 * Date に触れてよい唯一のファイル (他は no-raw-date.grit が落とす)。
 * `new Date('2025-11-03')` は UTC 0 時と解釈され、日本時間では前日になる。
 */

interface IsoDateParts {
  year: number
  month: number
  day: number
}

/** 月は 1 始まりで返す */
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

/** "2025-11-03" → "November 3, 2025" */
export function formatDate(dateString: string, locale = 'en-US'): string {
  return parseIsoDate(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * 並べ替え用の月キー (YYYY-MM)。Date を経由すると月末・月初が隣の月に落ちるので
 * 文字列の切り出しだけで済ませる。
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
