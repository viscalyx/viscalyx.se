import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BlogPostGrid, { POSTS_PER_PAGE } from '@/components/BlogPostGrid'

import type { BlogPostMetadata } from '@/lib/blog'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const createPost = (
  overrides: Partial<BlogPostMetadata> = {},
): BlogPostMetadata => ({
  slug: 'test-post',
  title: 'Test Post',
  date: '2026-01-15',
  author: 'Test Author',
  excerpt: 'This is a test excerpt.',
  image: 'https://example.com/image.jpg',
  imageAlt: 'Test image',
  tags: ['test'],
  readTime: '5 min read',
  category: 'DevOps',
  ...overrides,
})

const generatePosts = (count: number, category?: string): BlogPostMetadata[] =>
  Array.from({ length: count }, (_, i) =>
    createPost({
      slug: `post-${i + 1}`,
      title: `Post ${i + 1}`,
      category: category ?? (i % 2 === 0 ? 'DevOps' : 'PowerShell'),
    }),
  )

describe('BlogPostGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders all posts when fewer than page size', () => {
    const posts = generatePosts(3)
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    expect(screen.getByText('Post 1')).toBeInTheDocument()
    expect(screen.getByText('Post 2')).toBeInTheDocument()
    expect(screen.getByText('Post 3')).toBeInTheDocument()
  })

  it('renders category filter buttons for unique categories', () => {
    const posts = [
      createPost({ slug: 'a', category: 'DevOps' }),
      createPost({ slug: 'b', category: 'PowerShell' }),
      createPost({ slug: 'c', category: 'DevOps' }),
    ]
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    const buttons = screen.getAllByRole('button')
    const labels = buttons.map(b => b.textContent)
    expect(labels).toContain('All')
    expect(labels).toContain('DevOps')
    expect(labels).toContain('PowerShell')
    // DevOps should appear only once despite multiple posts
    expect(labels.filter(l => l === 'DevOps')).toHaveLength(1)
  })

  it('includes featured post category in filter even if not in allPosts', () => {
    const posts = [createPost({ slug: 'a', category: 'DevOps' })]
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="Automation"
        loadMoreLabel="Load More Articles"
      />,
    )

    const buttons = screen.getAllByRole('button')
    const labels = buttons.map(b => b.textContent)
    expect(labels).toContain('Automation')
    expect(labels).toContain('DevOps')
  })

  it('filters posts by category when a category button is clicked', () => {
    const posts = [
      createPost({ slug: 'a', title: 'DevOps Post', category: 'DevOps' }),
      createPost({
        slug: 'b',
        title: 'PowerShell Post',
        category: 'PowerShell',
      }),
      createPost({
        slug: 'c',
        title: 'Another DevOps',
        category: 'DevOps',
      }),
    ]
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    // All posts visible initially
    expect(screen.getByText('DevOps Post')).toBeInTheDocument()
    expect(screen.getByText('PowerShell Post')).toBeInTheDocument()
    expect(screen.getByText('Another DevOps')).toBeInTheDocument()

    // Click PowerShell filter
    fireEvent.click(screen.getByRole('button', { name: 'PowerShell' }))

    expect(screen.queryByText('DevOps Post')).not.toBeInTheDocument()
    expect(screen.getByText('PowerShell Post')).toBeInTheDocument()
    expect(screen.queryByText('Another DevOps')).not.toBeInTheDocument()
  })

  it('resets to all posts when "All" category is clicked after filtering', () => {
    const posts = [
      createPost({ slug: 'a', title: 'DevOps Post', category: 'DevOps' }),
      createPost({
        slug: 'b',
        title: 'PowerShell Post',
        category: 'PowerShell',
      }),
    ]
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    // Filter to PowerShell
    fireEvent.click(screen.getByRole('button', { name: 'PowerShell' }))
    expect(screen.queryByText('DevOps Post')).not.toBeInTheDocument()

    // Reset to All
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('DevOps Post')).toBeInTheDocument()
    expect(screen.getByText('PowerShell Post')).toBeInTheDocument()
  })

  it('shows Load More button when posts exceed page size', () => {
    const posts = generatePosts(8)
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Load More Articles' }),
    ).toBeInTheDocument()
    // Only the first POSTS_PER_PAGE posts should be visible
    expect(screen.getByText('Post 1')).toBeInTheDocument()
    expect(screen.getByText(`Post ${POSTS_PER_PAGE}`)).toBeInTheDocument()
    expect(
      screen.queryByText(`Post ${POSTS_PER_PAGE + 1}`),
    ).not.toBeInTheDocument()
  })

  it('reveals more posts when Load More is clicked', () => {
    const posts = generatePosts(8)
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Load More Articles' }))

    expect(screen.getByText('Post 7')).toBeInTheDocument()
    expect(screen.getByText('Post 8')).toBeInTheDocument()
  })

  it('hides Load More button when all posts are visible', () => {
    const posts = generatePosts(8)
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Load More Articles' }))

    expect(
      screen.queryByRole('button', { name: 'Load More Articles' }),
    ).not.toBeInTheDocument()
  })

  it('does not show Load More when posts fit within page size', () => {
    const posts = generatePosts(4)
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Load More Articles' }),
    ).not.toBeInTheDocument()
  })

  it('renders post cards with correct links', () => {
    const posts = [
      createPost({ slug: 'my-post', title: 'My Post' }),
      createPost({ slug: 'another-post', title: 'Another Post' }),
    ]
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/blog/my-post')
    expect(hrefs).toContain('/blog/another-post')
  })

  it('resets visible posts when changing category', () => {
    // 8 DevOps posts + 2 PowerShell posts
    const posts = [
      ...generatePosts(8, 'DevOps'),
      createPost({ slug: 'ps-1', title: 'PS Post 1', category: 'PowerShell' }),
      createPost({ slug: 'ps-2', title: 'PS Post 2', category: 'PowerShell' }),
    ]
    render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    // Load more to see 7+ posts
    fireEvent.click(screen.getByRole('button', { name: 'Load More Articles' }))
    expect(screen.getByText('Post 7')).toBeInTheDocument()

    // Switch category — should reset to first page
    fireEvent.click(screen.getByRole('button', { name: 'PowerShell' }))
    expect(screen.getByText('PS Post 1')).toBeInTheDocument()
    expect(screen.getByText('PS Post 2')).toBeInTheDocument()
    // DevOps posts should be hidden
    expect(screen.queryByText('Post 1')).not.toBeInTheDocument()
  })

  it('renders post metadata (date, read time, category badge)', () => {
    const posts = [
      createPost({
        slug: 'a',
        date: '2026-01-15',
        readTime: '5 min read',
        category: 'DevOps',
      }),
    ]
    const { container } = render(
      <BlogPostGrid
        allPosts={posts}
        categoriesAllLabel="All"
        featuredPostCategory="DevOps"
        loadMoreLabel="Load More Articles"
      />,
    )

    const article = container.querySelector('article')
    expect(article).toBeTruthy()
    if (!article) {
      throw new Error('Expected article element to be present')
    }
    expect(article.textContent).toContain('2026-01-15')
    expect(article.textContent).toContain('5 min read')
    // The category badge text should appear in the article
    expect(article.textContent).toContain('DevOps')
  })
})
