/**
 * Unit tests for the remark-floating-images plugin
 *
 * This test suite verifies that the plugin correctly parses HTML img tags
 * and converts them to proper markdown image nodes with appropriate styling.
 *
 * The plugin replaces fragile regex-based HTML parsing with a robust HTML parser
 * to handle edge cases like nested quotes, unusual spacing, and various HTML formats.
 *
 * Test Coverage:
 * - Basic functionality (parsing src, alt, style attributes)
 * - Edge cases and robustness (nested quotes, mixed quotes, unusual spacing)
 * - Floating class detection (detecting float styles and adding CSS classes)
 * - Error handling (malformed HTML, missing attributes, non-img content)
 * - Complex scenarios (multiple images, DOM tree preservation)
 * - Performance edge cases (long attributes, unicode characters)
 */

import { createRequire } from 'node:module'
import { beforeEach, describe, expect, it } from 'vitest'

// Use createRequire to import CommonJS module in ESM test environment
// The remark-floating-images plugin uses CommonJS (module.exports)
// while our test files use ESM (.mjs extension)
const require = createRequire(import.meta.url)
const remarkFloatingImages = require('../plugins/remark-floating-images')

describe('remark-floating-images plugin', () => {
  let plugin

  beforeEach(() => {
    plugin = remarkFloatingImages()
  })

  const createTestTree = htmlContent => ({
    type: 'root',
    children: [
      {
        type: 'html',
        value: htmlContent,
      },
    ],
  })

  const createExpectedImageNode = (
    src,
    alt,
    style,
    shouldHaveFloatingClass = false
  ) => ({
    type: 'paragraph',
    children: [
      {
        type: 'image',
        url: src,
        alt: alt,
        data: {
          hProperties: {
            style: style,
            className: shouldHaveFloatingClass ? ['floating-image'] : undefined,
          },
        },
      },
    ],
  })

  describe('basic functionality', () => {
    it('should parse simple img tag without style', () => {
      const tree = createTestTree('<img src="/test.jpg" alt="Test image">')
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode('/test.jpg', 'Test image', '')
      )
    })

    it('should parse img tag with style attribute', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="Test image" style="width: 100px;">'
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode('/test.jpg', 'Test image', 'width: 100px;')
      )
    })

    it('should parse img tag with floating style and add floating-image class', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="Test image" style="float: left; margin: 10px;">'
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode(
          '/test.jpg',
          'Test image',
          'float: left; margin: 10px;',
          true
        )
      )
    })

    it('should handle missing alt attribute', () => {
      const tree = createTestTree('<img src="/test.jpg">')
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode('/test.jpg', '', '')
      )
    })

    it('should handle empty alt attribute', () => {
      const tree = createTestTree('<img src="/test.jpg" alt="">')
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode('/test.jpg', '', '')
      )
    })
  })

  describe('edge cases and robustness', () => {
    it('should handle img tag with nested quotes in alt text', () => {
      const tree = createTestTree(
        `<img src="/test.jpg" alt="Image with 'nested' quotes">`
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode('/test.jpg', "Image with 'nested' quotes", '')
      )
    })

    it('should handle img tag with mixed quote styles', () => {
      const tree = createTestTree(
        `<img src='/test.jpg' alt="Mixed quotes" style='float: right;'>`
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode(
          '/test.jpg',
          'Mixed quotes',
          'float: right;',
          true
        )
      )
    })

    it('should handle img tag with unusual spacing', () => {
      const tree = createTestTree(
        `<img   src = "/test.jpg"    alt="Spaced attributes"   style  =  "float: left;"  >`
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode(
          '/test.jpg',
          'Spaced attributes',
          'float: left;',
          true
        )
      )
    })

    it('should handle self-closing img tag', () => {
      const tree = createTestTree('<img src="/test.jpg" alt="Self closing" />')
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode('/test.jpg', 'Self closing', '')
      )
    })

    it('should handle img tag with additional attributes', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="Extra attributes" style="float: left;" width="100" height="200" class="test">'
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode(
          '/test.jpg',
          'Extra attributes',
          'float: left;',
          true
        )
      )
    })

    it('should handle img tag with data attributes', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="With data" style="float: right;" data-test="value" data-another=\'value2\'>'
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode('/test.jpg', 'With data', 'float: right;', true)
      )
    })
  })

  describe('floating class detection', () => {
    it('should add floating-image class for float: left', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="Float left" style="float: left;">'
      )
      plugin(tree)

      expect(tree.children[0].children[0].data.hProperties.className).toEqual([
        'floating-image',
      ])
    })

    it('should add floating-image class for float: right', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="Float right" style="float: right;">'
      )
      plugin(tree)

      expect(tree.children[0].children[0].data.hProperties.className).toEqual([
        'floating-image',
      ])
    })

    it('should add floating-image class for float with additional styles', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="Float with more" style="float: left; margin: 10px; border: 1px solid #ccc;">'
      )
      plugin(tree)

      expect(tree.children[0].children[0].data.hProperties.className).toEqual([
        'floating-image',
      ])
    })

    it('should not add floating-image class when no float style present', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="No float" style="margin: 10px;">'
      )
      plugin(tree)

      expect(
        tree.children[0].children[0].data.hProperties.className
      ).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should ignore non-img HTML content', () => {
      const originalContent = '<div>Not an image</div>'
      const tree = createTestTree(originalContent)
      plugin(tree)

      // Should remain unchanged
      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toBe(originalContent)
    })

    it('should ignore img tag without src attribute', () => {
      const originalContent = '<img alt="No source">'
      const tree = createTestTree(originalContent)
      plugin(tree)

      // Should remain unchanged
      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toBe(originalContent)
    })

    it('should handle malformed HTML gracefully', () => {
      const originalContent = '<img src="/test.jpg" alt="Malformed'
      const tree = createTestTree(originalContent)

      // Should not throw an error
      expect(() => plugin(tree)).not.toThrow()

      // Should either process correctly or leave unchanged
      expect(tree.children[0]).toBeDefined()
    })

    it('should handle empty HTML content', () => {
      const tree = createTestTree('')

      expect(() => plugin(tree)).not.toThrow()
      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toBe('')
    })
  })

  describe('complex scenarios', () => {
    it('should handle multiple img tags in sequence', () => {
      const tree = {
        type: 'root',
        children: [
          {
            type: 'html',
            value:
              '<img src="/first.jpg" alt="First image" style="float: left;">',
          },
          {
            type: 'html',
            value: '<img src="/second.jpg" alt="Second image">',
          },
        ],
      }

      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode(
          '/first.jpg',
          'First image',
          'float: left;',
          true
        )
      )
      expect(tree.children[1]).toEqual(
        createExpectedImageNode('/second.jpg', 'Second image', '')
      )
    })

    it('should preserve parent and index context during transformation', () => {
      const tree = {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', value: 'Before' }] },
          { type: 'html', value: '<img src="/test.jpg" alt="Test">' },
          { type: 'paragraph', children: [{ type: 'text', value: 'After' }] },
        ],
      }

      plugin(tree)

      expect(tree.children.length).toBe(3)
      expect(tree.children[0].type).toBe('paragraph')
      expect(tree.children[1]).toEqual(
        createExpectedImageNode('/test.jpg', 'Test', '')
      )
      expect(tree.children[2].type).toBe('paragraph')
    })
  })

  describe('performance and edge cases', () => {
    it('should handle very long attribute values', () => {
      const longAlt = 'A'.repeat(1000)
      const longStyle = `float: left; ${'margin: 1px; '.repeat(100)}`
      const tree = createTestTree(
        `<img src="/test.jpg" alt="${longAlt}" style="${longStyle}">`
      )

      expect(() => plugin(tree)).not.toThrow()

      const result = tree.children[0]
      expect(result.children[0].alt).toBe(longAlt)
      expect(result.children[0].data.hProperties.style).toBe(longStyle)
    })

    it('should handle unicode characters in attributes', () => {
      const tree = createTestTree(
        '<img src="/test.jpg" alt="🖼️ Unicode emoji" style="float: left;">'
      )
      plugin(tree)

      expect(tree.children[0]).toEqual(
        createExpectedImageNode(
          '/test.jpg',
          '🖼️ Unicode emoji',
          'float: left;',
          true
        )
      )
    })
  })
})
