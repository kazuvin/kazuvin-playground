import { describe, expect, it } from 'vitest'
import { parseThemeTokens } from './parse-theme'

/** テストの読みやすさのため、@theme の中身だけを受け取って 1 枚の CSS に組む。 */
function theme(body: string): string {
  return `@import "tailwindcss";\n\n@theme {\n${body}\n}\n\nbody {\n  --not-a-token: 1;\n}`
}

describe('parseThemeTokens', () => {
  it('should read declarations in source order', () => {
    const tokens = parseThemeTokens(theme('  --color-a: #fff;\n  --color-b: #000;'))

    expect(tokens.map((token) => token.name)).toEqual(['--color-a', '--color-b'])
    expect(tokens[0].value).toBe('#fff')
  })

  it('should ignore declarations outside the @theme block', () => {
    const tokens = parseThemeTokens(theme('  --color-a: #fff;'))

    expect(tokens.map((token) => token.name)).toEqual(['--color-a'])
  })

  it('should ignore declarations nested inside the block', () => {
    const tokens = parseThemeTokens(
      theme('  --animate-x: 1s ease fade;\n  @keyframes fade {\n    from { --inner: 0; }\n  }'),
    )

    expect(tokens.map((token) => token.name)).toEqual(['--animate-x'])
  })

  it('should resolve a var() chain down to its literal', () => {
    const tokens = parseThemeTokens(
      theme('  --color-gray-900: #16161a;\n  --color-fg: var(--color-gray-900);'),
    )

    expect(tokens[1].resolved).toBe('#16161a')
    expect(tokens[1].value).toBe('var(--color-gray-900)')
  })

  it('should leave a var() the theme does not declare intact', () => {
    const tokens = parseThemeTokens(
      theme('  --font-sans: var(--font-astro, ui-monospace), monospace;'),
    )

    expect(tokens[0].resolved).toBe('var(--font-astro, ui-monospace), monospace')
  })

  it('should fold a derived declaration into the base token', () => {
    const tokens = parseThemeTokens(
      theme(
        '  --tracking-wide: 0.02em;\n  --text-xs: 0.75rem;\n  --text-xs--line-height: 1rem;\n  --text-xs--letter-spacing: var(--tracking-wide);',
      ),
    )

    expect(tokens.map((token) => token.name)).toEqual(['--tracking-wide', '--text-xs'])
    expect(tokens[1].modifiers).toEqual([
      { property: 'line-height', value: '1rem', resolved: '1rem' },
      { property: 'letter-spacing', value: 'var(--tracking-wide)', resolved: '0.02em' },
    ])
  })

  it('should lift a `---- x ----` comment as the label', () => {
    const tokens = parseThemeTokens(
      theme('  /** ---- semantic: surfaces ---- */\n  --color-bg: #fff;'),
    )

    expect(tokens[0].label).toBe('semantic: surfaces')
    expect(tokens[0].note).toEqual([])
  })

  it('should lift the paragraphs of a comment as the note', () => {
    const tokens = parseThemeTokens(
      theme(
        '  /** ---- radius ----\n      12 for controls.\n      16 for cards.\n\n      No other values. */\n  --radius-md: 12px;',
      ),
    )

    expect(tokens[0].label).toBe('radius')
    expect(tokens[0].note).toEqual(['12 for controls. 16 for cards.', 'No other values.'])
  })

  it('should keep an unmarked comment as a note without a label', () => {
    const tokens = parseThemeTokens(theme('  /** Spacing base unit. */\n  --spacing: 4px;'))

    expect(tokens[0].label).toBe('')
    expect(tokens[0].note).toEqual(['Spacing base unit.'])
  })

  it('should join wrapped Japanese lines without inserting a space', () => {
    const tokens = parseThemeTokens(
      theme(
        '  /** 太さは 4 段だけ。書体は可変だが、システムとして\n      出荷するのはこの 4 つ。 */\n  --font-weight-normal: 400;',
      ),
    )

    expect(tokens[0].note).toEqual([
      '太さは 4 段だけ。書体は可変だが、システムとして出荷するのはこの 4 つ。',
    ])
  })

  it('should not carry a comment over to the next declaration', () => {
    const tokens = parseThemeTokens(theme('  /** first */\n  --a: 1;\n  --b: 2;'))

    expect(tokens[0].note).toEqual(['first'])
    expect(tokens[1].note).toEqual([])
  })

  it('should return nothing when there is no @theme block', () => {
    expect(parseThemeTokens('body { color: red; }')).toEqual([])
  })
})
