import { describe, expect, it } from 'vitest'
import { parseThemeTokens } from './parse-theme'
import { groupThemeTokens } from './token-groups'

function group(body: string) {
  return groupThemeTokens(parseThemeTokens(`@theme {\n${body}\n}`))
}

describe('groupThemeTokens', () => {
  it('should keep the neutral ramp out of the semantic colour group', () => {
    const groups = group('  --color-gray-900: #16161a;\n  --color-background: #fff;')

    expect(groups.map((entry) => entry.id)).toEqual(['neutral-ramp', 'semantic-color'])
    expect(groups[0].rows[0].key).toBe('gray-900')
    expect(groups[1].rows[0].key).toBe('background')
  })

  it('should keep the accent between the ramp and the semantic colours', () => {
    const groups = group('  --color-accent: rgb(60, 130, 247);\n  --color-accent-tint: #eff5fe;')

    expect(groups.map((entry) => entry.id)).toEqual(['accent'])
    expect(groups[0].rows.map((row) => row.key)).toEqual(['accent', 'accent-tint'])
  })

  it('should not read a font weight as a font family', () => {
    const groups = group('  --font-sans: monospace;\n  --font-weight-bold: 700;')

    expect(groups.map((entry) => entry.id)).toEqual(['font-weight', 'font-family'])
    expect(groups[0].rows[0].key).toBe('bold')
    expect(groups[1].rows[0].key).toBe('sans')
  })

  it('should split the spacing base unit from the spacing scale', () => {
    const groups = group('  --spacing: 4px;\n  --spacing-gap: 8px;')

    expect(groups.map((entry) => entry.id)).toEqual(['spacing-base', 'spacing-scale'])
    expect(groups[1].rows[0].key).toBe('gap')
  })

  it('should keep the declaration order inside a group', () => {
    const groups = group('  --radius-sm: 8px;\n  --radius-md: 12px;\n  --radius-lg: 16px;')

    expect(groups[0].rows.map((row) => row.key)).toEqual(['sm', 'md', 'lg'])
  })

  it('should drop groups that have no token', () => {
    const groups = group('  --radius-sm: 8px;')

    expect(groups.map((entry) => entry.id)).toEqual(['radius'])
  })

  /* カタログが globals.css に追いつけているかの担保。接頭辞を知らないトークンを
     捨ててしまうと、CSS に足したものがページから黙って消えることになる。 */
  it('should collect an unknown prefix into the uncategorised group', () => {
    const groups = group('  --shadow-card: 0 1px 2px #000;')

    expect(groups.map((entry) => entry.id)).toEqual(['uncategorised'])
    expect(groups[0].rows[0].key).toBe('--shadow-card')
  })

  it('should put the uncategorised group last', () => {
    const groups = group('  --shadow-card: 0 1px 2px #000;\n  --radius-sm: 8px;')

    expect(groups.map((entry) => entry.id)).toEqual(['radius', 'uncategorised'])
  })
})
