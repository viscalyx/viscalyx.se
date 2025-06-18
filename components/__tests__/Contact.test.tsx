import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import Contact from '../Contact'

// Mock translations
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock framer-motion to filter out animation props
jest.mock('framer-motion', () => {
  const React = require('react')
  const motion: Record<string, any> = {}
  ;['div', 'button'].forEach(tag => {
    motion[tag] = ({
      children,
      initial,
      whileHover,
      whileTap,
      viewport,
      transition,
      ...props
    }: any) => React.createElement(tag, props, children)
  })
  return { motion }
})

// Mock lucide-react icons by filtering out unwanted props
jest.mock('lucide-react', () => {
  const React = require('react')
  const icons = ['Mail', 'Phone', 'MapPin', 'Send', 'Clock', 'CheckCircle']
  const exportObj: any = {}
  icons.forEach(name => {
    exportObj[name] = ({ children, className, ...props }: any) =>
      React.createElement('svg', { 'data-testid': name, className }, children)
  })
  return exportObj
})

// Suppress framer-motion animation prop warnings
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Contact component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
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
    const form = container.querySelector('form')!
    fireEvent.submit(form)

    // Success message appears
    expect(screen.getByText('form.successMessage')).toBeInTheDocument()
    expect(screen.getByTestId('CheckCircle')).toBeInTheDocument()

    // Hide after timeout
    act(() => jest.advanceTimersByTime(3000))
    expect(screen.queryByText('form.successMessage')).not.toBeInTheDocument()
  })
})
