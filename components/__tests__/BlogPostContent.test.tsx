import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

import type { BlogPostContentProps } from '../BlogPostContent'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => {
      const translations: { [key: string]: string } = {
        'post.notifications.linkCopied': 'Link copied to clipboard!',
        'post.notifications.shareError': 'Failed to share link',
        'post.notifications.shareTextWithExcerpt':
          'Check out this post: {excerpt} - {title}',
        'post.notifications.shareTextFallback': 'Check out this post: {title}',
        'post.readingProgress': 'Reading Progress',
        'post.backToBlog': 'Back to Blog',
        'post.share': 'Share:',
        'post.sharePost': 'Share this post',
        'post.tableOfContents': 'Table of Contents',
        'post.relatedArticles': 'Related Articles',
        'post.authorBio.viewProfile': 'View Profile',
      }
      return translations[key] || key
    }
    return t
  },
  useFormatter: () => ({
    dateTime: () => 'Jan 1, 2025',
  }),
  useLocale: () => 'en',
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/en/blog/test-post',
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
    React.createElement('div', { 'data-testid': 'code-block-enhancer' }),
}))

vi.mock('@/components/ImageEnhancer', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'image-enhancer' }),
}))

vi.mock('@/components/MermaidRenderer', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'mermaid-renderer' }),
}))

vi.mock('@/components/ReadingProgress', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'reading-progress' }),
}))

vi.mock('@/components/ScrollToTop', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'scroll-to-top' }),
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
      { 'data-testid': 'table-of-contents' },
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
        { className, 'data-testid': 'icon-email' },
        'Email'
      ),
    LinkedIn: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, 'data-testid': 'icon-linkedin' },
        'LinkedIn'
      ),
    GitHub: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, 'data-testid': 'icon-github' },
        'GitHub'
      ),
    Bluesky: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, 'data-testid': 'icon-bluesky' },
        'Bluesky'
      ),
    Mastodon: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, 'data-testid': 'icon-mastodon' },
        'Mastodon'
      ),
    X: ({ className }: { className?: string }) =>
      React.createElement('span', { className, 'data-testid': 'icon-x' }, 'X'),
    Discord: ({ className }: { className?: string }) =>
      React.createElement(
        'span',
        { className, 'data-testid': 'icon-discord' },
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
import BlogPostContent from '../BlogPostContent'

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

const defaultProps: BlogPostContentProps = {
  post: mockPost,
  contentWithIds:
    '<h2 id="getting-started">Getting Started</h2><p>Test content</p>',
  relatedPosts: mockRelatedPosts,
  tableOfContents: mockTableOfContents,
  teamMember: mockTeamMember,
  authorInitials: 'TA',
}

const renderComponent = (overrides: Partial<BlogPostContentProps> = {}) =>
  render(<BlogPostContent {...defaultProps} {...overrides} />)

describe('BlogPostContent', () => {
  let originalClipboard: Clipboard | undefined
  let originalNavigator: Navigator

  beforeEach(() => {
    vi.clearAllMocks()
    originalClipboard = navigator.clipboard
    originalNavigator = navigator

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
      value: originalNavigator.share,
      configurable: true,
    })
    Object.defineProperty(navigator, 'canShare', {
      value: originalNavigator.canShare,
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
      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('renders Back to Blog link', () => {
      renderComponent()
      expect(screen.getByText('Back to Blog')).toBeInTheDocument()
    })

    it('renders post content via dangerouslySetInnerHTML', () => {
      renderComponent()
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })
  })

  describe('sub-components', () => {
    it('renders ReadingProgress', () => {
      renderComponent()
      expect(screen.getByTestId('reading-progress')).toBeInTheDocument()
    })

    it('renders CodeBlockEnhancer', () => {
      renderComponent()
      expect(screen.getByTestId('code-block-enhancer')).toBeInTheDocument()
    })

    it('renders MermaidRenderer', () => {
      renderComponent()
      expect(screen.getByTestId('mermaid-renderer')).toBeInTheDocument()
    })

    it('renders ImageEnhancer', () => {
      renderComponent()
      expect(screen.getByTestId('image-enhancer')).toBeInTheDocument()
    })

    it('renders ScrollToTop', () => {
      renderComponent()
      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
    })
  })

  describe('table of contents', () => {
    it('renders desktop ToC with items', () => {
      renderComponent()
      const tocElements = screen.getAllByTestId('table-of-contents')
      // Desktop + mobile
      expect(tocElements.length).toBeGreaterThanOrEqual(1)
    })

    it('does not render ToC when empty', () => {
      renderComponent({ tableOfContents: [] })
      expect(screen.queryByTestId('table-of-contents')).not.toBeInTheDocument()
    })

    it('renders ToC heading text', () => {
      renderComponent()
      const headings = screen.getAllByText('Table of Contents')
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
      expect(link1).toHaveAttribute('href', '/blog/related-1')
    })

    it('renders related articles heading', () => {
      renderComponent()
      expect(screen.getByText('Related Articles')).toBeInTheDocument()
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
      expect(screen.getByText('View Profile')).toBeInTheDocument()
    })

    it('renders social icon links from serializable data', () => {
      renderComponent()
      expect(screen.getByTestId('icon-linkedin')).toBeInTheDocument()
      expect(screen.getByTestId('icon-github')).toBeInTheDocument()
      expect(screen.getByTestId('icon-email')).toBeInTheDocument()
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
        el => !el.closest('a') && el.closest('.author-bio')
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

      const shareButton = screen.getByTitle('Share this post')
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

      const shareButton = screen.getByTitle('Share this post')
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

      const shareButton = screen.getByTitle('Share this post')
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
})
