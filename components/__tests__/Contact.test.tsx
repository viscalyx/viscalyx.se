import { act, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import React from 'react'
import Contact from '../Contact'
import { suppressConsoleErrors } from './suppressConsoleErrors'

// Mock translations
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', props),
}))

// Mock framer-motion to filter out animation props
vi.mock('framer-motion', () => {
  const React = require('react')
  const motion: Record<
    string,
    React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>
  > = {}
  ;['div', 'button'].forEach(tag => {
    motion[tag] = (
      props: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
    ) => React.createElement(tag, props, props.children)
  })
  return { motion }
})

// Mock lucide-react icons by filtering out unwanted props
vi.mock('lucide-react', () => {
  const React = require('react')
  const icons = ['Mail', 'Phone', 'MapPin', 'Send', 'Clock', 'CheckCircle']
  const exportObj: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {}
  icons.forEach(name => {
    exportObj[name] = (props: React.SVGProps<SVGSVGElement>) =>
      React.createElement(
        'svg',
        { 'data-testid': name, ...props },
        props.children
      )
  })
  return exportObj
})

// Suppress framer-motion animation prop warnings
beforeAll(() => {
  suppressConsoleErrors()
})

describe('Contact component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders contact section with title, description and form fields', () => {
    const { container } = render(<Contact />)

    // Section id present
    expect(container.querySelector('section#contact')).toBeInTheDocument()

    // Title and description
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('titleHighlight')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()

    // Form fields by label
    expect(screen.getByLabelText('form.fields.name.label')).toBeInTheDocument()
    expect(screen.getByLabelText('form.fields.email.label')).toBeInTheDocument()
    expect(
      screen.getByLabelText('form.fields.company.label')
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText('form.fields.message.label')
    ).toBeInTheDocument()
  })

  it('shows and hides success message on form submit', () => {
    const { container } = render(<Contact />)
    // Submit the form
    const form = screen.getByTestId('contact-form')
    expect(form).toBeInTheDocument()
    fireEvent.submit(form)

    // Success message appears
    expect(screen.getByText('form.successMessage')).toBeInTheDocument()
    expect(screen.getByTestId('CheckCircle')).toBeInTheDocument()

    // Hide after timeout
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByText('form.successMessage')).not.toBeInTheDocument()
  })
})
