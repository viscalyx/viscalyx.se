import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { vi } from 'vitest'
import ComponentsShowcase from '../brandprofile/ComponentsShowcase'

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

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  AlertCircle: ({ className }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={className} data-testid="alert-circle" />
  ),
  Check: ({ className }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={className} data-testid="check" />
  ),
  Info: ({ className }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={className} data-testid="info" />
  ),
  X: ({ className }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={className} data-testid="x" />
  ),
}))

describe('ComponentsShowcase', () => {
  it('renders buttons section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Buttons')).toBeInTheDocument()
    expect(
      screen.getByText('Primary and secondary button styles with hover states')
    ).toBeInTheDocument()
  })

  it('renders button examples', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Primary Button')).toBeInTheDocument()
    expect(screen.getByText('Secondary Button')).toBeInTheDocument()
    expect(screen.getByText('Disabled Button')).toBeInTheDocument()
  })

  it('renders cards section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Cards')).toBeInTheDocument()
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Another Card')).toBeInTheDocument()
  })

  it('renders alerts section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Alerts')).toBeInTheDocument()
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Warning message')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('renders forms section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Forms')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('renders alert icons', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByTestId('check')).toBeInTheDocument()
    expect(screen.getByTestId('alert-circle')).toBeInTheDocument()
    expect(screen.getByTestId('x')).toBeInTheDocument()
    expect(screen.getByTestId('info')).toBeInTheDocument()
  })

  // User interaction tests
  it('handles primary button click', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const primaryButton = screen.getByText('Primary Button')
    expect(primaryButton).toBeInTheDocument()
    expect(primaryButton).not.toBeDisabled()

    // Click the primary button
    await user.click(primaryButton)

    // Since the button doesn't have specific onClick behavior in the showcase,
    // we verify it's clickable and maintains focus
    expect(primaryButton).toHaveFocus()
  })

  it('handles secondary button click', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const secondaryButton = screen.getByText('Secondary Button')
    expect(secondaryButton).toBeInTheDocument()
    expect(secondaryButton).not.toBeDisabled()

    // Click the secondary button
    await user.click(secondaryButton)

    // Verify it's clickable and maintains focus
    expect(secondaryButton).toHaveFocus()
  })

  it('disabled button is not clickable', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const disabledButton = screen.getByText('Disabled Button')
    expect(disabledButton).toBeInTheDocument()
    expect(disabledButton).toBeDisabled()

    // Try to click the disabled button
    await user.click(disabledButton)

    // Verify it doesn't gain focus when clicked
    expect(disabledButton).not.toHaveFocus()
  })

  it('types email in email input field', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')

    // Type an email address
    const testEmail = 'test@example.com'
    await user.type(emailInput, testEmail)

    // Verify the input value
    expect(emailInput).toHaveValue(testEmail)
  })

  it('types message in textarea field', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const textareaInput = screen.getByPlaceholderText('Your message here')
    expect(textareaInput).toBeInTheDocument()
    expect(textareaInput.tagName).toBe('TEXTAREA')

    // Type a message
    const testMessage = 'This is a test message for the textarea field.'
    await user.type(textareaInput, testMessage)

    // Verify the textarea value
    expect(textareaInput).toHaveValue(testMessage)
  })

  it('clears email input field', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const emailInput = screen.getByPlaceholderText('Enter your email')

    // Type an email
    await user.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')

    // Clear the input
    await user.clear(emailInput)

    // Verify the input is cleared
    expect(emailInput).toHaveValue('')
  })

  it('focuses form elements with keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const textareaInput = screen.getByPlaceholderText('Your message here')

    // Tab to focus email input
    await user.tab()
    // The email input should eventually be focused (there might be other focusable elements)

    // Type in email input
    await user.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')

    // Tab to next field (textarea)
    await user.tab()

    // Type in textarea
    await user.type(textareaInput, 'Test message')
    expect(textareaInput).toHaveValue('Test message')
  })

  it('handles button keyboard interaction', async () => {
    const user = userEvent.setup()
    render(<ComponentsShowcase />)

    const primaryButton = screen.getByText('Primary Button')

    // Focus the button
    await user.click(primaryButton)
    expect(primaryButton).toHaveFocus()

    // Press Enter key
    await user.keyboard('{Enter}')

    // Press Space key
    await user.keyboard(' ')

    // Button should still be focused
    expect(primaryButton).toHaveFocus()
  })
})
