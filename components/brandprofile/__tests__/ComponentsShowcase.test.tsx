import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ComponentsShowcase from '../ComponentsShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations = {
      'buttons.title': 'Buttons',
      'buttons.description':
        'Primary and secondary button styles with hover states',
      'buttons.primary': 'Primary Button',
      'buttons.secondary': 'Secondary Button',
      'buttons.disabled': 'Disabled Button',
      'cards.title': 'Cards',
      'cards.description': 'Standard card component with hover effects',
      'cards.cardTitle': 'Card Title',
      'cards.cardDescription':
        'This is a sample card component with hover effects and proper spacing.',
      'cards.anotherCard': 'Another Card',
      'cards.anotherCardDescription':
        'Cards maintain consistent styling and responsive behavior.',
      'alerts.title': 'Alerts',
      'alerts.description': 'Status indicators and notification styles',
      'alerts.success': 'Success message',
      'alerts.warning': 'Warning message',
      'alerts.error': 'Error message',
      'alerts.info': 'Info message',
      'forms.title': 'Forms',
      'forms.description': 'Input fields and form controls',
      'forms.emailLabel': 'Email',
      'forms.emailPlaceholder': 'Enter your email',
      'forms.messageLabel': 'Message',
      'forms.messagePlaceholder': 'Your message here',
    }
    return translations[key as keyof typeof translations] || key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ComponentsShowcase', () => {
  it('renders all component sections with localized content', () => {
    render(<ComponentsShowcase />)

    // Check that all main sections are rendered
    expect(screen.getByText('Buttons')).toBeInTheDocument()
    expect(screen.getByText('Cards')).toBeInTheDocument()
    expect(screen.getByText('Alerts')).toBeInTheDocument()
    expect(screen.getByText('Forms')).toBeInTheDocument()
  })

  it('renders button components with localized text', () => {
    render(<ComponentsShowcase />)

    expect(screen.getByText('Primary Button')).toBeInTheDocument()
    expect(screen.getByText('Secondary Button')).toBeInTheDocument()
    expect(screen.getByText('Disabled Button')).toBeInTheDocument()
  })

  it('renders card components with localized content', () => {
    render(<ComponentsShowcase />)

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Another Card')).toBeInTheDocument()
    expect(
      screen.getByText(
        'This is a sample card component with hover effects and proper spacing.'
      )
    ).toBeInTheDocument()
  })

  it('renders alert components with localized messages', () => {
    render(<ComponentsShowcase />)

    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Warning message')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('renders form components with localized labels and placeholders', () => {
    render(<ComponentsShowcase />)

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your message here')).toBeInTheDocument()
  })

  it('renders component descriptions with localized text', () => {
    render(<ComponentsShowcase />)

    expect(
      screen.getByText('Primary and secondary button styles with hover states')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Standard card component with hover effects')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Status indicators and notification styles')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Input fields and form controls')
    ).toBeInTheDocument()
  })
})
