/**
 * Language preference management utilities that respect cookie consent
 */

import { hasConsent } from './cookie-consent'

const LANGUAGE_COOKIE_NAME = 'language'

/**
 * Get the user's preferred language from cookie
 */
export function getLanguagePreference(): string | null {
  if (typeof window === 'undefined') return null

  // Only read language preference if user has consented to preferences cookies
  if (!hasConsent('preferences')) return null

  try {
    // Try to get from cookie first
    const cookies = document.cookie.split(';')
    const languageCookie = cookies.find(cookie =>
      cookie.trim().startsWith(`${LANGUAGE_COOKIE_NAME}=`)
    )

    if (languageCookie) {
      const value = languageCookie.split('=')[1]
      return decodeURIComponent(value)
    }

    return null
  } catch {
    return null
  }
}

/**
 * Save the user's language preference
 */
export function saveLanguagePreference(language: string): void {
  if (typeof window === 'undefined') return

  // Only save language preference if user has consented to preferences cookies
  if (!hasConsent('preferences')) return

  try {
    // Set cookie with 1 year expiry
    const maxAge = 365 * 24 * 60 * 60 // 1 year in seconds
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(language)}; path=/; max-age=${maxAge}; SameSite=Lax`
  } catch (error) {
    console.error('Failed to save language preference:', error)
  }
}

/**
 * Clear the language preference cookie
 */
export function clearLanguagePreference(): void {
  if (typeof window === 'undefined') return

  try {
    // Delete the cookie by setting it to expire in the past
    document.cookie = `${LANGUAGE_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  } catch (error) {
    console.error('Failed to clear language preference:', error)
  }
}

/**
 * Get the default language based on browser preferences or fallback
 *
 * This function implements a language detection strategy with the following priority:
 * 1. Browser's primary language (navigator.language)
 * 2. First available browser language (navigator.languages[0])
 * 3. Fallback to English ('en')
 *
 * Supported language codes:
 * - 'sv': Swedish (matches any locale starting with 'sv', e.g., 'sv-SE', 'sv-FI')
 * - 'en': English (default fallback for all other languages)
 *
 * @returns The detected or fallback language code ('sv' | 'en')
 *
 * @example
 * // Browser language is 'sv-SE' → returns 'sv'
 * // Browser language is 'en-US' → returns 'en'
 * // Browser language is 'de-DE' → returns 'en' (fallback)
 * // Server-side rendering → returns 'en' (fallback)
 */
export function getDefaultLanguage(): string {
  if (typeof window === 'undefined') return 'en'

  try {
    const browserLanguage =
      navigator.language || navigator.languages?.[0] || 'en'

    // Check if browser language starts with supported languages
    if (browserLanguage.startsWith('sv')) {
      return 'sv'
    }

    // Default to English
    return 'en'
  } catch {
    return 'en'
  }
}
