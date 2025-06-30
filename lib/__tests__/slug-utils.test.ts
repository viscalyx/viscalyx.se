import { describe, expect, it, vi } from 'vitest'
import {
  addHeadingIds,
  createSlug,
  createSlugId,
  ensureUniqueId,
  extractCleanText,
  extractTableOfContents,
  extractTableOfContentsClient,
  extractTableOfContentsServer,
  generateFallbackId,
} from '../slug-utils'

describe('slug-utils', () => {
  describe('createSlug', () => {
    it('creates a basic slug from text', () => {
      expect(createSlug('Hello World')).toBe('hello-world')
    })

    it('handles special characters', () => {
      expect(createSlug('Hello, World!')).toBe('hello-world!')
    })

    it('respects custom options', () => {
      expect(createSlug('Hello World', { lower: false })).toBe('Hello-World')
    })
  })

  describe('extractCleanText', () => {
    it('removes HTML tags', () => {
      expect(extractCleanText('<strong>Bold Text</strong>')).toBe('Bold Text')
    })

    it('handles nested HTML', () => {
      expect(extractCleanText('<div><span>Nested</span> Content</div>')).toBe(
        'Nested Content'
      )
    })

    it('trims whitespace', () => {
      expect(extractCleanText('  <p>Text</p>  ')).toBe('Text')
    })
  })

  describe('generateFallbackId', () => {
    it('generates a fallback ID with level', () => {
      const id = generateFallbackId(2)
      expect(id).toMatch(/^heading-2-[a-z0-9]+$/)
    })

    it('generates unique IDs on multiple calls', () => {
      const id1 = generateFallbackId(2)
      const id2 = generateFallbackId(2)
      expect(id1).not.toBe(id2)
    })
  })

  describe('ensureUniqueId', () => {
    it('returns the base ID if not used', () => {
      const usedIds = new Set<string>()
      expect(ensureUniqueId('my-section', usedIds)).toBe('my-section')
      expect(usedIds.has('my-section')).toBe(true)
    })

    it('adds counter for duplicate IDs', () => {
      const usedIds = new Set<string>(['my-section'])
      expect(ensureUniqueId('my-section', usedIds)).toBe('my-section-1')
      expect(usedIds.has('my-section-1')).toBe(true)
    })

    it('increments counter for multiple duplicates', () => {
      const usedIds = new Set<string>(['my-section', 'my-section-1'])
      expect(ensureUniqueId('my-section', usedIds)).toBe('my-section-2')
      expect(usedIds.has('my-section-2')).toBe(true)
    })

    it('handles multiple sequential duplicates', () => {
      const usedIds = new Set<string>()

      expect(ensureUniqueId('test', usedIds)).toBe('test')
      expect(ensureUniqueId('test', usedIds)).toBe('test-1')
      expect(ensureUniqueId('test', usedIds)).toBe('test-2')
      expect(ensureUniqueId('test', usedIds)).toBe('test-3')
    })
  })

  describe('createSlugId', () => {
    it('creates a slug ID from text', () => {
      expect(createSlugId('My Section', 2)).toBe('my-section')
    })

    it('preserves special characters with strict: false', () => {
      expect(createSlugId('Hello! World?', 2)).toBe('hello!-world')
    })

    it('generates fallback for empty text', () => {
      const id = createSlugId('', 2)
      expect(id).toMatch(/^heading-2-[a-z0-9]+$/)
    })

    it('handles HTML content', () => {
      expect(createSlugId('<strong>Bold</strong> Section', 2)).toBe(
        'bold-section'
      )
    })
  })

  describe('extractTableOfContentsServer', () => {
    it('extracts headings from HTML content', () => {
      const html = `
        <h2>Introduction</h2>
        <h3>Overview</h3>
        <h2>Conclusion</h2>
      `
      const toc = extractTableOfContentsServer(html)

      expect(toc).toHaveLength(3)
      expect(toc[0]).toEqual({
        id: 'introduction',
        text: 'Introduction',
        level: 2,
      })
      expect(toc[1]).toEqual({ id: 'overview', text: 'Overview', level: 3 })
      expect(toc[2]).toEqual({ id: 'conclusion', text: 'Conclusion', level: 2 })
    })

    it('handles duplicate section names with unique IDs', () => {
      const html = `
        <h2>Setup</h2>
        <h3>Configuration</h3>
        <h2>Setup</h2>
        <h3>Configuration</h3>
      `
      const toc = extractTableOfContentsServer(html)

      expect(toc).toHaveLength(4)
      expect(toc[0]).toEqual({ id: 'setup', text: 'Setup', level: 2 })
      expect(toc[1]).toEqual({
        id: 'configuration',
        text: 'Configuration',
        level: 3,
      })
      expect(toc[2]).toEqual({ id: 'setup-1', text: 'Setup', level: 2 })
      expect(toc[3]).toEqual({
        id: 'configuration-1',
        text: 'Configuration',
        level: 3,
      })
    })

    it('handles HTML content in headings', () => {
      const html = `
        <h2><strong>Bold</strong> Section</h2>
        <h3>Normal Section</h3>
      `
      const toc = extractTableOfContentsServer(html)

      expect(toc).toHaveLength(2)
      expect(toc[0]).toEqual({
        id: 'bold-section',
        text: 'Bold Section',
        level: 2,
      })
      expect(toc[1]).toEqual({
        id: 'normal-section',
        text: 'Normal Section',
        level: 3,
      })
    })
  })

  describe('addHeadingIds', () => {
    it('adds IDs to headings with default accessibility labels', () => {
      const html = '<h2>My Section</h2>'
      const result = addHeadingIds(html)

      expect(result).toContain('id="my-section"')
      expect(result).toContain('class="heading-with-anchor"')
      expect(result).toContain('href="#my-section"')
      expect(result).toContain('aria-label="Link to section: My Section"')
      expect(result).toContain('title="Copy link to section: My Section"')
    })

    it('uses localized accessibility labels when translation function provided', () => {
      const html = '<h2>My Section</h2>'
      const mockTranslate = vi
        .fn()
        .mockReturnValueOnce('Länk till sektion: My Section')
        .mockReturnValueOnce('Kopiera länk till sektion: My Section')

      const result = addHeadingIds(html, {}, mockTranslate)

      expect(mockTranslate).toHaveBeenCalledWith(
        'accessibility.anchorLink.ariaLabel',
        { heading: 'My Section' }
      )
      expect(mockTranslate).toHaveBeenCalledWith(
        'accessibility.anchorLink.title',
        { heading: 'My Section' }
      )
      expect(result).toContain('aria-label="Länk till sektion: My Section"')
      expect(result).toContain('title="Kopiera länk till sektion: My Section"')
    })

    it('handles duplicate headings with unique IDs', () => {
      const html = `
        <h2>Installation</h2>
        <h3>Prerequisites</h3>
        <h2>Installation</h2>
        <h3>Prerequisites</h3>
      `
      const result = addHeadingIds(html)

      expect(result).toContain('id="installation"')
      expect(result).toContain('id="prerequisites"')
      expect(result).toContain('id="installation-1"')
      expect(result).toContain('id="prerequisites-1"')
      expect(result).toContain('href="#installation"')
      expect(result).toContain('href="#prerequisites"')
      expect(result).toContain('href="#installation-1"')
      expect(result).toContain('href="#prerequisites-1"')
    })

    it('preserves existing attributes', () => {
      const html = '<h2 class="custom-class">My Section</h2>'
      const result = addHeadingIds(html)

      expect(result).toContain('class="custom-class"')
      expect(result).toContain('id="my-section"')
    })

    it('does not override existing ID attributes', () => {
      const html = '<h2 id="existing-id">My Section</h2>'
      const result = addHeadingIds(html)

      expect(result).toContain('id="existing-id"')
      expect(result).not.toContain('id="my-section"')
    })

    it('handles complex HTML content in headings', () => {
      const html = '<h2><code>API</code> <strong>Reference</strong></h2>'
      const result = addHeadingIds(html)

      expect(result).toContain('id="api-reference"')
      expect(result).toContain('href="#api-reference"')
    })
  })

  describe('extractTableOfContentsClient', () => {
    // Note: These tests would need a DOM environment to run properly
    // They are included for completeness but may need to be skipped in some test environments

    it('extracts headings using DOM parsing', () => {
      // This test requires a DOM environment
      if (typeof DOMParser === 'undefined') {
        return // Skip test in non-DOM environment
      }

      const html = `
        <div>
          <h2>Section One</h2>
          <h3>Subsection</h3>
          <h2>Section Two</h2>
        </div>
      `
      const toc = extractTableOfContentsClient(html)

      expect(toc).toHaveLength(3)
      expect(toc[0]).toEqual({
        id: 'section-one',
        text: 'Section One',
        level: 2,
      })
      expect(toc[1]).toEqual({ id: 'subsection', text: 'Subsection', level: 3 })
      expect(toc[2]).toEqual({
        id: 'section-two',
        text: 'Section Two',
        level: 2,
      })
    })

    it('handles duplicate section names with unique IDs in DOM parsing', () => {
      if (typeof DOMParser === 'undefined') {
        return // Skip test in non-DOM environment
      }

      const html = `
        <div>
          <h2>Setup</h2>
          <h2>Setup</h2>
        </div>
      `
      const toc = extractTableOfContentsClient(html)

      expect(toc).toHaveLength(2)
      expect(toc[0]).toEqual({ id: 'setup', text: 'Setup', level: 2 })
      expect(toc[1]).toEqual({ id: 'setup-1', text: 'Setup', level: 2 })
    })
  })

  describe('extractTableOfContents', () => {
    it('uses server-side implementation when window is undefined', () => {
      // Mock server environment by deleting global.window
      const originalWindow = global.window
      // @ts-expect-error - Intentionally deleting window to simulate server
      delete global.window

      const html = `
        <h2>Server Test</h2>
        <h3>Server Implementation</h3>
        <h2>Another Section</h2>
      `

      const toc = extractTableOfContents(html)

      expect(toc).toHaveLength(3)
      expect(toc[0]).toEqual({
        id: 'server-test',
        text: 'Server Test',
        level: 2,
      })
      expect(toc[1]).toEqual({
        id: 'server-implementation',
        text: 'Server Implementation',
        level: 3,
      })
      expect(toc[2]).toEqual({
        id: 'another-section',
        text: 'Another Section',
        level: 2,
      })

      // Restore original window
      global.window = originalWindow
    })

    it('uses server-side implementation with custom options when window is undefined', () => {
      // Mock server environment by setting global.window to undefined
      const originalWindow = global.window
      // @ts-expect-error - Intentionally setting window to undefined to simulate server
      global.window = undefined

      const html = `
        <h2>Custom Options Test</h2>
        <h3>With Options</h3>
      `

      const options = { lower: false }
      const toc = extractTableOfContents(html, options)

      expect(toc).toHaveLength(2)
      expect(toc[0]).toEqual({
        id: 'Custom-Options-Test',
        text: 'Custom Options Test',
        level: 2,
      })
      expect(toc[1]).toEqual({
        id: 'With-Options',
        text: 'With Options',
        level: 3,
      })

      // Restore original window
      global.window = originalWindow
    })
  })
})
