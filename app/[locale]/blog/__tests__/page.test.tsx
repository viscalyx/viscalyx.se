import React from 'react'
import { vi } from 'vitest'

// Hoist all mock functions
const { mockGetAllPosts, mockGetFeaturedPost, mockGetCurrentDateISO } =
  vi.hoisted(() => ({
    mockGetAllPosts: vi.fn(),
    mockGetFeaturedPost: vi.fn(),
    mockGetCurrentDateISO: vi.fn(() => '2025-01-01'),
  }))

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue(
    Object.assign((key: string) => `translated:${key}`, {
      rich: (key: string) => `translated:${key}`,
    })
  ),
  getFormatter: vi.fn().mockResolvedValue({
    dateTime: () => 'Jan 1, 2025',
  }),
}))

// Mock blog utilities
vi.mock('@/lib/blog', () => ({
  getAllPosts: mockGetAllPosts,
  getFeaturedPost: mockGetFeaturedPost,
}))

vi.mock('@/lib/constants', () => ({
  SITE_URL: 'https://example.com',
}))

vi.mock('@/lib/date-utils', () => ({
  getCurrentDateISO: mockGetCurrentDateISO,
}))

// Mock child components
vi.mock('@/components/BlogPostGrid', () => ({
  __esModule: true,
  default: ({
    allPosts,
  }: {
    allPosts: Array<{ slug: string }>
    featuredPostCategory: string
    categoriesAllLabel: string
    loadMoreLabel: string
  }) =>
    React.createElement(
      'div',
      { 'data-testid': 'blog-post-grid' },
      `Posts: ${allPosts.length}`
    ),
}))

vi.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => React.createElement('footer', { 'data-testid': 'footer' }),
}))

vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => React.createElement('header', { 'data-testid': 'header' }),
}))

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}))

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => React.createElement('a', { href, ...props }, children),
}))

import { render, screen } from '@testing-library/react'

import BlogPage, { generateMetadata } from '@/app/[locale]/blog/page'

const mockFeaturedPost = {
  slug: 'featured-post',
  title: 'Featured Title',
  date: '2025-01-15',
  author: 'Author Name',
  excerpt: 'Featured excerpt text',
  image: '/featured.jpg',
  imageAlt: 'Featured image alt',
  tags: ['devops'],
  readTime: '5 min read',
  category: 'DevOps',
}

describe('BlogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with featured post from data', async () => {
    mockGetAllPosts.mockReturnValue([mockFeaturedPost])
    mockGetFeaturedPost.mockReturnValue(mockFeaturedPost)

    const page = await BlogPage({ params: Promise.resolve({ locale: 'en' }) })
    render(page)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('blog-post-grid')).toBeInTheDocument()
    expect(screen.getByText('Featured Title')).toBeInTheDocument()
  })

  it('renders default featured post when no posts exist', async () => {
    mockGetAllPosts.mockReturnValue([])
    mockGetFeaturedPost.mockReturnValue(null)

    const page = await BlogPage({ params: Promise.resolve({ locale: 'en' }) })
    render(page)

    // Should render the fallback featured post with translated keys
    expect(
      screen.getByText('translated:fallback.featuredPost.title')
    ).toBeInTheDocument()
  })

  it('renders featured post with fallback date when date is null', async () => {
    const postWithoutDate = { ...mockFeaturedPost, date: null }
    mockGetAllPosts.mockReturnValue([postWithoutDate])
    mockGetFeaturedPost.mockReturnValue(postWithoutDate)

    const page = await BlogPage({ params: Promise.resolve({ locale: 'en' }) })
    render(page)

    // Should still render without error
    expect(screen.getByText('Featured Title')).toBeInTheDocument()
  })

  it('renders featured post with fallback category when category is null', async () => {
    const postWithoutCategory = { ...mockFeaturedPost, category: null }
    mockGetAllPosts.mockReturnValue([postWithoutCategory])
    mockGetFeaturedPost.mockReturnValue(postWithoutCategory)

    const page = await BlogPage({ params: Promise.resolve({ locale: 'en' }) })
    render(page)

    expect(screen.getByText('Featured Title')).toBeInTheDocument()
  })

  it('renders hero section with translated text', async () => {
    mockGetAllPosts.mockReturnValue([])
    mockGetFeaturedPost.mockReturnValue(null)

    const page = await BlogPage({ params: Promise.resolve({ locale: 'en' }) })
    render(page)

    expect(screen.getByText('translated:hero.title')).toBeInTheDocument()
    expect(
      screen.getByText('translated:hero.titleHighlight')
    ).toBeInTheDocument()
    expect(screen.getByText('translated:hero.description')).toBeInTheDocument()
  })
})

describe('generateMetadata', () => {
  it('returns metadata for English locale', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(metadata.title).toBeDefined()
    expect(metadata.description).toBeDefined()
    expect(metadata.openGraph?.locale).toBe('en_US')
  })

  it('returns metadata for Swedish locale', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'sv' }),
    })

    expect(metadata.openGraph?.locale).toBe('sv_SE')
  })

  it('includes OG image with correct locale', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    const images = metadata.openGraph?.images as Array<{ url: string }>
    expect(images[0].url).toContain('og-blog-en.png')
  })
})
