import {
  createSlug,
  createSlugId,
  extractCleanText,
  extractTableOfContents,
  generateFallbackId,
} from '@/lib/slug-utils'
import { describe, expect, it } from 'vitest'

/**
 * Tests for blog anchor link functionality
 */

describe('Blog Anchor Links', () => {
  describe('createSlug function', () => {
    it('should convert text to URL-friendly slugs', () => {
      expect(createSlug('Core Principles')).toBe('core-principles')
      expect(createSlug('Why Infrastructure as Code Matters')).toBe(
        'why-infrastructure-as-code-matters'
      )
      expect(createSlug('1. Declarative Configuration')).toBe(
        '1.-declarative-configuration'
      )
      expect(createSlug('Best Practices & Guidelines')).toBe(
        'best-practices-and-guidelines'
      )
    })

    it('should handle special characters', () => {
      expect(createSlug("What's New?")).toBe("what's-new")
      expect(createSlug('C# & .NET Development')).toBe('c-and-.net-development')
      expect(createSlug('API/REST Endpoints')).toBe('apirest-endpoints') // cSpell: disable-line
    })

    it('should differentiate between similar programming language names', () => {
      expect(createSlug('C++ Example')).toBe('c++-example')
      expect(createSlug('C# Example')).toBe('c-example')
      expect(createSlug('.NET Framework')).toBe('.net-framework')
    })

    it('should handle various special characters with strict: false', () => {
      expect(createSlug('Cost: $100')).toBe('cost:-dollar100')
      expect(createSlug('Rate: 5%')).toBe('rate:-5percent')
      expect(createSlug('Email: john@example.com')).toBe(
        // cSpell: disable-next-line
        'email:-john@example.com'
      )
      expect(createSlug('Important!')).toBe('important!')
      expect(createSlug('Five * Stars')).toBe('five-*-stars')
    })

    it('should handle edge cases', () => {
      expect(createSlug('')).toBe('')
      expect(createSlug('   ')).toBe('')
      expect(createSlug('---')).toBe('')
      expect(createSlug('Multiple   Spaces')).toBe('multiple-spaces')
    })

    it('should handle non-English characters gracefully', () => {
      // cSpell: disable-next-line
      expect(createSlug('Café & Naïve Résumé')).toBe('cafe-and-naive-resume')
    })
  })

  describe('createSlugId function', () => {
    it('should create slug IDs with fallback for empty content', () => {
      expect(createSlugId('Core Principles', 2)).toBe('core-principles')
      expect(createSlugId('', 2)).toMatch(/^heading-2-[a-z0-9]+$/)
      expect(createSlugId('   ', 3)).toMatch(/^heading-3-[a-z0-9]+$/)
    })
  })

  describe('extractCleanText function', () => {
    it('should extract clean text from HTML', () => {
      expect(extractCleanText('<strong>Bold Text</strong>')).toBe('Bold Text')
      expect(extractCleanText('<em>Italic</em> and <code>code</code>')).toBe(
        'Italic and code'
      )
      expect(extractCleanText('  Plain text  ')).toBe('Plain text')
    })
  })

  describe('generateFallbackId function', () => {
    it('should generate unique fallback IDs', () => {
      const id1 = generateFallbackId(2)
      const id2 = generateFallbackId(2)
      expect(id1).toMatch(/^heading-2-[a-z0-9]+$/)
      expect(id2).toMatch(/^heading-2-[a-z0-9]+$/)
      expect(id1).not.toBe(id2) // Should be unique
    })
  })

  describe('Table of Contents extraction', () => {
    it('should extract headings from HTML content', () => {
      const htmlContent = `
        <h1>Main Title</h1>
        <h2>Introduction</h2>
        <p>Some content</p>
        <h3>Subsection</h3>
        <h2>Conclusion</h2>
      `

      const toc = extractTableOfContents(htmlContent)

      expect(toc).toHaveLength(3) // Should skip H1
      expect(toc[0]).toEqual({
        id: 'introduction',
        text: 'Introduction',
        level: 2,
      })
      expect(toc[1]).toEqual({
        id: 'subsection',
        text: 'Subsection',
        level: 3,
      })
      expect(toc[2]).toEqual({
        id: 'conclusion',
        text: 'Conclusion',
        level: 2,
      })
    })

    it('should handle HTML tags within headings', () => {
      const htmlContent = `
        <h2>Getting Started with <strong>PowerShell</strong></h2>
        <h3><em>Advanced</em> Configuration</h3>
      `

      const toc = extractTableOfContents(htmlContent)

      expect(toc[0]).toEqual({
        id: 'getting-started-with-powershell',
        text: 'Getting Started with PowerShell',
        level: 2,
      })
      expect(toc[1]).toEqual({
        id: 'advanced-configuration',
        text: 'Advanced Configuration',
        level: 3,
      })
    })

    it('should generate fallback IDs for empty headings', () => {
      const htmlContent = '<h2></h2>'
      const toc = extractTableOfContents(htmlContent)

      expect(toc).toHaveLength(1)
      expect(toc[0].id).toMatch(/^heading-2-[a-z0-9]+$/)
      expect(toc[0].text).toBe('')
      expect(toc[0].level).toBe(2)
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

      // Check specific structure
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
})
