import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import About from '../About'

// Mock translations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('About component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = render(<About />).container
  })

  it('renders section with id "about"', () => {
    expect(container.querySelector('section#about')).toBeInTheDocument()
  })

  it('renders badge and titles', () => {
    expect(screen.getByText('badge')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('titleHighlight')).toBeInTheDocument()
  })

  it('renders four value item headings', () => {
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(4)
  })

  it('renders image with correct src and alt attributes', () => {
    const image = screen.getByRole('img', { name: 'visualAlt' })
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('team-huddle-open-office-wide'),
    )
    expect(image).toHaveAttribute('alt', 'visualAlt')
    expect(image).toHaveAttribute('sizes', '(min-width: 1024px) 50vw, 100vw')
  })

  it('renders stats values', () => {
    expect(screen.getByText('stats.taskReduction.value')).toBeInTheDocument()
    expect(screen.getByText('stats.automation.value')).toBeInTheDocument()
  })
})
