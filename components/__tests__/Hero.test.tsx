import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

// Mock next-intl translations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}))

// Mock framer-motion to filter out animation props
jest.mock('framer-motion', () => {
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
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
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

    expect(screen.getByText('buttons.startProject')).toBeInTheDocument()
    expect(screen.getByText('buttons.exploreServices')).toBeInTheDocument()
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
