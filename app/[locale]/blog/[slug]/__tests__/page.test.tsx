import React from 'react'
import { vi } from 'vitest'

// Hoist all mock functions so they're available in vi.mock factories
const {
  mockNotFound,
  mockGetAllPostSlugs,
  mockGetPostBySlug,
  mockGetRelatedPosts,
  mockLoadBlogContent,
  mockTrackPageView,
  mockValidateSlug,
  mockAddHeadingIds,
  mockExtractTableOfContentsServer,
  mockGetSerializableTeamMemberByName,
  mockGetAuthorInitials,
} = vi.hoisted(() => ({
  mockNotFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  mockGetAllPostSlugs: vi.fn(),
  mockGetPostBySlug: vi.fn(),
  mockGetRelatedPosts: vi.fn(),
  mockLoadBlogContent: vi.fn(),
  mockTrackPageView: vi.fn(),
  mockValidateSlug: vi.fn(),
  mockAddHeadingIds: vi.fn(),
  mockExtractTableOfContentsServer: vi.fn(),
  mockGetSerializableTeamMemberByName: vi.fn(),
  mockGetAuthorInitials: vi.fn(),
}))

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi
    .fn()
    .mockResolvedValue((key: string) => `translated:${key}`),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: mockNotFound,
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/en',
}))

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) =>
    React.createElement('img', { src, alt, ...props }),
}))

// Mock blog utilities
vi.mock('@/lib/blog', () => ({
  getAllPostSlugs: mockGetAllPostSlugs,
  getPostBySlug: mockGetPostBySlug,
  getRelatedPosts: mockGetRelatedPosts,
  loadBlogContent: mockLoadBlogContent,
  trackPageView: mockTrackPageView,
  validateSlug: mockValidateSlug,
}))

// Mock slug-utils
vi.mock('@/lib/slug-utils', () => ({
  addHeadingIds: mockAddHeadingIds,
  extractTableOfContentsServer: mockExtractTableOfContentsServer,
}))

// Mock team utilities
vi.mock('@/lib/team', () => ({
  getSerializableTeamMemberByName: mockGetSerializableTeamMemberByName,
  getAuthorInitials: mockGetAuthorInitials,
}))

// Pin SITE_URL so OG image URL assertions are not environment-dependent
vi.mock('@/lib/constants', () => ({
  SITE_URL: 'https://viscalyx.org',
}))

// Mock child components
vi.mock('@/components/BlogPostContent', () => ({
  __esModule: true,
  default: function MockBlogPostContent(props: Record<string, unknown>) {
    return React.createElement('div', {
      'data-testid': 'blog-post-content',
      'data-post': JSON.stringify(props.post),
      'data-toc': JSON.stringify(props.tableOfContents),
    })
  },
}))

vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => React.createElement('header', { 'data-testid': 'header' }),
}))

vi.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => React.createElement('footer', { 'data-testid': 'footer' }),
}))

import type { Metadata } from 'next'
// Import after mocking
import {
  generateMetadata,
  generateStaticParams,
} from '@/app/[locale]/blog/[slug]/page'

const mockPostMetadata = {
  title: 'Test Post',
  author: 'Test Author',
  date: '2025-01-15',
  readTime: '5 min read',
  image: '/test-image.jpg',
  imageAlt: 'Test image alt',
  category: 'Testing',
  slug: 'test-post',
  tags: ['testing', 'vitest'],
  excerpt: 'This is a test excerpt',
}

