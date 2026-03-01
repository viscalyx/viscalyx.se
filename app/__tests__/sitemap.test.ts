import { vi } from 'vitest'

// Hoist mock functions
const { mockGetAllPosts, mockGetStaticPageDates } = vi.hoisted(() => ({
  mockGetAllPosts: vi.fn(),
  mockGetStaticPageDates: vi.fn(),
}))

vi.mock('@/lib/blog', () => ({
  getAllPosts: mockGetAllPosts,
}))

vi.mock('@/lib/constants', () => ({
  SITE_URL: 'https://example.com',
}))

vi.mock('@/lib/date-utils', () => ({
  normalizeDate: (date?: string) => date || '1970-01-01',
}))

vi.mock('@/lib/file-dates', () => ({
  getStaticPageDates: mockGetStaticPageDates,
}))

import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGetStaticPageDates.mockReturnValue({
      home: new Date('2025-01-01'),
      blog: new Date('2025-01-15'),
      privacy: new Date('2025-01-10'),
      terms: new Date('2025-01-05'),
      cookies: new Date('2025-01-03'),
    })
  })

  it('includes static pages with locale prefixes', async () => {
    mockGetAllPosts.mockReturnValue([])

    const result = await sitemap()

    const urls = result.map(entry => entry.url)
    expect(urls).toContain('https://example.com/en')
    expect(urls).toContain('https://example.com/sv')
    expect(urls).toContain('https://example.com/en/blog')
    expect(urls).toContain('https://example.com/sv/blog')
    expect(urls).toContain('https://example.com/en/privacy')
    expect(urls).toContain('https://example.com/sv/privacy')
    expect(urls).toContain('https://example.com/en/terms')
    expect(urls).toContain('https://example.com/sv/terms')
  })

  it('includes blog post pages with locale prefixes', async () => {
    mockGetAllPosts.mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2025-01-20',
        author: 'Author',
        excerpt: 'Excerpt',
        image: '/img.jpg',
        tags: [],
        readTime: '5 min',
      },
    ])

    const result = await sitemap()

    const urls = result.map(entry => entry.url)
    expect(urls).toContain('https://example.com/en/blog/test-post')
    expect(urls).toContain('https://example.com/sv/blog/test-post')
  })

  it('does not include fallback blog pages', async () => {
    mockGetAllPosts.mockReturnValue([])

    const result = await sitemap()

    const urls = result.map(entry => entry.url)
    expect(
      urls.some(u => u.includes('future-infrastructure-automation-2025')),
    ).toBe(false)
    expect(urls.some(u => u.includes('powershell-dsc-best-practices'))).toBe(
      false,
    )
  })

  it('generates one entry per locale for each blog post', async () => {
    mockGetAllPosts.mockReturnValue([
      {
        slug: 'future-infrastructure-automation-2025',
        title: 'Real Post',
        date: '2025-02-01',
        author: 'Author',
        excerpt: 'Real excerpt',
        image: '/img.jpg',
        tags: [],
        readTime: '5 min',
      },
    ])

    const result = await sitemap()

    const matchingUrls = result.filter(entry =>
      entry.url.includes('future-infrastructure-automation-2025'),
    )
    // Two entries: one per locale
    expect(matchingUrls.length).toBe(2)
  })

  it('sets correct priorities for different page types', async () => {
    mockGetAllPosts.mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test',
        date: '2025-01-20',
        author: 'Author',
        excerpt: 'E',
        image: '/img.jpg',
        tags: [],
        readTime: '3 min',
      },
    ])

    const result = await sitemap()

    const homeEntry = result.find(e => e.url === 'https://example.com/en')
    expect(homeEntry?.priority).toBe(1)

    const blogEntry = result.find(e => e.url === 'https://example.com/en/blog')
    expect(blogEntry?.priority).toBe(0.8)

    const postEntry = result.find(e => e.url.includes('/en/blog/test-post'))
    expect(postEntry?.priority).toBe(0.6)
  })

  it('handles posts with missing dates using normalizeDate', async () => {
    mockGetAllPosts.mockReturnValue([
      {
        slug: 'no-date-post',
        title: 'No Date',
        date: undefined,
        author: 'Author',
        excerpt: 'E',
        image: '/img.jpg',
        tags: [],
        readTime: '2 min',
      },
    ])

    const result = await sitemap()

    const postEntry = result.find(e => e.url.includes('/en/blog/no-date-post'))
    expect(postEntry).toBeDefined()
    expect(postEntry?.lastModified).toEqual(new Date('1970-01-01'))
  })
})
