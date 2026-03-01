import { afterEach, describe, expect, it, vi } from 'vitest'

describe('slug-utils-client coverage branches', () => {
  afterEach(() => {
    vi.doUnmock('sanitize-html')
    vi.resetModules()
  })

  it('preserves unsafe numeric entities when sanitizer output still contains them', async () => {
    vi.doMock('sanitize-html', () => ({
      default: (input: string) => input,
    }))

    const { extractCleanText } = await import('../slug-utils-client')
    const input = '&#x110000; &#1114112;'

    expect(extractCleanText(input)).toBe(input)
  })

  it('throws when DOMParser is unavailable in client extractor', async () => {
    const { extractTableOfContentsClient } = await import(
      '../slug-utils-client'
    )
    const originalDOMParser = globalThis.DOMParser

    Object.defineProperty(globalThis, 'DOMParser', {
      configurable: true,
      value: undefined,
      writable: true,
    })

    try {
      expect(() => extractTableOfContentsClient('<h2>Heading</h2>')).toThrow(
        'extractTableOfContentsClient requires DOMParser',
      )
    } finally {
      Object.defineProperty(globalThis, 'DOMParser', {
        configurable: true,
        value: originalDOMParser,
        writable: true,
      })
    }
  })
})
