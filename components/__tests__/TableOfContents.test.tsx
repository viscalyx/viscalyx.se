import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TableOfContents from '@/components/TableOfContents'

import type { TocItem } from '@/lib/slug-utils-client'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock BlogIcons
vi.mock('@/components/BlogIcons', () => ({
  ChevronUpIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="chevron-up-icon" />
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="chevron-down-icon" />
  ),
}))

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
const intersectionObserverInstances: MockIntersectionObserver[] = []

class MockIntersectionObserver {
  observe = mockObserve
  disconnect = mockDisconnect
  unobserve = vi.fn()
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    intersectionObserverInstances.push(this)
  }
}

// Mock ResizeObserver
const mockResizeObserve = vi.fn()
const mockResizeDisconnect = vi.fn()

class MockResizeObserver {
  observe = mockResizeObserve
  disconnect = mockResizeDisconnect
  unobserve = vi.fn()
  constructor(public callback: ResizeObserverCallback) {}
}

// Global observers are stubbed in the inner beforeEach where mocks are cleared

const mockItems: TocItem[] = [
  { id: 'introduction', text: 'Introduction', level: 2 },
  { id: 'getting-started', text: 'Getting Started', level: 2 },
  { id: 'installation', text: 'Installation', level: 3 },
  { id: 'configuration', text: 'Configuration', level: 3 },
  { id: 'conclusion', text: 'Conclusion', level: 2 },
]

