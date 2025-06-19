import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react' // Import React
import About from '../About'

// Mock translations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock framer-motion to filter out animation props and provide necessary tags
jest.mock('framer-motion', () => {
  const React = require('react')
  const motion: Record<
    string,
    React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>
  > = {}
  ;['div', 'span', 'h2', 'p'].forEach(tag => {
    motion[tag] = (
      props: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
    ) => React.createElement(tag, props, props.children)
  })
  return {
    motion,
    useInView: () => true,
    AnimatePresence: (props: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, props.children),
  }
})

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
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
