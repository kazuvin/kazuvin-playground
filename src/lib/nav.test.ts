import { describe, expect, it } from 'vitest'
import { isActiveNavItem, selectTocHeadings, tocActiveLine } from './nav'
import type { MarkdownHeading } from './types'

describe('isActiveNavItem', () => {
  it('should match the exact path', () => {
    expect(isActiveNavItem('/notes', '/notes')).toBe(true)
  })

  it('should match a descendant path', () => {
    expect(isActiveNavItem('/notes/getting-started', '/notes')).toBe(true)
  })

  it('should not match a sibling route that merely shares the prefix', () => {
    expect(isActiveNavItem('/notes-index', '/notes')).toBe(false)
    expect(isActiveNavItem('/design-systems', '/design-system')).toBe(false)
  })

  it('should not match an unrelated path', () => {
    expect(isActiveNavItem('/playgrounds', '/notes')).toBe(false)
  })

  it('should ignore a trailing slash on the current path', () => {
    expect(isActiveNavItem('/notes/', '/notes')).toBe(true)
    expect(isActiveNavItem('/notes/getting-started/', '/notes')).toBe(true)
  })

  it('should keep the root path intact', () => {
    expect(isActiveNavItem('/', '/notes')).toBe(false)
  })
})

describe('selectTocHeadings', () => {
  const headings: MarkdownHeading[] = [
    { depth: 1, slug: 'title', text: 'Title' },
    { depth: 2, slug: 'first', text: 'First' },
    { depth: 3, slug: 'detail', text: 'Detail' },
    { depth: 4, slug: 'aside', text: 'Aside' },
    { depth: 2, slug: 'second', text: 'Second' },
  ]

  it('should keep only h2 and h3, in document order', () => {
    expect(selectTocHeadings(headings).map((heading) => heading.slug)).toEqual([
      'first',
      'detail',
      'second',
    ])
  })

  it('should return an empty array when the page has no h2/h3', () => {
    expect(selectTocHeadings([{ depth: 1, slug: 'title', text: 'Title' }])).toEqual([])
    expect(selectTocHeadings([])).toEqual([])
  })
})

describe('tocActiveLine', () => {
  /* 3000px の中身を 800px の画面で読む。判定線は上端 32px から下端 800px まで動く */
  const page = { viewportHeight: 800, scrollHeight: 3000, offset: 32 }

  it('should stay at the heading offset until the last screenful', () => {
    expect(tocActiveLine({ ...page, scrollY: 0 })).toBe(32)
    expect(tocActiveLine({ ...page, scrollY: 1432 })).toBe(32)
  })

  it('should slide to the bottom of the viewport as the scroll runs out', () => {
    expect(tocActiveLine({ ...page, scrollY: 1816 })).toBe(416)
    expect(tocActiveLine({ ...page, scrollY: 2200 })).toBe(800)
  })

  it('should keep the line inside the viewport when scrolled past the end', () => {
    expect(tocActiveLine({ ...page, scrollY: 2600 })).toBe(800)
  })

  it('should spread the slide over the whole scroll range on a barely scrollable page', () => {
    const short = { viewportHeight: 800, scrollHeight: 1000, offset: 32 }
    expect(tocActiveLine({ ...short, scrollY: 0 })).toBe(32)
    expect(tocActiveLine({ ...short, scrollY: 100 })).toBe(416)
    expect(tocActiveLine({ ...short, scrollY: 200 })).toBe(800)
  })

  it('should not move the line on a page that cannot scroll', () => {
    const still = { scrollY: 0, viewportHeight: 800, scrollHeight: 800, offset: 32 }
    expect(tocActiveLine(still)).toBe(32)
  })
})
