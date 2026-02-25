import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import * as cookieConsent from '@/lib/cookie-consent'

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
    viewCookiesAriaLabel: 'View Cookies for {categoryName} ({count} cookies)',
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

const renderWithIntl = (component: ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  )
}

describe('CookieConsentBanner', () => {
  let user: ReturnType<typeof userEvent.setup>
  const mockGetConsentSettings = vi.mocked(cookieConsent.getConsentSettings)
  const mockSaveConsentSettings = vi.mocked(cookieConsent.saveConsentSettings)
  const mockCleanupCookies = vi.mocked(cookieConsent.cleanupCookies)

  beforeEach(() => {
    vi.clearAllMocks()
    user = userEvent.setup()
    mockGetConsentSettings.mockReturnValue(null)
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

    await user.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      expect(screen.getByText('Cookie Settings')).toBeInTheDocument()
      expect(screen.getByText('Strictly Necessary Cookies')).toBeInTheDocument()
      expect(screen.getByText('Preference Cookies')).toBeInTheDocument()
      expect(screen.getByText('Analytics Cookies')).toBeInTheDocument()
    })
  })

  it('opens detailed settings when Learn more is clicked', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.getByText('Learn more')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Learn more'))

    await waitFor(() => {
      expect(screen.getByText('Cookie Settings')).toBeInTheDocument()
    })
  })

  it('should accept all cookies when Accept All is clicked', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.getByText('Accept All')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Accept All'))

    await waitFor(() => {
      expect(mockSaveConsentSettings).toHaveBeenCalledWith({
        'strictly-necessary': true,
        analytics: true,
        preferences: true,
      })
    })
  })

  it('should reject all cookies when Reject All is clicked', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.getByText('Reject All')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Reject All'))

    await waitFor(() => {
      expect(mockSaveConsentSettings).toHaveBeenCalledWith({
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      })
      expect(mockCleanupCookies).toHaveBeenCalled()
    })
  })

  it('does not render banner when consent already exists', async () => {
    mockGetConsentSettings.mockReturnValue({
      'strictly-necessary': true,
      analytics: true,
      preferences: true,
    })

    renderWithIntl(<CookieConsentBanner />)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should show required badge for strictly necessary cookies', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await user.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument()
    })
  })

  it('should allow toggling of non-essential cookie categories', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await user.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      const analyticsToggle = screen.getByLabelText(/Analytics Cookies/i)
      expect(analyticsToggle).toBeInTheDocument()
      expect(analyticsToggle).not.toBeChecked()
    })

    const analyticsToggle = screen.getByLabelText(/Analytics Cookies/i)
    await user.click(analyticsToggle)
    expect(analyticsToggle).toBeChecked()
  })

  it('should not allow toggling of strictly necessary cookies', async () => {
    renderWithIntl(<CookieConsentBanner />)

    await user.click(screen.getByText('Customize Settings'))

    await waitFor(() => {
      const necessaryToggle = screen.getByLabelText(
        /Strictly Necessary Cookies/i,
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
          'cookie-banner-description',
        )
        expect(dialog).toHaveAttribute('aria-live', 'polite')
      })
    })

    it('does not change body layout styles when banner is visible', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await waitFor(() => {
        expect(document.body.style.paddingBottom).toBe('')
      })
    })

    it('keeps body layout styles unchanged when banner is closed', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await waitFor(() => {
        expect(screen.getByText('Accept All')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Accept All'))

      await waitFor(() => {
        expect(document.body.style.paddingBottom).toBe('')
      })
    })

    it('closes detailed settings view using close button', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await user.click(screen.getByText('Customize Settings'))

      await waitFor(() => {
        expect(screen.getByText('Cookie Settings')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: 'Close' }))

      await waitFor(() => {
        expect(screen.queryByText('Cookie Settings')).not.toBeInTheDocument()
        expect(screen.getByText('We Use Cookies')).toBeInTheDocument()
      })
    })

    it('saves custom preferences from detailed view', async () => {
      renderWithIntl(<CookieConsentBanner />)
      await user.click(screen.getByText('Customize Settings'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Save Preferences' }),
        ).toBeInTheDocument()
      })

      const analyticsToggle = screen.getByLabelText(/Analytics Cookies/i)
      await user.click(analyticsToggle)
      await user.click(screen.getByRole('button', { name: 'Save Preferences' }))

      await waitFor(() => {
        expect(mockSaveConsentSettings).toHaveBeenCalledWith({
          'strictly-necessary': true,
          analytics: true,
          preferences: false,
        })
        expect(mockCleanupCookies).toHaveBeenCalledWith({
          'strictly-necessary': true,
          analytics: true,
          preferences: false,
        })
      })
    })

    it('moves focus to reject button when Escape is pressed', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await waitFor(() => {
        expect(screen.getByText('Accept All')).toBeInTheDocument()
      })

      fireEvent.keyDown(document, { key: 'Escape' })

      const rejectButton = screen.getByRole('button', { name: 'Reject All' })
      expect(rejectButton).toHaveFocus()
    })

    it('restores previously focused element after closing banner', async () => {
      const outsideButton = document.createElement('button')
      outsideButton.textContent = 'outside'
      document.body.appendChild(outsideButton)
      outsideButton.focus()

      try {
        renderWithIntl(<CookieConsentBanner />)
        await waitFor(() => {
          expect(screen.getByText('Accept All')).toBeInTheDocument()
        })

        await user.click(screen.getByText('Accept All'))

        await waitFor(() => {
          expect(outsideButton).toHaveFocus()
        })
      } finally {
        outsideButton.remove()
      }
    })

    it('traps focus within banner with Tab and Shift+Tab', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const learnMoreButton = screen.getByText('Learn more')
      const acceptAllButton = screen.getByRole('button', { name: 'Accept All' })

      // This asserts the banner's custom keydown focus-trap logic, which wraps
      // focus between the last and first focusable controls in the dialog.
      acceptAllButton.focus()
      fireEvent.keyDown(document, { key: 'Tab' })
      await waitFor(() => {
        expect(learnMoreButton).toHaveFocus()
      })

      learnMoreButton.focus()
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
      await waitFor(() => {
        expect(acceptAllButton).toHaveFocus()
      })
    })

    it('should have proper aria labels for toggle switches in detailed view', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await user.click(screen.getByText('Customize Settings'))

      await waitFor(() => {
        const analyticsToggle = screen.getByLabelText(/Analytics Cookies/i)
        expect(analyticsToggle).toHaveAttribute(
          'aria-describedby',
          'analytics-description',
        )
        expect(analyticsToggle).toHaveAttribute('id', 'toggle-analytics')
      })
    })

    it('should have accessible cookie details in settings view', async () => {
      renderWithIntl(<CookieConsentBanner />)

      await user.click(screen.getByText('Customize Settings'))

      await waitFor(() => {
        const viewCookiesButton = screen.getByText(/View Cookies \(1\)/)
        expect(viewCookiesButton).toHaveAttribute('aria-label')
        expect(viewCookiesButton.getAttribute('aria-label')).toContain(
          'View Cookies for',
        )
        expect(viewCookiesButton.getAttribute('aria-label')).toMatch(
          /\(\d+ cookies\)/,
        )
      })
    })
  })
})
