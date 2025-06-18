import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import About from '../About'

// Mock translations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock framer-motion to filter out animation props and provide necessary tags
jest.mock('framer-motion', () => {
  const React = require('react')
  const motion: Record<string, any> = {}
  ;['div', 'span', 'h2', 'p'].forEach(tag => {
    motion[tag] = ({ children, ...props }: any) =>
      React.createElement(tag, props, children)
  })
  return {
    motion,
    useInView: () => true,
    AnimatePresence: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
  }
})

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}))

describe('About component', () => {
  it('renders section with id and main headings', () => {
    const { container } = render(<About />)

    const section = container.querySelector('section#about')
    expect(section).toBeInTheDocument()

    // Badge and titles
    expect(screen.getByText('badge')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('titleHighlight')).toBeInTheDocument()

    // Four value items
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(4)

    // Image and alt
    const image = container.querySelector('img')
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('unsplash.com')
    )
    expect(image).toHaveAttribute('alt', 'visualAlt')

    // Stats values
    expect(screen.getByText('stats.taskReduction.value')).toBeInTheDocument()
    expect(screen.getByText('stats.automation.value')).toBeInTheDocument()
  })
})
