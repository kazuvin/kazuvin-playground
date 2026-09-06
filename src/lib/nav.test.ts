import { describe, expect, it } from 'vitest'
import { isActiveNavItem, selectTocHeadings } from './nav'
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
