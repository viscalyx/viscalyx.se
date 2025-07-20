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

// Mock framer-motion to filter out animation props
vi.mock('framer-motion', () => {
  const React = require('react')
  const motion: Record<string, any> = {}
  ;['div', 'h1', 'span', 'p', 'button'].forEach(tag => {
    motion[tag] = ({
      children,
      initial,
      animate,
      transition,
      whileHover,
      whileTap,
      ...props
    }: any) => React.createElement(tag, props, children)
  })
  return { motion }
})

// Mock next/image
vi.mock('next/image', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({
      src,
      alt,
      fill,
      priority,
      ...props
    }: {
      src: string
      alt: string
      fill?: boolean
      priority?: boolean
      [key: string]: any
    }) => <img src={src} alt={alt} {...props} />,
  }
})

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
      expect.stringContaining('unsplash.com')
    )
  })
})