describe('BlogPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockValidateSlug.mockReturnValue('test-post')
    mockGetPostBySlug.mockReturnValue(mockPostMetadata)
    mockLoadBlogContent.mockResolvedValue('<h2>Test</h2><p>Content</p>')
    mockAddHeadingIds.mockReturnValue('<h2 id="test">Test</h2><p>Content</p>')
    mockExtractTableOfContentsServer.mockReturnValue([
      { id: 'test', text: 'Test', level: 2 },
    ])
    mockGetSerializableTeamMemberByName.mockReturnValue({
      id: 'test-user',
      name: 'Test Author',
      role: 'Developer',
      image: '/test.jpg',
      bio: 'Bio',
      socialLinks: [],
    })
    mockGetAuthorInitials.mockReturnValue('TA')
    mockGetRelatedPosts.mockReturnValue([
      { slug: 'related', title: 'Related Post', image: '/related.jpg' },
    ])
  })

  describe('generateStaticParams', () => {
    it('returns slug params for all posts', () => {
      mockGetAllPostSlugs.mockReturnValue([
        'post-one',
        'post-two',
        'post-three',
      ])

      const result = generateStaticParams()

      expect(result).toEqual([
        { slug: 'post-one' },
        { slug: 'post-two' },
        { slug: 'post-three' },
      ])
    })

    it('returns empty array when no posts exist', () => {
      mockGetAllPostSlugs.mockReturnValue([])
      expect(generateStaticParams()).toEqual([])
    })
  })

  describe('generateMetadata', () => {
    it('returns post metadata for valid slug', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.title).toBe('Test Post')
      expect(metadata.description).toBe('This is a test excerpt')
    })

    it('returns article OG type', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.openGraph).toMatchObject({
        type: 'article',
        locale: 'en_US',
        title: 'Test Post',
      })
    })

    it('uses sv_SE locale for Swedish', async () => {
      const params = Promise.resolve({ locale: 'sv', slug: 'test-post' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.openGraph).toMatchObject({
        locale: 'sv_SE',
      })
    })

    it('includes OG image from post as absolute URL', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const metadata: Metadata = await generateMetadata({ params })

      const images = metadata.openGraph?.images
      expect(Array.isArray(images)).toBe(true)
      expect((images as Array<Record<string, unknown>>)[0]).toMatchObject({
        url: 'https://viscalyx.org/test-image.jpg',
        alt: 'Test image alt',
      })
    })

    it('preserves already-absolute OG image URL', async () => {
      mockGetPostBySlug.mockReturnValue({
        ...mockPostMetadata,
        image: 'https://example.com/image.jpg',
      })
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const metadata: Metadata = await generateMetadata({ params })

      const images = metadata.openGraph?.images
      expect(Array.isArray(images)).toBe(true)
      expect((images as Array<Record<string, unknown>>)[0]).toMatchObject({
        url: 'https://example.com/image.jpg',
      })
    })

    it('falls back to title for image alt when imageAlt is empty', async () => {
      mockGetPostBySlug.mockReturnValue({
        ...mockPostMetadata,
        imageAlt: '',
      })
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const metadata: Metadata = await generateMetadata({ params })

      const images = metadata.openGraph?.images
      expect(Array.isArray(images)).toBe(true)
      expect((images as Array<Record<string, unknown>>)[0]).toMatchObject({
        alt: 'Test Post',
      })
    })

    it('returns empty object for non-existent post', async () => {
      mockGetPostBySlug.mockReturnValue(null)
      const params = Promise.resolve({ locale: 'en', slug: 'missing' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata).toEqual({})
    })

    it('returns empty object for invalid slug', async () => {
      mockValidateSlug.mockReturnValue(null)
      const params = Promise.resolve({
        locale: 'en',
        slug: '../../../etc/passwd',
      })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata).toEqual({})
      expect(mockGetPostBySlug).not.toHaveBeenCalled()
    })

    it('includes twitter card metadata', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        title: 'Test Post',
        description: 'This is a test excerpt',
      })
    })
  })

  describe('BlogPostPage component', () => {
    // The page is an async server component, so we test it by importing and calling directly
    let BlogPostPage: typeof import('@/app/[locale]/blog/[slug]/page').default

    /**
     * Recursively walk the JSX tree to find BlogPostContent props.
     *
     * This is resilient to structural changes — it searches the entire
     * tree for a child whose type name is 'default' (from the mock) or
     * that carries a data-testid of 'blog-post-content'.
     *
     * NOTE: This walker is inherently fragile — if the page layout adds
     * new wrappers or changes the component hierarchy, this function
     * will need updating. The mock serializes props as data-* attributes
     * (see mock setup above), so an alternative approach would be to
     * render the JSX to a DOM and read those attributes directly.
     */

    interface BlogPostContentTestProps {
      post: {
        date: string | null
        [key: string]: unknown
      }
      relatedPosts?: Array<{ slug: string; title: string; image: string }>
      tableOfContents?: unknown[]
      [key: string]: unknown
    }

    function getBlogPostContentProps(
      element: React.JSX.Element,
    ): BlogPostContentTestProps {
      // Check current element
      const typeName =
        typeof element?.type === 'function'
          ? element.type.name
          : typeof element?.type === 'string'
            ? element.type
            : undefined
      if (
        typeName === 'MockBlogPostContent' ||
        element?.props?.['data-testid'] === 'blog-post-content'
      ) {
        return element.props
      }
      // Recurse into children
      const children = Array.isArray(element?.props?.children)
        ? element.props.children
        : [element?.props?.children]
      for (const child of children) {
        if (child && typeof child === 'object') {
          try {
            return getBlogPostContentProps(child as React.JSX.Element)
          } catch {
            // Not found in this branch, keep searching
          }
        }
      }
      throw new Error('BlogPostContent not found in JSX tree')
    }

    // NOTE: Vitest caches dynamic imports by default, so BlogPostPage is the
    // same module reference across tests. This works because we reset mock
    // return values (not module-level side effects) in the outer beforeEach.
    // If a future test needs to re-evaluate module-level behavior, add
    // vi.resetModules() before the import.
    beforeEach(async () => {
      const mod = await import('@/app/[locale]/blog/[slug]/page')
      BlogPostPage = mod.default
    })

    it('calls notFound for invalid slug', async () => {
      mockValidateSlug.mockReturnValue(null)
      const params = Promise.resolve({ locale: 'en', slug: '../etc/passwd' })

      await expect(async () => BlogPostPage({ params })).rejects.toThrow(
        'NEXT_NOT_FOUND',
      )
      expect(mockNotFound).toHaveBeenCalled()
    })

    it('calls notFound when post metadata not found', async () => {
      mockGetPostBySlug.mockReturnValue(null)
      const params = Promise.resolve({ locale: 'en', slug: 'non-existent' })

      await expect(async () => BlogPostPage({ params })).rejects.toThrow(
        'NEXT_NOT_FOUND',
      )
      expect(mockNotFound).toHaveBeenCalled()
    })

    it('calls notFound when content cannot be loaded', async () => {
      mockLoadBlogContent.mockResolvedValue(null)
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })

      await expect(async () => BlogPostPage({ params })).rejects.toThrow(
        'NEXT_NOT_FOUND',
      )
      expect(mockNotFound).toHaveBeenCalled()
    })

    it('calls trackPageView with slug and category', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      await BlogPostPage({ params })

      expect(mockTrackPageView).toHaveBeenCalledWith('test-post', 'Testing')
    })

    it('uses "uncategorized" when category is empty', async () => {
      mockGetPostBySlug.mockReturnValue({
        ...mockPostMetadata,
        category: '',
      })
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      await BlogPostPage({ params })

      expect(mockTrackPageView).toHaveBeenCalledWith(
        'test-post',
        'uncategorized',
      )
    })

    it('processes content through addHeadingIds', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      await BlogPostPage({ params })

      expect(mockAddHeadingIds).toHaveBeenCalledWith(
        '<h2>Test</h2><p>Content</p>',
        {},
        expect.any(Function),
      )
    })

    it('extracts table of contents from processed content', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      await BlogPostPage({ params })

      expect(mockExtractTableOfContentsServer).toHaveBeenCalledWith(
        '<h2 id="test">Test</h2><p>Content</p>',
      )
    })

    it('gets serializable team member by author name', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      await BlogPostPage({ params })

      expect(mockGetSerializableTeamMemberByName).toHaveBeenCalledWith(
        'Test Author',
        expect.any(Function),
      )
    })

    it('normalizes invalid date to null', async () => {
      mockGetPostBySlug.mockReturnValue({
        ...mockPostMetadata,
        date: 'not-a-date',
      })
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const result = await BlogPostPage({ params })

      // The component returns JSX with the post prop having date: null
      expect(getBlogPostContentProps(result).post.date).toBeNull()
    })

    it('passes valid date as-is', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const result = await BlogPostPage({ params })

      expect(getBlogPostContentProps(result).post.date).toBe('2025-01-15')
    })

    it('maps related posts to slug/title/image shape', async () => {
      const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
      const result = await BlogPostPage({ params })

      expect(getBlogPostContentProps(result).relatedPosts).toEqual([
        { slug: 'related', title: 'Related Post', image: '/related.jpg' },
      ])
    })
  })
})
