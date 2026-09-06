import { createCn } from 'cn/config'

/* tailwind-merge の既定は Tailwind 標準の font-size スケール (xs〜9xl) しか
   知らない。この 2 つはそこに無いキーなので、素のままだと text-COLOUR と
   誤判定され、後続の色クラスで黙って捨てられる (要素が継承サイズで描かれる)。
   標準側と同じキー名の text-xs / text-sm / text-base は登録不要。 */
const OFF_LADDER_FONT_SIZES = ['2xs', 'mark']

/**
 * Combines class names conditionally and resolves Tailwind conflicts,
 * extended with the design system's non-standard font-size keys.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [{ text: OFF_LADDER_FONT_SIZES }],
    },
  },
})
