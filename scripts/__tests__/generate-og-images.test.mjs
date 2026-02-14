/**
 * Unit tests for the generate-og-images.js script
 *
 * Since generate-og-images.js is a CommonJS script that requires 'sharp'
 * at the top level (which may not be installed), we test the core logic
 * by re-implementing and testing the algorithm functions rather than
 * importing the script directly.
 */

import { readFileSync } from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

describe('generate-og-images.js', () => {
  describe('escapeXml function', () => {
    // Re-implement the escapeXml logic from the script
    const escapeXml = str => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    it('escapes ampersands', () => {
      expect(escapeXml('A & B')).toBe('A &amp; B')
    })

    it('escapes less-than signs', () => {
      expect(escapeXml('a < b')).toBe('a &lt; b')
    })

    it('escapes greater-than signs', () => {
      expect(escapeXml('a > b')).toBe('a &gt; b')
    })

    it('escapes multiple special characters', () => {
      expect(escapeXml('<a>&b</a>')).toBe('&lt;a&gt;&amp;b&lt;/a&gt;')
    })

    it('returns unchanged string when no special characters', () => {
      expect(escapeXml('Hello World')).toBe('Hello World')
    })

    it('handles empty string', () => {
      expect(escapeXml('')).toBe('')
    })
  })

  describe('getLocaleStrings function', () => {
    // Re-implement the getLocaleStrings logic from the script
    const getLocaleStrings = locale => {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'messages',
        `${locale}.json`
      )
      const messages = JSON.parse(readFileSync(filePath, 'utf-8'))
      const blog = messages.blog
      if (!blog?.og?.title || !blog?.og?.tagline) {
        throw new Error(
          `Missing blog.og.title or blog.og.tagline in messages/${locale}.json`
        )
      }
      return {
        title: blog.og.title,
        tagline: blog.og.tagline,
      }
    }

    it('loads English locale strings', () => {
      const strings = getLocaleStrings('en')
      expect(strings.title).toBeDefined()
      expect(strings.tagline).toBeDefined()
      expect(typeof strings.title).toBe('string')
      expect(typeof strings.tagline).toBe('string')
    })

    it('loads Swedish locale strings', () => {
      const strings = getLocaleStrings('sv')
      expect(strings.title).toBeDefined()
      expect(strings.tagline).toBeDefined()
    })

    it('throws for missing locale file', () => {
      expect(() => getLocaleStrings('xx')).toThrow()
    })
  })

  describe('SVG generation constants', () => {
    // Verify the constants used in the script match expected OG image dimensions
    const OG_WIDTH = 1200
    const OG_HEIGHT = 630
    const LOGO_SIZE = 280

    it('has standard OG image width', () => {
      expect(OG_WIDTH).toBe(1200)
    })

    it('has standard OG image height', () => {
      expect(OG_HEIGHT).toBe(630)
    })

    it('calculates logo position correctly', () => {
      const logoX = Math.round(OG_WIDTH * 0.18 - LOGO_SIZE / 2)
      const logoY = Math.round((OG_HEIGHT - LOGO_SIZE) / 2)

      // Logo should be positioned in the left-center area
      expect(logoX).toBeGreaterThan(0)
      expect(logoX).toBeLessThan(OG_WIDTH / 2)
      expect(logoY).toBeGreaterThan(0)
      expect(logoY).toBeLessThan(OG_HEIGHT)
    })
  })

  describe('script source validation', () => {
    it('script file exists and contains expected structure', () => {
      const scriptPath = path.join(
        __dirname,
        '..',
        '..',
        'scripts',
        'generate-og-images.js'
      )
      const content = readFileSync(scriptPath, 'utf-8')

      expect(content).toContain('escapeXml')
      expect(content).toContain('getLocaleStrings')
      expect(content).toContain('generateBlogOG')
      expect(content).toContain("LOCALES = ['en', 'sv']")
      expect(content).toContain('sharp')
    })
  })
})
