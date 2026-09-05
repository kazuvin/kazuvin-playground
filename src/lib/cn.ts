import { createCn } from 'cn/config'

/* Kotoba's seven typography roles replace Tailwind's font-size scale on the
   `text-` prefix. The default config only knows the built-in scale, so without
   this it classes `text-label` as a text-COLOUR and silently drops it when a
   colour follows — a Button would render at the inherited font size. */
const KOTOBA_TYPE_ROLES = ['expression', 'reading', 'gloss', 'body', 'label', 'support', 'overline']

/**
 * Combines class names conditionally and resolves Tailwind conflicts,
 * extended with Kotoba's typography roles.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [{ text: KOTOBA_TYPE_ROLES }],
    },
  },
})
