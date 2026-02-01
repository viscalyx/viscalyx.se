import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CookieConsentBanner from '../CookieConsentBanner'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock the cookie consent utilities
vi.mock('@/lib/cookie-consent', () => ({
  getConsentSettings: vi.fn(() => null),
  saveConsentSettings: vi.fn(),
  hasConsentChoice: vi.fn(() => false),
  defaultConsentSettings: {
    'strictly-necessary': true,
    analytics: false,
    preferences: false,
  },
  cleanupCookies: vi.fn(),
  cookieRegistry: [
    {
      name: 'theme',
      category: 'preferences',
      purpose: 'Stores user theme preference',
      duration: '1 year',
    },
  ],
}))

const messages = {
  cookieConsent: {
    title: 'We Use Cookies',
    description: 'We use cookies to enhance your browsing experience.',
    learnMore: 'Learn more',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customizeSettings: 'Customize Settings',
    savePreferences: 'Save Preferences',
    cookieSettings: 'Cookie Settings',
    close: 'Close',
    required: 'Required',
    viewCookies: 'View Cookies',
    duration: 'Duration',
    provider: 'Provider',
    categories: {
      'strictly-necessary': {
        name: 'Strictly Necessary Cookies',
        description:
          'These cookies are essential for the website to function properly.',
      },
      preferences: {
        name: 'Preference Cookies',
        description: 'These cookies allow us to remember choices you make.',
      },
      analytics: {
        name: 'Analytics Cookies',
        description:
          'These cookies help us understand how visitors interact with our website.',
      },
    },
  },
}

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  )
}

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the banner when no consent choice has been made', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.getByText('We Use Cookies')).toBeInTheDocument()
      expect(screen.getByText('Accept All')).toBeInTheDocument()
      expect(screen.getByText('Reject All')).toBeInTheDocument()
      expect(screen.getByText('Customize Settings')).toBeInTheDocument()
    })
  })

  it('should show detailed settings when customize button is clicked', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.getByText('Customize Settings')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      expect(screen.getByText('Cookie Settings')).toBeInTheDocument()
      expect(screen.getByText('Strictly Necessary Cookies')).toBeInTheDocument()
      expect(screen.getByText('Preference Cookies')).toBeInTheDocument()
      expect(screen.getByText('Analytics Cookies')).toBeInTheDocument()
    })
  })

  it('should accept all cookies when Accept All is clicked', async () => {
    const { saveConsentSettings } = await import('@/lib/cookie-consent')

    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.getByText('Accept All')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Accept All'))

    await waitFor(() => {
      expect(saveConsentSettings).toHaveBeenCalledWith({
        'strictly-necessary': true,
        analytics: true,
        preferences: true,
      })
    })
  })

  it('should reject all cookies when Reject All is clicked', async () => {
    const { saveConsentSettings, cleanupCookies } = await import(
      '@/lib/cookie-consent'
    )

    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.getByText('Reject All')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Reject All'))

    await waitFor(() => {
      expect(saveConsentSettings).toHaveBeenCalledWith({
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      })
      expect(cleanupCookies).toHaveBeenCalled()
    })
  })

  it('should show required badge for strictly necessary cookies', async () => {
    renderWithIntl(<CookieConsentBanner />)

    fireEvent.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument()
    })
  })

  it('should allow toggling of non-essential cookie categories', async () => {
    renderWithIntl(<CookieConsentBanner />)

    fireEvent.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      const analyticsToggle = screen.getByLabelText(/Analytics Cookies/i)
      expect(analyticsToggle).toBeInTheDocument()
      expect(analyticsToggle).not.toBeChecked()

      fireEvent.click(analyticsToggle)
      expect(analyticsToggle).toBeChecked()
    })
  })

  it('should not allow toggling of strictly necessary cookies', async () => {
    renderWithIntl(<CookieConsentBanner />)

    fireEvent.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      const necessaryToggle = screen.getByLabelText(
        /Strictly Necessary Cookies/i
      )
      expect(necessaryToggle).toBeChecked()
      expect(necessaryToggle).toBeDisabled()
    })
  })

  describe('accessibility features', () => {
    it('should have proper ARIA attributes for dialog', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveAttribute('aria-modal', 'true')
        expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-banner-title')
        expect(dialog).toHaveAttribute(
          'aria-describedby',
          'cookie-banner-description'
        )
        expect(dialog).toHaveAttribute('aria-live', 'polite')
      })
    })

    it('should add body padding when banner is visible to prevent content overlap', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await waitFor(() => {
        expect(document.body.style.paddingBottom).toBe('200px')
      })
    })

    it('should remove body padding when banner is closed', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await waitFor(() => {
        expect(screen.getByText('Accept All')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Accept All'))

      await waitFor(() => {
        expect(document.body.style.paddingBottom).toBe('')
      })
    })

    it('should have proper aria labels for toggle switches in detailed view', async () => {
      renderWithIntl(<CookieConsentBanner />)

      fireEvent.click(screen.getByText('Customize Settings'))

      await waitFor(() => {
        const analyticsToggle = screen.getByLabelText(/Analytics Cookies/i)
        expect(analyticsToggle).toHaveAttribute(
          'aria-describedby',
          'analytics-description'
        )
        expect(analyticsToggle).toHaveAttribute('id', 'toggle-analytics')
      })
    })

    it('should have accessible cookie details in settings view', async () => {
      renderWithIntl(<CookieConsentBanner />)

      fireEvent.click(screen.getByText('Customize Settings'))

      await waitFor(() => {
        const viewCookiesButton = screen.getByText(/View Cookies \(1\)/)
        expect(viewCookiesButton).toHaveAttribute('aria-label')
        expect(viewCookiesButton.getAttribute('aria-label')).toContain(
          'View Cookies for'
        )
      })
    })
  })
})
