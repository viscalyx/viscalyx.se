import { getTranslations } from 'next-intl/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createSlug,
  createSlugId,
  ensureUniqueId,
  extractCleanText,
  extractTableOfContentsClient,
  generateFallbackId,
  type SlugOptions,
} from '@/lib/slug-utils-client'
import {
  addHeadingIds,
  extractTableOfContentsServer,
} from '@/lib/slug-utils-server'

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(
    async () => (key: string, values?: { heading?: string }) => {
      const heading = values?.heading ?? ''
      if (key === 'accessibility.anchorLink.ariaLabel') {
        return `Link to section: ${heading}`
      }
      if (key === 'accessibility.anchorLink.title') {
        return `Copy link to section: ${heading}`
      }
      return key
    },
  ),
}))

const mockedGetTranslations = vi.mocked(getTranslations)

function extractTableOfContents(
  htmlContent: string,
  options: SlugOptions = {},
) {
  return typeof window === 'undefined'
    ? extractTableOfContentsServer(htmlContent, options)
    : extractTableOfContentsClient(htmlContent, options)
}

describe('slug-utils', () => {
  beforeEach(() => {
    mockedGetTranslations.mockClear()
  })

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
        'Nested Content',
      )
    })

    it('trims whitespace', () => {
      expect(extractCleanText('  <p>Text</p>  ')).toBe('Text')
    })

    it('decodes valid numeric and hex HTML entities', () => {
      expect(extractCleanText('&#65;&#66;')).toBe('AB')
      expect(extractCleanText('&#x41;&#x42;')).toBe('AB')
    })

    it('preserves out-of-range hex entities instead of crashing', () => {
      // sanitize-html replaces out-of-range entities with U+FFFD before our decoder
      expect(extractCleanText('&#xDEADBEEF;')).toBe('\uFFFD')
    })

    it('preserves surrogate code point entities instead of crashing', () => {
      // sanitize-html replaces surrogates with U+FFFD before our decoder
      expect(extractCleanText('&#xD800;')).toBe('\uFFFD')
      expect(extractCleanText('&#55296;')).toBe('\uFFFD')
    })

    it('decodes common named entities', () => {
      expect(extractCleanText('&quot;a&amp;b&lt;c&gt;&quot;')).toBe('"a&b<c>"')
    })
  })

  describe('generateFallbackId', () => {
    it('generates a fallback ID with level', () => {
      const id = generateFallbackId(2)
      expect(id).toMatch(/^heading-2-[a-z0-9]+$/)
    })

    it('returns deterministic IDs for the same inputs', () => {
      const id1 = generateFallbackId(2, 'some content')
      const id2 = generateFallbackId(2, 'some content')
      expect(id1).toBe(id2)
    })

    it('returns different IDs for different levels', () => {
      const id1 = generateFallbackId(2, 'content')
      const id2 = generateFallbackId(3, 'content')
      expect(id1).not.toBe(id2)
    })

    it('returns different IDs for different content', () => {
      const id1 = generateFallbackId(2, 'content-a')
      const id2 = generateFallbackId(2, 'content-b')
      expect(id1).not.toBe(id2)
    })

    it('works without content parameter', () => {
      const id = generateFallbackId(2)
      expect(id).toMatch(/^heading-2-[a-z0-9]+$/)
      // Deterministic — same call gives same result
      expect(generateFallbackId(2)).toBe(id)
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
      // Deterministic — same inputs give same result
      expect(createSlugId('', 2)).toBe(id)
    })

    it('handles HTML content', () => {
      expect(createSlugId('<strong>Bold</strong> Section', 2)).toBe(
        'bold-section',
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

  describe('extractTableOfContentsClient', () => {
    it('extracts headings and creates unique IDs for duplicates', () => {
      const html = `
        <h2>Intro</h2>
        <h3>Details</h3>
        <h2>Intro</h2>
      `

      const toc = extractTableOfContentsClient(html)

      expect(toc).toEqual([
        { id: 'intro', level: 2, text: 'Intro' },
        { id: 'details', level: 3, text: 'Details' },
        { id: 'intro-1', level: 2, text: 'Intro' },
      ])
    })
  })

  describe('addHeadingIds', () => {
    it('adds IDs to headings with default accessibility labels', async () => {
      const html = '<h2>My Section</h2>'
      const result = await addHeadingIds(html)

      expect(result).toContain('id="my-section"')
      expect(result).toContain('class="heading-with-anchor"')
      expect(result).toContain('href="#my-section"')
      expect(result).toContain('aria-label="Link to section: My Section"')
      expect(result).toContain('title="Copy link to section: My Section"')
      expect(mockedGetTranslations).toHaveBeenCalledWith({
        locale: 'en',
        namespace: 'blog',
      })
    })

    it('uses localized accessibility labels when translation function provided', async () => {
      const html = '<h2>My Section</h2>'
      const mockTranslate = vi
        .fn()
        .mockReturnValueOnce('Länk till sektion: My Section')
        .mockReturnValueOnce('Kopiera länk till sektion: My Section')

      const result = await addHeadingIds(html, {}, mockTranslate)

      expect(mockTranslate).toHaveBeenCalledWith(
        'accessibility.anchorLink.ariaLabel',
        { heading: 'My Section' },
      )
      expect(mockTranslate).toHaveBeenCalledWith(
        'accessibility.anchorLink.title',
        { heading: 'My Section' },
      )
      expect(result).toContain('aria-label="Länk till sektion: My Section"')
      expect(result).toContain('title="Kopiera länk till sektion: My Section"')
      expect(mockedGetTranslations).not.toHaveBeenCalled()
    })

    it('handles duplicate headings with unique IDs', async () => {
      const html = `
        <h2>Installation</h2>
        <h3>Prerequisites</h3>
        <h2>Installation</h2>
        <h3>Prerequisites</h3>
      `
      const result = await addHeadingIds(html)

      expect(result).toContain('id="installation"')
      expect(result).toContain('id="prerequisites"')
      expect(result).toContain('id="installation-1"')
      expect(result).toContain('id="prerequisites-1"')
      expect(result).toContain('href="#installation"')
      expect(result).toContain('href="#prerequisites"')
      expect(result).toContain('href="#installation-1"')
      expect(result).toContain('href="#prerequisites-1"')
    })

    it('preserves existing attributes and merges class', async () => {
      const html = '<h2 class="custom-class">My Section</h2>'
      const result = await addHeadingIds(html)

      // Should merge heading-with-anchor into the existing class, not create a duplicate class attr
      expect(result).toContain('class="custom-class heading-with-anchor"')
      expect(result).toContain('id="my-section"')
      // Ensure there's only one class attribute on the heading tag itself
      const classCount = (result.match(/\bclass\s*=/g) || []).length
      expect(classCount).toBe(3) // heading, anchor link, SVG icon
    })

    it('does not override existing ID attributes', async () => {
      const html = '<h2 id="existing-id">My Section</h2>'
      const result = await addHeadingIds(html)

      expect(result).toContain('id="existing-id"')
      expect(result).not.toContain('id="my-section"')
      expect(result).toContain('href="#existing-id"')
      expect(result).not.toContain('href="#my-section"')
    })

    it('reserves existing heading IDs to avoid generated collisions', async () => {
      const html = '<h2 id="setup">Setup</h2><h2>Setup</h2>'
      const result = await addHeadingIds(html)

      expect(result).toContain('<h2 id="setup" class="heading-with-anchor">')
      expect(result).toContain('href="#setup"')
      expect(result).toContain('<h2 id="setup-1" class="heading-with-anchor">')
      expect(result).toContain('href="#setup-1"')
    })

    it('escapes existing IDs before interpolating anchor href attributes', async () => {
      const html = `<h2 id="existing'id">My Section</h2>`
      const result = await addHeadingIds(html)

      expect(result).toContain('href="#&quot;existing&#x27;id&quot;"')
      expect(result).not.toContain(`href="#existing'id"`)
    })

    it('handles complex HTML content in headings', async () => {
      const html = '<h2><code>API</code> <strong>Reference</strong></h2>'
      const result = await addHeadingIds(html)

      expect(result).toContain('id="api-reference"')
      expect(result).toContain('href="#api-reference"')
    })

    it('escapes double quotes in heading text for aria-label and title', async () => {
      const html = '<h2>Config "key=value" pairs</h2>'
      const result = await addHeadingIds(html)

      expect(result).toContain(
        'aria-label="Link to section: Config &quot;key=value&quot; pairs"',
      )
      expect(result).toContain(
        'title="Copy link to section: Config &quot;key=value&quot; pairs"',
      )
    })

    it('escapes angle brackets and ampersands in heading text', async () => {
      // extractCleanText decodes HTML entities first, so "&amp;" becomes "&",
      // then escapeHtmlAttr re-encodes it once → "&amp;" (no double-encoding)
      const html = '<h2>A &amp; B</h2>'
      const result = await addHeadingIds(html)

      expect(result).toContain('aria-label="Link to section: A &amp; B"')
      expect(result).toContain('title="Copy link to section: A &amp; B"')
      // Verify the escaping prevents attribute breakout
      expect(result).not.toMatch(/aria-label="[^"]*</)
    })

    it('escapes quotes in translated strings from translateFn', async () => {
      const html = '<h2>Section</h2>'
      const mockTranslate = vi
        .fn()
        .mockReturnValueOnce('Länk till "Section"')
        .mockReturnValueOnce('Kopiera länk till "Section"')

      const result = await addHeadingIds(html, {}, mockTranslate)

      expect(result).toContain('aria-label="Länk till &quot;Section&quot;"')
      expect(result).toContain('title="Kopiera länk till &quot;Section&quot;"')
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

  describe('Anchor link URL validation', () => {
    it('should create valid anchor URLs', () => {
      const headings = [
        'Introduction',
        'Core Principles',
        'Best Practices & Guidelines',
        "What's Next?",
      ]

      headings.forEach(heading => {
        const slug = createSlug(heading)
        const url = `#${slug}`

        // Valid anchor URLs should:
        // - Start with #
        // - Contain only lowercase letters, numbers, and special characters allowed by strict: false
        // - Be URL-safe
        expect(url).toMatch(/^#[a-z0-9&@$%*!?'".+-]+([a-z0-9&@$%*!?'".+-]*)?$/)
      })
    })
  })

  describe('Real-world blog content', () => {
    it('should handle typical blog post structure', () => {
      const blogContent = `
        <h1>Infrastructure as Code Best Practices</h1>
        <h2>Why Infrastructure as Code Matters</h2>
        <p>Traditional infrastructure management is often manual...</p>
        <h2>Core Principles</h2>
        <h3>1. Declarative Configuration</h3>
        <p>Define the desired state...</p>
        <h3>2. Immutable Infrastructure</h3>
        <p>Create new infrastructure...</p>
        <h2>Implementation Strategies</h2>
        <h3>Version Control</h3>
        <h4>Branching Strategy</h4>
        <h2>Conclusion</h2>
      `

      const toc = extractTableOfContents(blogContent)

      expect(toc).toHaveLength(8)

      const expectedStructure = [
        { level: 2, id: 'why-infrastructure-as-code-matters' },
        { level: 2, id: 'core-principles' },
        { level: 3, id: '1.-declarative-configuration' },
        { level: 3, id: '2.-immutable-infrastructure' },
        { level: 2, id: 'implementation-strategies' },
        { level: 3, id: 'version-control' },
        { level: 4, id: 'branching-strategy' },
        { level: 2, id: 'conclusion' },
      ]

      expectedStructure.forEach((expected, index) => {
        expect(toc[index].level).toBe(expected.level)
        expect(toc[index].id).toBe(expected.id)
      })
    })
  })

  describe('extractTableOfContents', () => {
    it('uses server-side implementation when window is undefined', () => {
      // Mock server environment by setting global.window to undefined
      const originalWindow = global.window
      // @ts-expect-error - Intentionally setting window to undefined to simulate server
      global.window = undefined

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
