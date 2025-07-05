import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AnimationsShowcase from '../brandprofile/AnimationsShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'fadeIn.title': 'Fade In Animation',
      'fadeIn.description': 'Smooth opacity transition for content reveals',
      'fadeIn.content': 'This element fades in smoothly',
      'slideUp.title': 'Slide Up Animation',
      'slideUp.description': 'Content slides up with fade in effect',
      'slideUp.content': 'This element slides up from below',
      'hoverInteractions.title': 'Hover Interactions',
      'hoverInteractions.description': 'Interactive elements with hover states',
      'hoverInteractions.scaleHover': 'Hover to scale',
      'hoverInteractions.rotateHover': 'Hover to rotate',
      'hoverInteractions.liftHover': 'Hover to lift',
    }
    return translations[key] || key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Circle: ({ className }: any) => (
    <span className={className} data-testid="circle" />
  ),
  Sparkles: ({ className }: any) => (
    <span className={className} data-testid="sparkles" />
  ),
  Square: ({ className }: any) => (
    <span className={className} data-testid="square" />
  ),
}))

describe('AnimationsShowcase', () => {
  it('renders fade in animation section', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByText('Fade In Animation')).toBeInTheDocument()
    expect(
      screen.getByText('This element fades in smoothly')
    ).toBeInTheDocument()
  })

  it('renders slide up animation section', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByText('Slide Up Animation')).toBeInTheDocument()
    expect(
      screen.getByText('This element slides up from below')
    ).toBeInTheDocument()
  })

  it('renders hover interactions section', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByText('Hover Interactions')).toBeInTheDocument()
    expect(screen.getByText('Hover to scale')).toBeInTheDocument()
    expect(screen.getByText('Hover to rotate')).toBeInTheDocument()
    expect(screen.getByText('Hover to lift')).toBeInTheDocument()
  })

  it('renders hover interaction icons', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByTestId('sparkles')).toBeInTheDocument()
    expect(screen.getByTestId('circle')).toBeInTheDocument()
    expect(screen.getByTestId('square')).toBeInTheDocument()
  })
})