describe('TableOfContents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    intersectionObserverInstances.length = 0
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders all heading items', () => {
    render(<TableOfContents items={mockItems} />)

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
    expect(screen.getByText('Installation')).toBeInTheDocument()
    expect(screen.getByText('Configuration')).toBeInTheDocument()
    expect(screen.getByText('Conclusion')).toBeInTheDocument()
  })

  it('renders as a nav element', () => {
    render(<TableOfContents items={mockItems} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('uses aria-label when headingId is not provided', () => {
    render(<TableOfContents items={mockItems} />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'tableOfContents')
  })

  it('uses aria-labelledby when headingId is provided', () => {
    render(<TableOfContents headingId="toc-heading" items={mockItems} />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-labelledby', 'toc-heading')
    expect(nav).not.toHaveAttribute('aria-label')
  })

  it('renders scrollable region with aria-label', () => {
    render(<TableOfContents items={mockItems} />)
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-label', 'tableOfContents')
  })

  it('renders items as buttons', () => {
    render(<TableOfContents items={mockItems} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(mockItems.length)
  })

  it('applies indentation for level 3 items', () => {
    const { container } = render(<TableOfContents items={mockItems} />)
    const listItems = container.querySelectorAll('li')
    // Level 3 items (Installation, Configuration) should have ml-4 class
    expect(listItems[2]).toHaveClass('ml-4')
    expect(listItems[3]).toHaveClass('ml-4')
    // Level 2 items should not have ml-4
    expect(listItems[0]).not.toHaveClass('ml-4')
  })

  it('handles empty items array', () => {
    render(<TableOfContents items={[]} />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('scrolls to heading and updates URL hash on click', () => {
    const mockScrollIntoView = vi.fn()
    const mockPushState = vi.fn()
    vi.spyOn(window.history, 'pushState').mockImplementation(mockPushState)

    // Create a mock heading element
    const heading = document.createElement('h2')
    heading.id = 'introduction'
    heading.scrollIntoView = mockScrollIntoView
    document.body.appendChild(heading)

    render(<TableOfContents items={mockItems} />)

    fireEvent.click(screen.getByText('Introduction'))

    expect(mockPushState).toHaveBeenCalledWith(null, '', '#introduction')
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })

    document.body.removeChild(heading)
  })

  it('observes headings with IntersectionObserver', () => {
    // Create mock heading elements in the DOM
    const headings = mockItems.map(item => {
      const el = document.createElement('h2')
      el.id = item.id
      document.body.appendChild(el)
      return el
    })

    render(<TableOfContents items={mockItems} />)

    expect(mockObserve).toHaveBeenCalledTimes(mockItems.length)

    // Cleanup
    headings.forEach(el => {
      document.body.removeChild(el)
    })
  })

  it('applies sm maxHeight class', () => {
    const { container } = render(
      <TableOfContents items={mockItems} maxHeight="sm" />,
    )
    const scrollable = container.querySelector('.toc-scrollable')
    expect(scrollable).toHaveClass('max-h-64')
  })

  it('applies lg maxHeight class by default', () => {
    const { container } = render(<TableOfContents items={mockItems} />)
    const scrollable = container.querySelector('.toc-scrollable')
    expect(scrollable).toHaveClass('max-h-80')
  })

  it('sets up ResizeObserver on scroll container', () => {
    render(<TableOfContents items={mockItems} />)
    expect(mockResizeObserve).toHaveBeenCalled()
  })

  it('sets data-id attribute on buttons for active tracking', () => {
    render(<TableOfContents items={mockItems} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveAttribute('data-id', 'introduction')
    expect(buttons[1]).toHaveAttribute('data-id', 'getting-started')
  })

  it('marks intersecting heading as active', () => {
    const heading = document.createElement('h2')
    heading.id = 'installation'
    document.body.appendChild(heading)

    try {
      render(<TableOfContents items={mockItems} />)
      expect(intersectionObserverInstances.length).toBeGreaterThan(0)
      act(() => {
        intersectionObserverInstances[0].callback(
          [
            {
              isIntersecting: true,
              target: heading,
            } as unknown as IntersectionObserverEntry,
          ],
          intersectionObserverInstances[0] as unknown as IntersectionObserver,
        )
      })

      const activeButton = screen.getByRole('button', { name: 'Installation' })
      expect(activeButton).toHaveAttribute('aria-current', 'location')
    } finally {
      heading.remove()
    }
  })

  it('auto-scrolls toc when active item is outside visible area', async () => {
    const heading = document.createElement('h2')
    heading.id = 'conclusion'
    document.body.appendChild(heading)

    try {
      const { container } = render(<TableOfContents items={mockItems} />)
      const scrollContainer = container.querySelector(
        '.toc-scrollable',
      ) as HTMLDivElement
      const scrollToSpy = vi.fn()
      Object.defineProperty(scrollContainer, 'scrollTo', {
        value: scrollToSpy,
        writable: true,
        configurable: true,
      })

      const targetButton = screen.getByRole('button', { name: 'Conclusion' })
      Object.defineProperty(targetButton, 'offsetTop', {
        value: 400,
        configurable: true,
      })
      Object.defineProperty(targetButton, 'offsetHeight', {
        value: 20,
        configurable: true,
      })
      Object.defineProperty(scrollContainer, 'clientHeight', {
        value: 100,
        configurable: true,
      })
      scrollContainer.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        left: 0,
        right: 200,
        bottom: 100,
        width: 200,
        height: 100,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      }))
      ;(targetButton as HTMLElement).getBoundingClientRect = vi.fn(() => ({
        top: 200,
        left: 0,
        right: 200,
        bottom: 220,
        width: 200,
        height: 20,
        x: 0,
        y: 200,
        toJSON: vi.fn(),
      }))

      expect(intersectionObserverInstances.length).toBeGreaterThan(0)
      act(() => {
        intersectionObserverInstances[0].callback(
          [
            {
              isIntersecting: true,
              target: heading,
            } as unknown as IntersectionObserverEntry,
          ],
          intersectionObserverInstances[0] as unknown as IntersectionObserver,
        )
      })

      await waitFor(() => {
        expect(scrollToSpy).toHaveBeenCalled()
      })
    } finally {
      heading.remove()
    }
  })

  it('does not push hash or scroll when clicked heading is missing', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState')
    render(<TableOfContents items={mockItems} />)

    fireEvent.click(screen.getByText('Introduction'))

    expect(pushStateSpy).not.toHaveBeenCalled()
  })

  it('supports keyboard scrolling shortcuts inside the toc region', () => {
    const { container } = render(<TableOfContents items={mockItems} />)
    const region = screen.getByRole('region')
    const scrollContainer = container.querySelector(
      '.toc-scrollable',
    ) as HTMLElement
    const scrollBySpy = vi.fn()
    const scrollToSpy = vi.fn()
    Object.defineProperty(scrollContainer, 'scrollBy', {
      value: scrollBySpy,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollTo', {
      value: scrollToSpy,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'clientHeight', {
      value: 200,
      configurable: true,
    })
    Object.defineProperty(scrollContainer, 'scrollHeight', {
      value: 700,
      configurable: true,
    })

    fireEvent.keyDown(region, { key: 'ArrowDown' })
    fireEvent.keyDown(region, { key: 'ArrowUp' })
    fireEvent.keyDown(region, { key: 'PageDown' })
    fireEvent.keyDown(region, { key: 'PageUp' })
    fireEvent.keyDown(region, { key: 'Home' })
    fireEvent.keyDown(region, { key: 'End' })
    fireEvent.keyDown(region, { key: 'Tab' })

    expect(scrollBySpy).toHaveBeenNthCalledWith(1, {
      top: 40,
      behavior: 'smooth',
    })
    expect(scrollBySpy).toHaveBeenNthCalledWith(2, {
      top: -40,
      behavior: 'smooth',
    })
    expect(scrollBySpy).toHaveBeenNthCalledWith(3, {
      top: 160,
      behavior: 'smooth',
    })
    expect(scrollBySpy).toHaveBeenNthCalledWith(4, {
      top: -160,
      behavior: 'smooth',
    })
    expect(scrollToSpy).toHaveBeenNthCalledWith(1, {
      top: 0,
      behavior: 'smooth',
    })
    expect(scrollToSpy).toHaveBeenNthCalledWith(2, {
      top: 700,
      behavior: 'smooth',
    })
    expect(scrollBySpy).toHaveBeenCalledTimes(4)
    expect(scrollToSpy).toHaveBeenCalledTimes(2)
  })
})
