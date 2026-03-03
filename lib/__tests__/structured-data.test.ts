import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SITE_URL } from '@/lib/constants'
import {
  getBlogPostingJsonLd,
  getBreadcrumbListJsonLd,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from '@/lib/structured-data'

describe('structured-data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds organization JSON-LD with expected canonical fields', () => {
    const data = getOrganizationJsonLd() as unknown as Record<string, unknown>

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Organization')
    expect(data.name).toBe('Viscalyx')
    expect(data.url).toBe(SITE_URL)
    expect(data.logo).toBe(`${SITE_URL}/viscalyx_logo_128x128.png`)
    expect(data.description).toBe(
      'Expert automation consulting specializing in PowerShell DSC, DevOps, and infrastructure automation.',
    )
    expect(data.sameAs).toEqual(
      expect.arrayContaining(['https://github.com/viscalyx']),
    )
  })

  it('builds website JSON-LD with supported languages', () => {
    const data = getWebSiteJsonLd() as unknown as Record<string, unknown>

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('WebSite')
    expect(data.name).toBe('Viscalyx')
    expect(data.url).toBe(SITE_URL)
    expect(data.inLanguage).toEqual(['en', 'sv'])
  })

  describe('getBlogPostingJsonLd', () => {
    const basePost = {
      title: 'Test Post',
      excerpt: 'A test blog post excerpt',
      author: 'Johan Ljunggren',
      date: '2025-06-15',
      image: '/images/test.png',
      imageAlt: 'Test image alt',
      slug: 'test-post',
      locale: 'en',
    }

    it('builds BlogPosting JSON-LD with all required fields', () => {
      const data = getBlogPostingJsonLd(basePost) as unknown as Record<
        string,
        unknown
      >

      expect(data['@context']).toBe('https://schema.org')
      expect(data['@type']).toBe('BlogPosting')
      expect(data.headline).toBe('Test Post')
      expect(data.description).toBe('A test blog post excerpt')
      expect(data.datePublished).toBe('2025-06-15')
      expect(data.inLanguage).toBe('en-US')
      const image = data.image as Record<string, unknown>
      expect(image['@type']).toBe('ImageObject')
      expect(image.url).toBe(`${SITE_URL}/images/test.png`)
      expect(image.alternateName).toBe('Test image alt')
    })

    it('sets author as Person with name', () => {
      const data = getBlogPostingJsonLd(basePost) as unknown as Record<
        string,
        unknown
      >
      const author = data.author as Record<string, unknown>

      expect(author['@type']).toBe('Person')
      expect(author.name).toBe('Johan Ljunggren')
    })

    it('sets publisher as Organization with logo', () => {
      const data = getBlogPostingJsonLd(basePost) as unknown as Record<
        string,
        unknown
      >
      const publisher = data.publisher as Record<string, unknown>

      expect(publisher['@type']).toBe('Organization')
      expect(publisher.name).toBe('Viscalyx')
      const logo = publisher.logo as Record<string, unknown>
      expect(logo['@type']).toBe('ImageObject')
      expect(logo.url).toBe(`${SITE_URL}/viscalyx_logo_128x128.png`)
    })

    it('builds mainEntityOfPage with correct locale URL', () => {
      const data = getBlogPostingJsonLd(basePost) as unknown as Record<
        string,
        unknown
      >
      const mainEntity = data.mainEntityOfPage as Record<string, unknown>

      expect(mainEntity['@type']).toBe('WebPage')
      expect(mainEntity['@id']).toBe(`${SITE_URL}/en/blog/test-post`)
    })

    it('uses sv-SE language for Swedish locale', () => {
      const data = getBlogPostingJsonLd({
        ...basePost,
        locale: 'sv',
      }) as unknown as Record<string, unknown>

      expect(data.inLanguage).toBe('sv-SE')
      const mainEntity = data.mainEntityOfPage as Record<string, unknown>
      expect(mainEntity['@id']).toBe(`${SITE_URL}/sv/blog/test-post`)
    })

    it('omits datePublished when date is null', () => {
      const data = getBlogPostingJsonLd({
        ...basePost,
        date: null,
      }) as unknown as Record<string, unknown>

      expect(data.datePublished).toBeUndefined()
    })

    it('preserves absolute image URLs', () => {
      const data = getBlogPostingJsonLd({
        ...basePost,
        image: 'https://example.com/image.png',
      }) as unknown as Record<string, unknown>

      const image = data.image as Record<string, unknown>
      expect(image.url).toBe('https://example.com/image.png')
    })

    it('prepends SITE_URL for relative image paths without leading slash', () => {
      const data = getBlogPostingJsonLd({
        ...basePost,
        image: 'images/test.png',
      }) as unknown as Record<string, unknown>

      const image = data.image as Record<string, unknown>
      expect(image.url).toBe(`${SITE_URL}/images/test.png`)
    })

    it('uses plain image URL string when imageAlt is not provided', () => {
      const data = getBlogPostingJsonLd({
        ...basePost,
        imageAlt: undefined,
      }) as unknown as Record<string, unknown>

      expect(data.image).toBe(`${SITE_URL}/images/test.png`)
    })
  })

  describe('getBreadcrumbListJsonLd', () => {
    it('builds BreadcrumbList JSON-LD with correct structure', () => {
      const data = getBreadcrumbListJsonLd([
        { name: 'Home', url: `${SITE_URL}/en` },
        { name: 'Blog', url: `${SITE_URL}/en/blog` },
      ]) as unknown as Record<string, unknown>

      expect(data['@context']).toBe('https://schema.org')
      expect(data['@type']).toBe('BreadcrumbList')
    })

    it('assigns sequential positions starting from 1', () => {
      const data = getBreadcrumbListJsonLd([
        { name: 'Home', url: `${SITE_URL}/en` },
        { name: 'Blog', url: `${SITE_URL}/en/blog` },
        { name: 'My Post', url: `${SITE_URL}/en/blog/my-post` },
      ]) as unknown as Record<string, unknown>

      const items = data.itemListElement as Array<Record<string, unknown>>

      expect(items).toHaveLength(3)
      expect(items[0]).toMatchObject({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/en`,
      })
      expect(items[1]).toMatchObject({
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/en/blog`,
      })
      expect(items[2]).toMatchObject({
        '@type': 'ListItem',
        position: 3,
        name: 'My Post',
        item: `${SITE_URL}/en/blog/my-post`,
      })
    })

    it('returns empty itemListElement for empty input', () => {
      const data = getBreadcrumbListJsonLd([]) as unknown as Record<
        string,
        unknown
      >

      const items = data.itemListElement as Array<Record<string, unknown>>
      expect(items).toHaveLength(0)
    })
  })
})
