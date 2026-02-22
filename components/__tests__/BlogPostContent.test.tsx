import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import React from 'react'

import type { ComponentProps } from '@/components/BlogPostContent'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useFormatter: () => ({
    dateTime: () => 'Jan 1, 2025',
  }),
  useLocale: () => 'en',
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/en',
}))

// Mock components
vi.mock('@/components/AlertIconInjector', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      'div',
      { 'data-testid': 'alert-icon-injector' },
      children
    ),
}))

vi.mock('@/components/CodeBlockEnhancer', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', {
      role: 'region',
      'aria-label': 'Code block enhancer',
    }),
}))

vi.mock('@/components/ImageEnhancer', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', {
      role: 'region',
      'aria-label': 'Image enhancer',
    }),
}))

vi.mock('@/components/MermaidRenderer', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', {
      role: 'region',
      'aria-label': 'Mermaid renderer',
    }),
}))

vi.mock('@/components/ReadingProgress', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', {
      role: 'progressbar',
      'aria-label': 'Reading progress',
    }),
}))

vi.mock('@/components/ScrollToTop', () => ({
  __esModule: true,
  default: () =>
    React.createElement('button', {
      role: 'button',
      'aria-label': 'Scroll to top',
    }),
}))

vi.mock('@/components/TableOfContents', () => ({
  __esModule: true,
  default: ({
    items,
  }: {
    items: { id: string; text: string; level: number }[]
  }) =>
    React.createElement(
      'nav',
      { 'aria-label': 'Table of contents' },
      items.map(item =>
        React.createElement(
          'a',
          { key: item.id, href: `#${item.id}` },
          item.text
        )
      )
    ),
}))

// Mock analytics
const { mockUseBlogAnalytics } = vi.hoisted(() => ({
  mockUseBlogAnalytics: vi.fn(),
}))
vi.mock('@/lib/analytics', () => ({
  useBlogAnalytics: mockUseBlogAnalytics,
}))

// Mock team icons
vi.mock('@/lib/team', () => ({
  socialIconMap: {
    Email: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, role: 'img', 'aria-label': 'Email' },
        'Email'
      ),
    LinkedIn: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, role: 'img', 'aria-label': 'LinkedIn' },
        'LinkedIn'
      ),
    GitHub: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, role: 'img', 'aria-label': 'GitHub' },
        'GitHub'
      ),
    Bluesky: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, role: 'img', 'aria-label': 'Bluesky' },
        'Bluesky'
      ),
    Mastodon: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, role: 'img', 'aria-label': 'Mastodon' },
        'Mastodon'
      ),
    X: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, role: 'img', 'aria-label': 'X' },
        'X'
      ),
    Discord: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, role: 'img', 'aria-label': 'Discord' },
        'Discord'
      ),
  },
}))

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}))

// Mock next/link
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

// Import the component after mocks
import BlogPostContent from '@/components/BlogPostContent'

const mockPost = {
  title: 'Test Blog Post',
  author: 'Test Author',
  date: '2025-01-01',
  readTime: '5 min read',
  image: '/test-image.jpg',
  imageAlt: 'Test image alt text',
  category: 'Testing',
  slug: 'test-post',
  tags: ['testing', 'blog'],
  excerpt: 'Test excerpt for the blog post',
}

const mockTableOfContents = [
  { id: 'getting-started', text: 'Getting Started', level: 2 },
  { id: 'installation', text: 'Installation', level: 3 },
  { id: 'conclusion', text: 'Conclusion', level: 2 },
]

const mockRelatedPosts = [
  { slug: 'related-1', title: 'Related Post 1', image: '/related-1.jpg' },
  { slug: 'related-2', title: 'Related Post 2', image: '/related-2.jpg' },
]

const mockTeamMember = {
  id: 'test-user',
  name: 'Test Author',
  role: 'Lead Developer',
  image: '/test-author.jpg',
  bio: 'A passionate developer.',
  location: 'Sweden',
  specialties: ['TypeScript', 'React'],
  socialLinks: [
    { name: 'LinkedIn' as const, href: 'https://linkedin.com/in/test' },
    { name: 'GitHub' as const, href: 'https://github.com/test' },
    { name: 'Email' as const, href: 'mailto:test@example.com' },
  ],
}

