import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Hero from '../Hero'

// Mock next-intl translations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

describe('Hero component', () => {
  it('renders badge, title and navigation elements', () => {
    render(<Hero />)

    expect(screen.getByText('badge')).toBeInTheDocument()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('title')
    expect(heading).toHaveTextContent('titleHighlight')
    expect(heading).toHaveTextContent('titleEnd')

    expect(screen.getByText('description')).toBeInTheDocument()

    expect(screen.getByText('buttons.learnMore')).toBeInTheDocument()
  })

  it('renders hero images and cycles through them', () => {
    render(<Hero />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
    expect(images[0]).toHaveAttribute(
      'src',
      expect.stringContaining('calm-productive-engineering-culture')
    )
  })
})
