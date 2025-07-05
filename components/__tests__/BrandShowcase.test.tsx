import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import BrandShowcase from '../BrandShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

describe('BrandShowcase', () => {
  it('renders the main heading', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Viscalyx Brand Showcase')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<BrandShowcase />)
    expect(
      screen.getByText(/Visual style guide and component library/)
    ).toBeInTheDocument()
  })

  it('renders all tab options', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Animations')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
  })

  it('displays color section by default', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()
    expect(
      screen.getByText('Secondary Colors (Gray Scale)')
    ).toBeInTheDocument()
    expect(screen.getByText('Accent Colors')).toBeInTheDocument()
  })

  it('displays primary color swatches', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('primary-600')).toBeInTheDocument()
    expect(screen.getByText('#2563eb')).toBeInTheDocument()
  })

  it('displays secondary color swatches', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('secondary-900')).toBeInTheDocument()
    expect(screen.getByText('#0f172a')).toBeInTheDocument()
  })

  it('displays accent colors with usage information', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(
      screen.getByText('Success states, confirmations')
    ).toBeInTheDocument()
  })
})
