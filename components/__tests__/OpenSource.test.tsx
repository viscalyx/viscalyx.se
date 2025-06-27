import { fireEvent, render, screen } from '@testing-library/react'
import { vi, MockedFunction } from 'vitest'
import * as nextNavigation from 'next/navigation'
import OpenSource from '../OpenSource'
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}))

// Mock translations
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

// Shared router mock for consistent push calls
const mockRouter = { push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }

// Reset mocks before each test and set default router and pathname
beforeEach(() => {
  ;(nextNavigation.useRouter as MockedFunction).mockReturnValue(mockRouter)
  ;(nextNavigation.usePathname as MockedFunction).mockReturnValue('/')
  vi.clearAllMocks()
})

describe('OpenSource component', () => {
  it('renders section and list of projects', () => {
    render(<OpenSource />)
    const section = document.querySelector('section#open-source')
    expect(section).toBeInTheDocument()

    // Should render heading
    expect(screen.getByText('title')).toBeInTheDocument()

    // Should render at least one project item
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })

  it('opens external project link on click', () => {
    window.open = vi.fn()
    render(<OpenSource />)
    // Select link by accessible label containing space
    const links = screen.getAllByRole('link', { name: /view project/i })
    expect(links.length).toBeGreaterThan(0)
    fireEvent.click(links[0])
    expect(window.open).toHaveBeenCalledWith(
      'https://github.com/dsccommunity',
      '_blank',
      'noopener noreferrer'
    )
  })

  it('scrolls to contact section when clicking collaborate button on home page', () => {
    // Setup a contact anchor in the DOM
    const contactElement = document.createElement('div')
    contactElement.id = 'contact'
    contactElement.scrollIntoView = vi.fn()
    document.body.appendChild(contactElement)
    render(<OpenSource />)
    const button = screen.getByRole('button', { name: /collaborate/i })
    fireEvent.click(button)
    expect(contactElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    })
  })

  it('navigates to contact section when clicking collaborate button from other page', () => {
    // Override pathname mock to simulate non-home page
    ;(nextNavigation.usePathname as MockedFunction).mockReturnValue('/other')
    render(<OpenSource />)
    const button = screen.getByRole('button', { name: /collaborate/i })
    fireEvent.click(button)
    expect(mockRouter.push).toHaveBeenCalledWith('/#contact')
  })

  it('renders correct number of projects and accessible list roles', () => {
    render(<OpenSource />)
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('renders images with appropriate alt text', () => {
    render(<OpenSource />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    const images = screen.getAllByRole('img')
    images.forEach((img, idx) => {
      expect(img).toHaveAttribute('alt', headings[idx].textContent || '')
    })
  })
})