const defaultProps: ComponentProps = {
  post: mockPost,
  contentWithIds:
    '<h2 id="getting-started">Getting Started</h2><p>Test content</p>',
  relatedPosts: mockRelatedPosts,
  tableOfContents: mockTableOfContents,
  teamMember: mockTeamMember,
  authorInitials: 'TA',
}

const renderComponent = (overrides: Partial<ComponentProps> = {}) =>
  render(<BlogPostContent {...defaultProps} {...overrides} />)

describe('BlogPostContent', () => {
  let originalClipboard: Clipboard | undefined
  let originalShare: typeof navigator.share
  let originalCanShare: typeof navigator.canShare

  beforeEach(() => {
    vi.clearAllMocks()
    originalClipboard = navigator.clipboard
    originalShare = navigator.share
    originalCanShare = navigator.canShare

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/blog/test-post',
        hash: '',
      },
      writable: true,
      configurable: true,
    })

    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    global.requestAnimationFrame = vi.fn(cb => {
      setTimeout(cb, 16)
      return 1
    })
    global.cancelAnimationFrame = vi.fn()
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    })
    Object.defineProperty(navigator, 'share', {
      value: originalShare,
      configurable: true,
    })
    Object.defineProperty(navigator, 'canShare', {
      value: originalCanShare,
      configurable: true,
    })
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('renders the post title as h1', () => {
      renderComponent()
      expect(
        screen.getByRole('heading', { level: 1, name: 'Test Blog Post' })
      ).toBeInTheDocument()
    })

    it('renders author name', () => {
      renderComponent()
      const authorElements = screen.getAllByText('Test Author')
      expect(authorElements.length).toBeGreaterThanOrEqual(1)
    })

    it('renders post category badge', () => {
      renderComponent()
      expect(screen.getByText('Testing')).toBeInTheDocument()
    })

    it('renders read time', () => {
      renderComponent()
      expect(screen.getByText('5 min read')).toBeInTheDocument()
    })

    it('renders all tags', () => {
      renderComponent()
      expect(screen.getByText('testing')).toBeInTheDocument()
      expect(screen.getByText('blog')).toBeInTheDocument()
    })

    it('renders featured image with alt text', () => {
      renderComponent()
      const img = screen.getByAltText('Test image alt text')
      expect(img).toBeInTheDocument()
    })

    it('renders a dash when date is null', () => {
      renderComponent({ post: { ...mockPost, date: null } })
      expect(screen.getByText('post.dateFallback')).toBeInTheDocument()
    })

    it('renders Back to Blog link', () => {
      renderComponent()
      expect(screen.getByText('post.backToBlog')).toBeInTheDocument()
    })

    it('renders post content via dangerouslySetInnerHTML', () => {
      renderComponent()
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('wraps unwrapped tables in a scroll region at runtime', async () => {
      renderComponent({
        contentWithIds:
          '<table><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody><tr><td><code>gpg.format</code></td><td><code>ssh</code></td></tr></tbody></table>',
      })

      const table = screen.getByText('Setting').closest('table')
      expect(table).toBeTruthy()

      await waitFor(() => {
        expect(
          table?.parentElement?.classList.contains('table-scroll-region')
        ).toBe(true)
      })

      expect(
        table?.parentElement?.querySelector('.table-right-fade')
      ).toBeTruthy()
    })

    it('does not double-wrap tables already in a scroll region', async () => {
      renderComponent({
        contentWithIds:
          '<div class="table-scroll-region"><table><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody><tr><td><code>gpg.format</code></td><td><code>ssh</code></td></tr></tbody></table><div class="table-right-fade"></div></div>',
      })

      await waitFor(() => {
        expect(document.querySelectorAll('.table-scroll-region')).toHaveLength(
          1
        )
      })
      expect(document.querySelectorAll('.table-right-fade')).toHaveLength(1)
    })
  })

  describe('sub-components', () => {
    it('renders ReadingProgress', () => {
      renderComponent()
      expect(
        screen.getByRole('progressbar', { name: /reading progress/i })
      ).toBeInTheDocument()
    })

    it('renders CodeBlockEnhancer', () => {
      renderComponent()
      expect(
        screen.getByRole('region', { name: /code block enhancer/i })
      ).toBeInTheDocument()
    })

    it('renders MermaidRenderer', () => {
      renderComponent()
      expect(
        screen.getByRole('region', { name: /mermaid renderer/i })
      ).toBeInTheDocument()
    })

    it('renders ImageEnhancer', () => {
      renderComponent()
      expect(
        screen.getByRole('region', { name: /image enhancer/i })
      ).toBeInTheDocument()
    })

    it('renders ScrollToTop', () => {
      renderComponent()
      expect(
        screen.getByRole('button', { name: /scroll to top/i })
      ).toBeInTheDocument()
    })
  })

  describe('table of contents', () => {
    it('renders desktop ToC with items', () => {
      renderComponent()
      const tocElements = screen.getAllByRole('navigation', {
        name: /table of contents/i,
      })
      // Desktop + mobile
      expect(tocElements.length).toBeGreaterThanOrEqual(1)
    })

    it('does not render ToC when empty', () => {
      renderComponent({ tableOfContents: [] })
      expect(
        screen.queryByRole('navigation', { name: /table of contents/i })
      ).not.toBeInTheDocument()
    })

    it('renders ToC heading text', () => {
      renderComponent()
      const headings = screen.getAllByText('post.tableOfContents')
      expect(headings.length).toBeGreaterThan(0)
    })
  })

  describe('related posts', () => {
    it('renders related post links', () => {
      renderComponent()
      expect(screen.getByText('Related Post 1')).toBeInTheDocument()
      expect(screen.getByText('Related Post 2')).toBeInTheDocument()
    })

    it('renders related post links with correct hrefs', () => {
      renderComponent()
      const link1 = screen.getByText('Related Post 1').closest('a')
      expect(link1).toHaveAttribute('href', '/en/blog/related-1')
    })

    it('renders related articles heading', () => {
      renderComponent()
      expect(screen.getByText('post.relatedArticles')).toBeInTheDocument()
    })
  })

  describe('author bio', () => {
    it('renders team member name with profile link', () => {
      renderComponent()
      const profileLinks = screen
        .getAllByText('Test Author')
        .filter(el => el.closest('a'))
      expect(profileLinks.length).toBeGreaterThan(0)
    })

    it('renders team member role', () => {
      renderComponent()
      expect(screen.getByText('Lead Developer')).toBeInTheDocument()
    })

    it('renders team member bio', () => {
      renderComponent()
      expect(screen.getByText('A passionate developer.')).toBeInTheDocument()
    })

    it('renders View Profile link', () => {
      renderComponent()
      expect(screen.getByText('post.authorBio.viewProfile')).toBeInTheDocument()
    })

    it('renders social icon links from serializable data', () => {
      renderComponent()
      expect(screen.getByRole('img', { name: 'LinkedIn' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'GitHub' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Email' })).toBeInTheDocument()
    })

    it('renders author initials when no team member found', () => {
      renderComponent({ teamMember: null })
      expect(screen.getByText('TA')).toBeInTheDocument()
    })

    it('renders author name without link when no team member', () => {
      renderComponent({ teamMember: null })
      // Author name displayed but not as a link
      const authorTexts = screen.getAllByText('Test Author')
      const authorInBio = authorTexts.find(
        el => !el.closest('a') && el.closest('[data-testid="author-bio"]')
      )
      expect(authorInBio).toBeInTheDocument()
    })
  })

  describe('share functionality', () => {
    it('copies to clipboard and shows notification', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      renderComponent()

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(
          'https://example.com/blog/test-post'
        )
      })
    })

    it('falls back to navigator.share when clipboard fails', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      const mockShare = vi.fn().mockResolvedValue(undefined)
      const mockCanShare = vi.fn().mockReturnValue(true)

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: mockCanShare,
        configurable: true,
      })

      renderComponent()

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
      })
    })

    it('falls back to execCommand when all else fails', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('failed')),
        },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: undefined,
        configurable: true,
      })

      document.execCommand = vi.fn().mockReturnValue(true)

      renderComponent()

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith('copy')
      })
    })
  })

  describe('anchor link functionality', () => {
    it('handles anchor link click with pushState', async () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState')

      renderComponent({
        contentWithIds:
          '<h2 id="test-heading" class="heading-with-anchor">Test Heading<a href="#test-heading" class="heading-anchor">Link</a></h2>',
      })

      // Mock scrollIntoView on the target element
      const heading = document.getElementById('test-heading')
      if (heading) {
        heading.scrollIntoView = vi.fn()
      }

      const anchorLink = screen.getByText('Link')
      fireEvent.click(anchorLink)

      expect(pushStateSpy).toHaveBeenCalledWith(null, '', '#test-heading')
    })

    it('copies link to clipboard on anchor click', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      renderComponent({
        contentWithIds:
          '<h2 id="test-heading">Test Heading<a href="#test-heading" class="heading-anchor">Link</a></h2>',
      })

      const heading = document.getElementById('test-heading')
      if (heading) {
        heading.scrollIntoView = vi.fn()
      }

      const anchorLink = screen.getByText('Link')
      fireEvent.click(anchorLink)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled()
      })
    })

    it('shows error notification when anchor clipboard copy fails', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      renderComponent({
        contentWithIds:
          '<h2 id="test-heading">Test Heading<a href="#test-heading" class="heading-anchor">Link</a></h2>',
      })

      const heading = document.getElementById('test-heading')
      if (heading) {
        heading.scrollIntoView = vi.fn()
      }

      const anchorLink = screen.getByText('Link')
      fireEvent.click(anchorLink)

      await waitFor(() => {
        expect(
          screen.getByText('post.notifications.shareError')
        ).toBeInTheDocument()
      })
    })

    it('does nothing when anchor has no href', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState')

      renderComponent({
        contentWithIds:
          '<h2 id="test-heading">Test Heading<a class="heading-anchor">Link</a></h2>',
      })

      const anchorLink = screen.getByText('Link')
      fireEvent.click(anchorLink)

      expect(pushStateSpy).not.toHaveBeenCalled()
    })

    it('ignores clicks on non-anchor elements', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState')

      renderComponent({
        contentWithIds:
          '<h2 id="test-heading">Test Heading</h2><p class="some-text">Regular text</p>',
      })

      fireEvent.click(screen.getByText('Regular text'))
      expect(pushStateSpy).not.toHaveBeenCalled()
    })
  })

  describe('hash fragment navigation', () => {
    const originalScrollIntoView = Element.prototype.scrollIntoView

    afterEach(() => {
      Element.prototype.scrollIntoView = originalScrollIntoView
    })

    it('scrolls to element when hash is present on load', async () => {
      // Mock scrollIntoView on all elements before rendering
      Element.prototype.scrollIntoView = vi.fn()

      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://example.com/blog/test-post#getting-started',
          hash: '#getting-started',
        },
        writable: true,
        configurable: true,
      })

      renderComponent({
        contentWithIds:
          '<h2 id="getting-started">Getting Started</h2><p>Content</p>',
      })

      const targetElement = document.getElementById('getting-started')
      if (targetElement) {
        // Set dimensions so the visibility check passes
        Object.defineProperty(targetElement, 'getBoundingClientRect', {
          value: () => ({ width: 100, height: 50 }),
        })
      }

      // Let requestAnimationFrame callback fire
      await vi.waitFor(() => {
        expect(global.requestAnimationFrame).toHaveBeenCalled()
      })
    })

    it('retries when element is not visible', async () => {
      Element.prototype.scrollIntoView = vi.fn()

      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://example.com/blog/test-post#nonexistent',
          hash: '#nonexistent',
        },
        writable: true,
        configurable: true,
      })

      renderComponent()

      await vi.waitFor(() => {
        expect(global.requestAnimationFrame).toHaveBeenCalled()
      })
    })
  })

  describe('share functionality - additional paths', () => {
    it('uses shareTextFallback when post excerpt is empty', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      const mockShare = vi.fn().mockResolvedValue(undefined)
      const mockCanShare = vi.fn().mockReturnValue(true)

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: mockCanShare,
        configurable: true,
      })

      renderComponent({ post: { ...mockPost, excerpt: '' } })

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
      })
    })

    it('falls back to execCommand when canShare returns false', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('failed')),
        },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: vi.fn(),
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: vi.fn().mockReturnValue(false),
        configurable: true,
      })

      document.execCommand = vi.fn().mockReturnValue(true)

      renderComponent()

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith('copy')
      })
    })

    it('shows error when execCommand returns false', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('failed')),
        },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: undefined,
        configurable: true,
      })

      document.execCommand = vi.fn().mockReturnValue(false)

      renderComponent()

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(
          screen.getByText('post.notifications.shareError')
        ).toBeInTheDocument()
      })
    })

    it('shows error notification when all share methods fail', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('failed')),
        },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: undefined,
        configurable: true,
      })

      document.execCommand = vi.fn().mockImplementation(() => {
        throw new Error('execCommand not supported')
      })

      renderComponent()

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(
          screen.getByText('post.notifications.shareError')
        ).toBeInTheDocument()
      })
    })

    it('disables share button during sharing to prevent rapid clicks', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      renderComponent()

      const shareButton = screen.getByTitle('post.sharePost')
      fireEvent.click(shareButton)

      // Button should be disabled while sharing is in progress
      expect(shareButton).toBeDisabled()

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledTimes(1)
      })

      // Button should be re-enabled after sharing completes
      await waitFor(() => {
        expect(shareButton).not.toBeDisabled()
      })
    })
  })

  describe('analytics', () => {
    it('calls useBlogAnalytics with correct data', () => {
      renderComponent()

      expect(mockUseBlogAnalytics).toHaveBeenCalledWith({
        slug: 'test-post',
        category: 'Testing',
        title: 'Test Blog Post',
      })
    })
  })

  describe('rendering edge cases', () => {
    it('renders featured image with title as alt when imageAlt is not provided', () => {
      renderComponent({
        post: { ...mockPost, imageAlt: undefined },
      })
      const img = screen.getByAltText('Test Blog Post')
      expect(img).toBeInTheDocument()
    })

    it('renders team member image when available', () => {
      renderComponent()
      const authorImage = screen.getByAltText('Test Author')
      expect(authorImage).toBeInTheDocument()
      expect(authorImage).toHaveAttribute('src', '/test-author.jpg')
    })

    it('renders social links with correct target for mailto links', () => {
      renderComponent()
      const emailLink = screen.getByRole('img', { name: 'Email' }).closest('a')
      expect(emailLink).toHaveAttribute('target', '_self')
      expect(emailLink).not.toHaveAttribute('rel')
    })

    it('renders social links with _blank target for external links', () => {
      renderComponent()
      const linkedInLink = screen
        .getByRole('img', { name: 'LinkedIn' })
        .closest('a')
      expect(linkedInLink).toHaveAttribute('target', '_blank')
      expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('does not render social links when team member has no social links', () => {
      renderComponent({
        teamMember: { ...mockTeamMember, socialLinks: [] },
      })
      expect(
        screen.queryByRole('img', { name: 'LinkedIn' })
      ).not.toBeInTheDocument()
    })

    it('skips social icon when icon name not in map', () => {
      renderComponent({
        teamMember: {
          ...mockTeamMember,
          socialLinks: [
            { name: 'UnknownNetwork' as never, href: 'https://example.com' },
          ],
        },
      })
      // Should not render any social icons
      expect(
        screen.queryByRole('img', { name: 'LinkedIn' })
      ).not.toBeInTheDocument()
    })
  })
})
