import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CookieSettings from '@/components/CookieSettings'
import * as cookieConsent from '@/lib/cookie-consent'

// Mock cookie-consent lib
vi.mock('@/lib/cookie-consent', () => ({
  defaultConsentSettings: {
    'strictly-necessary': true,
    analytics: false,
    preferences: false,
  },
  getConsentSettings: vi.fn(),
  getConsentTimestamp: vi.fn(),
  saveConsentSettings: vi.fn(),
  cleanupCookies: vi.fn(),
  resetConsent: vi.fn(),
  cookieRegistry: [
    {
      name: 'test-cookie',
      category: 'strictly-necessary' as const,
      purposeKey: 'cookies.testCookie.purpose',
      durationKey: 'cookies.testCookie.duration',
      provider: 'Test Provider',
    },
  ],
}))

const mockGetConsentSettings = vi.mocked(cookieConsent.getConsentSettings)
const mockGetConsentTimestamp = vi.mocked(cookieConsent.getConsentTimestamp)
const mockSaveConsentSettings = vi.mocked(cookieConsent.saveConsentSettings)
const mockCleanupCookies = vi.mocked(cookieConsent.cleanupCookies)
const mockResetConsent = vi.mocked(cookieConsent.resetConsent)

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('CookieSettings', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    vi.resetAllMocks()
    user = userEvent.setup()
    mockGetConsentSettings.mockReturnValue(null)
    mockGetConsentTimestamp.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders cookie settings interface', () => {
    render(<CookieSettings />)

    expect(screen.getByText('cookieSettings')).toBeInTheDocument()
    expect(screen.getByText('settingsDescription')).toBeInTheDocument()
    expect(screen.getByText('acceptAll')).toBeInTheDocument()
    expect(screen.getByText('rejectAll')).toBeInTheDocument()
    expect(screen.getByText('resetConsent')).toBeInTheDocument()
  })

  it('displays cookie categories', () => {
    render(<CookieSettings />)

    expect(
      screen.getByText('categories.strictly-necessary.name'),
    ).toBeInTheDocument()
    expect(screen.getByText('categories.analytics.name')).toBeInTheDocument()
    expect(screen.getByText('categories.preferences.name')).toBeInTheDocument()
  })

  it('shows confirmation modal when reset is clicked', async () => {
    render(<CookieSettings />)

    await user.click(screen.getByText('resetConsent'))

    await waitFor(() => {
      expect(screen.getByText('resetConfirmationTitle')).toBeInTheDocument()
      expect(screen.getByText('resetConfirmation')).toBeInTheDocument()
    })
  })

  it('closes confirmation modal when cancel is clicked', async () => {
    render(<CookieSettings />)

    await user.click(screen.getByText('resetConsent'))

    await waitFor(() => {
      expect(screen.getByText('cancel')).toBeInTheDocument()
    })

    await user.click(screen.getByText('cancel'))

    await waitFor(() => {
      expect(
        screen.queryByText('resetConfirmationTitle'),
      ).not.toBeInTheDocument()
    })
  })

  it('resets consent when confirmed', async () => {
    render(<CookieSettings />)

    await user.click(screen.getByText('resetConsent'))

    await waitFor(() => {
      expect(screen.getByText('confirmReset')).toBeInTheDocument()
    })

    await user.click(screen.getByText('confirmReset'))

    await waitFor(() => {
      expect(mockResetConsent).toHaveBeenCalledTimes(1)
    })
  })

  it('saves settings when save button is clicked', async () => {
    render(<CookieSettings />)

    await user.click(screen.getByText('savePreferences'))

    await waitFor(() => {
      expect(mockSaveConsentSettings).toHaveBeenCalledTimes(1)
      expect(mockCleanupCookies).toHaveBeenCalledTimes(1)
    })
  })

  it('accepts all cookies when Accept All is clicked', async () => {
    const onSettingsChange = vi.fn()
    render(<CookieSettings onSettingsChange={onSettingsChange} />)

    await user.click(screen.getByText('acceptAll'))

    expect(onSettingsChange).toHaveBeenCalledWith({
      'strictly-necessary': true,
      analytics: true,
      preferences: true,
    })
  })

  it('rejects all optional cookies when Reject All is clicked', async () => {
    const onSettingsChange = vi.fn()
    render(<CookieSettings onSettingsChange={onSettingsChange} />)

    await user.click(screen.getByText('rejectAll'))

    expect(onSettingsChange).toHaveBeenCalledWith({
      'strictly-necessary': true,
      analytics: false,
      preferences: false,
    })
  })

  it('shows last updated timestamp when available', () => {
    const testDate = new Date('2023-12-01T10:00:00Z')
    mockGetConsentTimestamp.mockReturnValue(testDate)

    render(<CookieSettings />)

    expect(screen.getByText(/lastUpdated/)).toBeInTheDocument()
  })

  it('disables strictly necessary toggle', () => {
    render(<CookieSettings />)

    // Find the strictly necessary section and its toggle
    const strictlyNecessarySection = screen
      .getByText('categories.strictly-necessary.name')
      .closest('.border')
    expect(strictlyNecessarySection).toBeInTheDocument()

    // The toggle should be disabled (input is hidden, but container should have disabled styling)
    const toggleContainer =
      strictlyNecessarySection?.querySelector('.opacity-50')
    expect(toggleContainer).toBeInTheDocument()
  })

  it('shows an error message when saving settings fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mockSaveConsentSettings.mockImplementation(() => {
      throw new Error('save failed')
    })

    render(<CookieSettings />)

    await user.click(screen.getByText('savePreferences'))

    await waitFor(() => {
      expect(screen.getByText(/settingsError/)).toBeInTheDocument()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save cookie settings:',
        expect.any(Error),
      )
    })
  })

  it('shows an error message when reset fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mockResetConsent.mockImplementation(() => {
      throw new Error('reset failed')
    })

    render(<CookieSettings />)

    await user.click(screen.getByText('resetConsent'))
    await waitFor(() => {
      expect(screen.getByText('confirmReset')).toBeInTheDocument()
    })

    await user.click(screen.getByText('confirmReset'))

    await waitFor(() => {
      expect(screen.getByText(/settingsError/)).toBeInTheDocument()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to reset consent:',
        expect.any(Error),
      )
    })
  })

  it('exports data and revokes created object URL', async () => {
    const createObjectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:cookie-data')
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL')
    const anchorClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})
    const removeChildSpy = vi.spyOn(document.body, 'removeChild')

    render(<CookieSettings />)
    await user.click(screen.getByText('exportData'))

    await waitFor(() => {
      expect(createObjectUrlSpy).toHaveBeenCalledTimes(1)
      expect(anchorClickSpy).toHaveBeenCalledTimes(1)
      expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:cookie-data')
      expect(removeChildSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('handles export cleanup failures and warns instead of crashing', async () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {})
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:cookie-data')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {
      throw new Error('revoke failed')
    })

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    vi.spyOn(document.body, 'contains').mockReturnValue(true)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {
      throw new Error('remove failed')
    })

    render(<CookieSettings />)
    await user.click(screen.getByText('exportData'))

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to remove download element:',
        expect.any(Error),
      )
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to revoke blob URL:',
        expect.any(Error),
      )
    })
  })

  it('shows error when export throws before download link is created', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
      throw new Error('blob failed')
    })

    render(<CookieSettings />)
    await user.click(screen.getByText('exportData'))

    await waitFor(() => {
      expect(screen.getByText(/settingsError/)).toBeInTheDocument()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to export cookie data:',
        expect.any(Error),
      )
    })
  })

  it('shows error when appending download element fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:cookie-data')

    render(<CookieSettings />)

    vi.spyOn(document.body, 'appendChild').mockImplementationOnce(node => {
      if (node instanceof HTMLAnchorElement) {
        throw new Error('append failed')
      }
      return HTMLBodyElement.prototype.appendChild.call(document.body, node)
    })

    await user.click(screen.getByText('exportData'))

    await waitFor(() => {
      expect(screen.getByText(/settingsError/)).toBeInTheDocument()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to export cookie data:',
        expect.any(Error),
      )
    })
  })

  it('shows error when triggering download click fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:cookie-data')
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      throw new Error('click failed')
    })

    render(<CookieSettings />)
    await user.click(screen.getByText('exportData'))

    await waitFor(() => {
      expect(screen.getByText(/settingsError/)).toBeInTheDocument()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to export cookie data:',
        expect.any(Error),
      )
    })
  })
})
