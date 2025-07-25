/**
 * Cookie consent management utilities for GDPR compliance
 */

import { consentEvents } from './consent-events'
import { deleteCookie as deleteCookieUtil, setCookie } from './cookie-utils'

export type CookieCategory = 'strictly-necessary' | 'analytics' | 'preferences'

export interface CookieConsentSettings {
  'strictly-necessary': boolean
  analytics: boolean
  preferences: boolean
}

export interface CookieInfo {
  name: string
  category: CookieCategory
  purpose: string
  duration: string
  provider?: string
}

// Default consent settings (only strictly necessary cookies are enabled by default)
export const defaultConsentSettings: CookieConsentSettings = {
  'strictly-necessary': true, // Cannot be disabled
  analytics: false,
  preferences: false,
}

// Cookie information registry
export const cookieRegistry: CookieInfo[] = [
  {
    name: 'theme',
    category: 'preferences',
    purpose: 'Stores user theme preference (light/dark/system)',
    duration: '1 year',
  },
  {
    name: 'language',
    category: 'preferences',
    purpose: 'Stores user language preference (en/sv)',
    duration: '1 year',
  },
  {
    name: 'cookie-consent',
    category: 'strictly-necessary',
    purpose: 'Stores user cookie consent preferences',
    duration: '1 year',
  },
  {
    name: 'cf-analytics',
    category: 'analytics',
    purpose:
      'Cloudflare Analytics Engine data collection (IP, country, user agent)',
    duration: 'Session only - data processed server-side',
    provider: 'Cloudflare',
  },
  {
    name: 'blog-reading-analytics',
    category: 'analytics',
    purpose:
      'Tracks blog reading behavior (progress, time spent) for content optimization',
    duration: 'Session only - data processed server-side',
    provider: 'Cloudflare Analytics Engine',
  },
  {
    name: 'session',
    category: 'strictly-necessary',
    purpose: 'Maintains user session state',
    duration: 'Session',
  },
]

const CONSENT_COOKIE_NAME = 'cookie-consent'
const CONSENT_VERSION = '1.0'

/**
 * Get current cookie consent settings from localStorage/cookie
 */
export function getConsentSettings(): CookieConsentSettings | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME)
    if (!stored) return null

    const data = JSON.parse(stored)

    // Check if consent version matches (for future updates)
    if (data.version !== CONSENT_VERSION) {
      return null
    }

    return data.settings
  } catch {
    return null
  }
}

/**
 * Save cookie consent settings
 */
export function saveConsentSettings(settings: CookieConsentSettings): void {
  if (typeof window === 'undefined') return

  const data = {
    version: CONSENT_VERSION,
    settings,
    timestamp: new Date().toISOString(),
  }

  try {
    localStorage.setItem(CONSENT_COOKIE_NAME, JSON.stringify(data))

    // Also set a cookie for server-side detection
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(data), {
      maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    })

    // Emit consent change event
    consentEvents.emit({
      type: 'consent-changed',
      settings,
    })
  } catch (error) {
    console.error('Failed to save cookie consent:', error)
  }
}

/**
 * Check if user has given consent for a specific category
 */
export function hasConsent(category: CookieCategory): boolean {
  if (category === 'strictly-necessary') return true

  const settings = getConsentSettings()
  if (!settings) return false

  return settings[category]
}

/**
 * Check if user has made any consent choice
 */
export function hasConsentChoice(): boolean {
  return getConsentSettings() !== null
}

/**
 * Clear all non-essential cookies based on consent settings
 */
export function cleanupCookies(settings: CookieConsentSettings): void {
  if (typeof window === 'undefined') return

  // Get all cookies
  const cookies = document.cookie.split(';')

  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=')
    const cookieInfo = cookieRegistry.find(info => info.name === name)

    if (cookieInfo && cookieInfo.category !== 'strictly-necessary') {
      // If user hasn't consented to this category, remove the cookie
      if (!settings[cookieInfo.category]) {
        deleteCookie(name)
      }
    }
  })

  // Also clean up known cookies that might not be in our registry
  if (!settings.preferences) {
    // Clear language preference if preferences are disabled
    deleteCookie('language')
  }

  // Note: Analytics data is processed server-side in Cloudflare Analytics Engine
  // and doesn't use client-side cookies, so no cleanup needed for analytics category
}

/**
 * Delete a specific cookie
 */
function deleteCookie(name: string): void {
  deleteCookieUtil(name)
}

/**
 * Reset all consent settings (for testing or user request)
 */
export function resetConsent(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(CONSENT_COOKIE_NAME)
  deleteCookie(CONSENT_COOKIE_NAME)

  // Clean up all non-essential cookies
  cleanupCookies(defaultConsentSettings)

  // Emit consent reset event
  consentEvents.emit({
    type: 'consent-reset',
  })
}

/**
 * Get consent timestamp
 */
export function getConsentTimestamp(): Date | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME)
    if (!stored) return null

    const data = JSON.parse(stored)
    return new Date(data.timestamp)
  } catch {
    return null
  }
}
