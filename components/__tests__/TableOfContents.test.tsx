import TableOfContents from '@/components/TableOfContents'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TocItem } from '@/lib/slug-utils'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock BlogIcons
vi.mock('@/components/BlogIcons', () => ({
  ChevronUpIcon: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-up-icon" className={className} />
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-down-icon" className={className} />
  ),
}))

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

class MockIntersectionObserver {
  observe = mockObserve
  disconnect = mockDisconnect
  unobserve = vi.fn()
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}
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

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
})

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
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
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
    render(<TableOfContents items={mockItems} headingId="toc-heading" />)
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
    vi.restoreAllMocks()
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
    headings.forEach(el => document.body.removeChild(el))
  })

  it('applies sm maxHeight class', () => {
    const { container } = render(
      <TableOfContents items={mockItems} maxHeight="sm" />
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
})
