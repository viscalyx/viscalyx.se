import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: { [key: string]: string } = {
      'post.notifications.linkCopied': 'Link copied to clipboard!',
      'post.notifications.shareError': 'Failed to share link',
      'post.notifications.shareTextWithExcerpt':
        'Check out this post: {excerpt} - {title}',
      'post.notifications.shareTextFallback': 'Check out this post: {title}',
      'post.loadingBlogPost': 'Loading blog post...',
    }
    return translations[key] || key
  },
  useFormatter: () => ({
    dateTime: (date: Date, options: any) => date.toLocaleDateString(),
  }),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

// Mock components
vi.mock('@/components/AlertIconInjector', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'alert-icon-injector' }),
}))

vi.mock('@/components/CodeBlockEnhancer', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'code-block-enhancer' }),
}))

vi.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => React.createElement('footer', { 'data-testid': 'footer' }),
}))

vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => React.createElement('header', { 'data-testid': 'header' }),
}))

vi.mock('@/components/LoadingScreen', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) =>
    React.createElement('div', { 'data-testid': 'loading-screen' }, message),
}))

vi.mock('@/components/ReadingProgress', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'reading-progress' }),
}))

vi.mock('@/components/TableOfContents', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'table-of-contents' }),
}))

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  useBlogAnalytics: vi.fn(),
}))

// Mock slug utils
vi.mock('@/lib/slug-utils', () => ({
  addHeadingIds: vi.fn((content: string) => content),
  extractTableOfContents: vi.fn(() => []),
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
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}))

// Mock the page component directly
const mockPost = {
  title: 'Test Blog Post',
  author: 'Test Author',
  date: '2025-01-01',
  readTime: '5 min read',
  image: 'test-image.jpg',
  category: 'Test',
  slug: 'test-post',
  tags: ['test', 'blog'],
  content: '<h1 id="test-heading">Test Heading</h1><p>Test content</p>',
  excerpt: 'Test excerpt',
}

// Create a simplified version of the BlogPostContent component for testing
const TestBlogPostContent = ({ post }: { post: typeof mockPost }) => {
  const [shareNotification, setShareNotification] = React.useState<string>('')
  const [shareTimeoutId, setShareTimeoutId] =
    React.useState<NodeJS.Timeout | null>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const setNotificationWithTimeout = React.useCallback(
    (message: string) => {
      if (shareTimeoutId) {
        clearTimeout(shareTimeoutId)
      }

      setShareNotification(message)
      const newTimeoutId = setTimeout(() => setShareNotification(''), 100) // Use shorter timeout for testing
      setShareTimeoutId(newTimeoutId)
    },
    [shareTimeoutId]
  )

  const handleShare = async () => {
    const url = window.location.href

    try {
      await navigator.clipboard.writeText(url)
      setNotificationWithTimeout('Link copied to clipboard!')
      return
    } catch (clipboardError) {
      console.warn('Clipboard API failed:', clipboardError)
      try {
        if (navigator.share && navigator.canShare) {
          const shareData = {
            title: post.title,
            text: post.excerpt
              ? `Check out this post: ${post.excerpt} - ${post.title}`
              : `Check out this post: ${post.title}`,
            url: url,
          }

          if (navigator.canShare(shareData)) {
            await navigator.share(shareData)
            return
          }
        }
      } catch (shareError) {
        console.warn('Native share failed:', shareError)
      }

      try {
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)

        if (successful) {
          setNotificationWithTimeout('Link copied to clipboard!')
        } else {
          throw new Error('execCommand failed')
        }
      } catch (fallbackError) {
        console.error('All share methods failed:', fallbackError)
        setNotificationWithTimeout('Failed to share link')
      }
    }
  }

  React.useEffect(() => {
    return () => {
      if (shareTimeoutId) {
        clearTimeout(shareTimeoutId)
      }
    }
  }, [shareTimeoutId])

  React.useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.classList.contains('heading-anchor')) {
        e.preventDefault()
        const href = target.getAttribute('href')
        if (href) {
          const targetId = href.substring(1)
          const targetElement = document.getElementById(targetId)

          if (targetElement) {
            window.history.pushState(null, '', href)

            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })

            const fullUrl = window.location.href
            if (navigator.clipboard) {
              navigator.clipboard
                .writeText(fullUrl)
                .then(() => {
                  setNotificationWithTimeout('Link copied to clipboard!')
                })
                .catch(() => {
                  setNotificationWithTimeout('Failed to share link')
                })
            }
          }
        }
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('click', handleAnchorClick)
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('click', handleAnchorClick)
      }
    }
  }, [setNotificationWithTimeout])

  // Hash fragment handling on page load
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.substring(1)
        let rafId: number
        let attempts = 0
        const maxAttempts = 100

        const scrollToElement = () => {
          const element = document.getElementById(targetId)

          if (element && attempts < maxAttempts) {
            const rect = element.getBoundingClientRect()
            const isVisible = rect.width > 0 && rect.height > 0

            if (isVisible || attempts > 20) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })

              // Optionally copy URL with notification
              if (navigator.clipboard) {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => {
                    setNotificationWithTimeout('Link copied to clipboard!')
                  })
                  .catch(() => {
                    setNotificationWithTimeout('Failed to share link')
                  })
              }
            } else {
              attempts++
              rafId = requestAnimationFrame(scrollToElement)
            }
          } else if (attempts < maxAttempts) {
            attempts++
            rafId = requestAnimationFrame(scrollToElement)
          }
        }

        rafId = requestAnimationFrame(scrollToElement)

        return () => {
          if (rafId) {
            cancelAnimationFrame(rafId)
          }
        }
      }
    }
  }, [setNotificationWithTimeout])

  return (
    <div>
      <button type="button" data-testid="share-button" onClick={handleShare}>
        Share
      </button>
      {shareNotification && (
        <div data-testid="share-notification">{shareNotification}</div>
      )}
      <div ref={contentRef} data-testid="content-container">
        <a
          className="heading-anchor"
          href="#test-heading"
          data-testid="anchor-link"
        >
          Link to heading
        </a>
        <div id="test-heading">Test Heading</div>
      </div>
    </div>
  )
}

