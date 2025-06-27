import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Services from '../Services'

// Mock next-intl translations
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

// Mock next/navigation
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/',
}))

// Mock framer-motion and useInView
vi.mock('framer-motion', () => {
  const React = require('react')
  const motion: Record<string, any> = {}
  ;['div', 'button', 'span', 'h2', 'p'].forEach(tag => {
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
  return { motion, useInView: () => true }
})

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const React = require('react')
  const icons = [
    'Cog',
    'Server',
    'GitBranch',
    'Shield',
    'Zap',
    'Database',
    'ArrowRight',
    'CheckCircle',
  ]
  const exportObj: any = {}
  icons.forEach(name => {
    exportObj[name] = (props: any) =>
      React.createElement('svg', { 'data-testid': name, ...props })
  })
  return exportObj
})

describe('Services component', () => {
  it('renders services section with header and service items', () => {
    const { container } = render(<Services />)

    // Section id
    const section = container.querySelector('section#services')
    expect(section).toBeInTheDocument()

    // Badge and headings
    expect(screen.getByText('badge')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('titleHighlight')).toBeInTheDocument()

    // Description
    expect(screen.getByText('description')).toBeInTheDocument()

    // Seven service items including bottom CTA
    const serviceHeadings = screen.getAllByRole('heading', { level: 3 })
    expect(serviceHeadings).toHaveLength(7)

    // Check one feature from first service
    expect(
      screen.getByText('items.taskAutomation.features.0')
    ).toBeInTheDocument()
  })
})
