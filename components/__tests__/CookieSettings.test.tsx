import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import CookieSettings from '../CookieSettings'

// Mock cookie-consent lib
vi.mock('../../lib/cookie-consent', () => ({
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
      purpose: 'Test purpose',
      duration: '1 year',
      provider: 'Test Provider',
    },
  ],
}))

// Import the mocked functions
import * as cookieConsent from '../../lib/cookie-consent'

const mockGetConsentSettings = vi.mocked(cookieConsent.getConsentSettings)
const mockGetConsentTimestamp = vi.mocked(cookieConsent.getConsentTimestamp)
const mockSaveConsentSettings = vi.mocked(cookieConsent.saveConsentSettings)
const mockCleanupCookies = vi.mocked(cookieConsent.cleanupCookies)
const mockResetConsent = vi.mocked(cookieConsent.resetConsent)

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      cookieSettings: 'Cookie Settings',
      settingsDescription: 'Manage your cookie preferences',
      resetConfirmationTitle: 'Reset Cookie Preferences',
      resetConfirmation:
        'Are you sure you want to reset all cookie preferences?',
      confirmReset: 'Reset Preferences',
      cancel: 'Cancel',
      resetConsent: 'Reset Consent',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      exportData: 'Export Data',
      savePreferences: 'Save Preferences',
      saving: 'Saving...',
      settingsSaved: 'Settings saved successfully',
      settingsError: 'Error saving settings',
      quickActions: 'Quick Actions',
      'categories.title': 'Cookie Categories',
      'categories.strictly-necessary.name': 'Strictly Necessary',
      'categories.strictly-necessary.description':
        'Required for basic functionality',
      'categories.analytics.name': 'Analytics',
      'categories.analytics.description': 'Help us improve our website',
      'categories.preferences.name': 'Preferences',
      'categories.preferences.description': 'Remember your settings',
      required: 'Required',
      viewCookies: 'View Cookies',
      duration: 'Duration',
      provider: 'Provider',
      lastUpdated: 'Last updated',
    }
    return translations[key] || key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode
      [key: string]: any
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

describe('CookieSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetConsentSettings.mockReturnValue(null)
    mockGetConsentTimestamp.mockReturnValue(null)
  })

  it('renders cookie settings interface', () => {
    render(<CookieSettings />)

    expect(screen.getByText('Cookie Settings')).toBeInTheDocument()
    expect(
      screen.getByText('Manage your cookie preferences')
    ).toBeInTheDocument()
    expect(screen.getByText('Accept All')).toBeInTheDocument()
    expect(screen.getByText('Reject All')).toBeInTheDocument()
    expect(screen.getByText('Reset Consent')).toBeInTheDocument()
  })

  it('displays cookie categories', () => {
    render(<CookieSettings />)

    expect(screen.getByText('Strictly Necessary')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Preferences')).toBeInTheDocument()
  })

  it('shows confirmation modal when reset is clicked', async () => {
    render(<CookieSettings />)

    fireEvent.click(screen.getByText('Reset Consent'))

    await waitFor(() => {
      expect(screen.getByText('Reset Cookie Preferences')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Are you sure you want to reset all cookie preferences?'
        )
      ).toBeInTheDocument()
    })
  })

  it('closes confirmation modal when cancel is clicked', async () => {
    render(<CookieSettings />)

    fireEvent.click(screen.getByText('Reset Consent'))

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Cancel'))

    await waitFor(() => {
      expect(
        screen.queryByText('Reset Cookie Preferences')
      ).not.toBeInTheDocument()
    })
  })

  it('resets consent when confirmed', async () => {
    render(<CookieSettings />)

    fireEvent.click(screen.getByText('Reset Consent'))

    await waitFor(() => {
      expect(screen.getByText('Reset Preferences')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Reset Preferences'))

    await waitFor(() => {
      expect(mockResetConsent).toHaveBeenCalledTimes(1)
    })
  })

  it('saves settings when save button is clicked', async () => {
    render(<CookieSettings />)

    fireEvent.click(screen.getByText('Save Preferences'))

    await waitFor(() => {
      expect(mockSaveConsentSettings).toHaveBeenCalledTimes(1)
      expect(mockCleanupCookies).toHaveBeenCalledTimes(1)
    })
  })

  it('accepts all cookies when Accept All is clicked', () => {
    const onSettingsChange = vi.fn()
    render(<CookieSettings onSettingsChange={onSettingsChange} />)

    fireEvent.click(screen.getByText('Accept All'))

    expect(onSettingsChange).toHaveBeenCalledWith({
      'strictly-necessary': true,
      analytics: true,
      preferences: true,
    })
  })

  it('rejects all optional cookies when Reject All is clicked', () => {
    const onSettingsChange = vi.fn()
    render(<CookieSettings onSettingsChange={onSettingsChange} />)

    fireEvent.click(screen.getByText('Reject All'))

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

    expect(screen.getByText(/Last updated/)).toBeInTheDocument()
  })

  it('disables strictly necessary toggle', () => {
    render(<CookieSettings />)

    // Find the strictly necessary section and its toggle
    const strictlyNecessarySection = screen
      .getByText('Strictly Necessary')
      .closest('.border')
    expect(strictlyNecessarySection).toBeInTheDocument()

    // The toggle should be disabled (input is hidden, but container should have disabled styling)
    const toggleContainer =
      strictlyNecessarySection?.querySelector('.opacity-50')
    expect(toggleContainer).toBeInTheDocument()
  })
})