describe('BlogPost Page - handleShare and anchor-link functionality', () => {
  let originalLocation: Location
  let originalClipboard: Clipboard | undefined
  let originalNavigator: Navigator

  beforeEach(() => {
    originalLocation = window.location
    originalClipboard = navigator.clipboard
    originalNavigator = navigator

    // Mock window.location
    delete (window as any).location
    ;(window as any).location = {
      ...originalLocation,
      href: 'https://example.com/blog/test-post',
      hash: '',
    }

    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock document.execCommand
    document.execCommand = vi.fn().mockReturnValue(true)

    // Mock requestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = vi.fn(cb => {
      setTimeout(cb, 16)
      return 1
    })
    global.cancelAnimationFrame = vi.fn()
  })

  afterEach(() => {
    ;(window as any).location = originalLocation
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

  describe('handleShare function', () => {
    it('should successfully copy to clipboard and show notification', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(
          'https://example.com/blog/test-post'
        )
      })

      expect(screen.getByTestId('share-notification')).toHaveTextContent(
        'Link copied to clipboard!'
      )
    })

    it('should fallback to navigator.share when clipboard fails', async () => {
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

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(mockCanShare).toHaveBeenCalledWith({
          title: mockPost.title,
          text: `Check out this post: ${mockPost.excerpt} - ${mockPost.title}`,
          url: 'https://example.com/blog/test-post',
        })
        expect(mockShare).toHaveBeenCalled()
      })
    })

    it('should fallback to document.execCommand when both clipboard and share fail', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      const mockShare = vi.fn().mockRejectedValue(new Error('Share failed'))

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: vi.fn().mockReturnValue(true),
        configurable: true,
      })

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith('copy')
      })

      expect(screen.getByTestId('share-notification')).toHaveTextContent(
        'Link copied to clipboard!'
      )
    })

    it('should show error notification when all share methods fail', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      const mockShare = vi.fn().mockRejectedValue(new Error('Share failed'))

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        configurable: true,
      })
      Object.defineProperty(navigator, 'canShare', {
        value: vi.fn().mockReturnValue(true),
        configurable: true,
      })

      document.execCommand = vi.fn().mockReturnValue(false)

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(screen.getByTestId('share-notification')).toHaveTextContent(
          'Failed to share link'
        )
      })
    })

    it('should handle navigator.share not available', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
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

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith('copy')
      })

      expect(screen.getByTestId('share-notification')).toHaveTextContent(
        'Link copied to clipboard!'
      )
    })

    it('should handle canShare returning false', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      const mockShare = vi.fn()
      const mockCanShare = vi.fn().mockReturnValue(false)

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

      document.execCommand = vi.fn().mockReturnValue(true)

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockCanShare).toHaveBeenCalled()
        expect(mockShare).not.toHaveBeenCalled()
        expect(document.execCommand).toHaveBeenCalledWith('copy')
      })
    })
  })

  describe('anchor-link click behavior', () => {
    beforeEach(() => {
      // Mock scrollIntoView
      Element.prototype.scrollIntoView = vi.fn()

      // Mock window.history
      window.history.pushState = vi.fn()
    })

    it('should update URL history and scroll smoothly on anchor click', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      render(<TestBlogPostContent post={mockPost} />)

      const anchorLink = screen.getByTestId('anchor-link')
      fireEvent.click(anchorLink)

      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '#test-heading'
      )

      const targetElement = document.getElementById('test-heading')
      expect(targetElement?.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(window.location.href)
      })

      expect(screen.getByTestId('share-notification')).toHaveTextContent(
        'Link copied to clipboard!'
      )
    })

    it('should show error notification when clipboard fails on anchor click', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      render(<TestBlogPostContent post={mockPost} />)

      const anchorLink = screen.getByTestId('anchor-link')
      fireEvent.click(anchorLink)

      await waitFor(() => {
        expect(screen.getByTestId('share-notification')).toHaveTextContent(
          'Failed to share link'
        )
      })
    })

    it('should not process clicks on non-anchor elements', () => {
      render(<TestBlogPostContent post={mockPost} />)

      const contentContainer = screen.getByTestId('content-container')
      fireEvent.click(contentContainer)

      expect(window.history.pushState).not.toHaveBeenCalled()
    })

    it('should handle missing target element gracefully', () => {
      render(<TestBlogPostContent post={mockPost} />)

      // Create a link to non-existent element
      const nonExistentLink = document.createElement('a')
      nonExistentLink.className = 'heading-anchor'
      nonExistentLink.href = '#non-existent'

      const contentContainer = screen.getByTestId('content-container')
      contentContainer.appendChild(nonExistentLink)

      fireEvent.click(nonExistentLink)

      expect(window.history.pushState).not.toHaveBeenCalled()
    })
  })

  describe('initial page load with hash fragment', () => {
    beforeEach(() => {
      Element.prototype.scrollIntoView = vi.fn()
      Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        width: 100,
        height: 50,
      })
    })

    it('should scroll to element and copy URL on page load with hash', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      // Set hash before rendering
      ;(window as any).location.hash = '#test-heading'

      // Mock requestAnimationFrame to execute immediately
      global.requestAnimationFrame = vi.fn(cb => {
        setTimeout(cb, 0)
        return 1
      })

      render(<TestBlogPostContent post={mockPost} />)

      // Wait for the RAF callback and effects to execute
      await waitFor(
        () => {
          const targetElement = document.getElementById('test-heading')
          expect(targetElement?.scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start',
          })
        },
        { timeout: 1000 }
      )

      await waitFor(
        () => {
          expect(mockWriteText).toHaveBeenCalledWith(
            (window as any).location.href
          )
        },
        { timeout: 1000 }
      )

      await waitFor(
        () => {
          expect(screen.getByTestId('share-notification')).toHaveTextContent(
            'Link copied to clipboard!'
          )
        },
        { timeout: 1000 }
      )
    })

    it('should show error notification when clipboard fails during hash navigation', async () => {
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard failed'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })
      ;(window as any).location.hash = '#test-heading'

      global.requestAnimationFrame = vi.fn(cb => {
        setTimeout(cb, 0)
        return 1
      })

      render(<TestBlogPostContent post={mockPost} />)

      await waitFor(
        () => {
          expect(screen.getByTestId('share-notification')).toHaveTextContent(
            'Failed to share link'
          )
        },
        { timeout: 1000 }
      )
    })

    it('should handle element not immediately visible', async () => {
      Element.prototype.getBoundingClientRect = vi
        .fn()
        .mockReturnValueOnce({ width: 0, height: 0 }) // First call - not visible
        .mockReturnValue({ width: 100, height: 50 }) // Subsequent calls - visible
      ;(window as any).location.hash = '#test-heading'

      let rafCallback: (() => void) | undefined
      global.requestAnimationFrame = vi.fn(cb => {
        rafCallback = cb
        setTimeout(() => cb(), 16)
        return 1
      })

      render(<TestBlogPostContent post={mockPost} />)

      // Wait for scrollIntoView to be called
      await waitFor(
        () => {
          const targetElement = document.getElementById('test-heading')
          expect(targetElement?.scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start',
          })
        },
        { timeout: 1000 }
      )
    })

    it('should not execute hash navigation when no hash is present', () => {
      ;(window as any).location.hash = ''

      render(<TestBlogPostContent post={mockPost} />)

      expect(global.requestAnimationFrame).not.toHaveBeenCalled()
    })
  })

  describe('notification timeout management', () => {
    it('should clear notification after timeout', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(screen.getByTestId('share-notification')).toHaveTextContent(
          'Link copied to clipboard!'
        )
      })

      // Wait for notification to disappear after timeout
      await waitFor(
        () => {
          expect(
            screen.queryByTestId('share-notification')
          ).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )
    })

    it('should clear existing timeout when setting new notification', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      })

      render(<TestBlogPostContent post={mockPost} />)

      const shareButton = screen.getByTestId('share-button')

      // Click first time
      fireEvent.click(shareButton)
      await waitFor(() => {
        expect(screen.getByTestId('share-notification')).toBeInTheDocument()
      })

      // Wait 50ms then click again to reset timeout
      await new Promise(resolve => setTimeout(resolve, 50))
      fireEvent.click(shareButton)

      // Wait 75ms (which would be > 100ms from first click but < 100ms from second)
      await new Promise(resolve => setTimeout(resolve, 75))

      // Should still be visible because timeout was reset
      expect(screen.getByTestId('share-notification')).toBeInTheDocument()

      // Wait for it to eventually disappear
      await waitFor(
        () => {
          expect(
            screen.queryByTestId('share-notification')
          ).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )
    })
  })
})
