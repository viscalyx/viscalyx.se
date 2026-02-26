import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

interface PrivacyTranslations {
  lastUpdated: string
  sections: {
    informationWeCollect: {
      title: string
      description: string
      items: string[]
    }
    howWeUse: {
      title: string
      description: string
      items: string[]
    }
    dataSecurity: {
      title: string
      description: string
    }
    cookies: {
      title: string
      description: string
    }
    thirdParty: {
      title: string
      description: string
      items: string[]
    }
    yourRights: {
      title: string
      description: string
      items: string[]
    }
    contact: {
      title: string
      description: string
      email: string
      emailAddress: string
    }
  }
  subtitle: string
  title: string
}

interface TermsTranslations {
  lastUpdated: string
  sections: {
    agreement: {
      title: string
      description: string
    }
    services: {
      title: string
      description: string
      items: string[]
    }
    userResponsibilities: {
      title: string
      description: string
      items: string[]
    }
    intellectualProperty: {
      title: string
      description: string
    }
    limitationOfLiability: {
      title: string
      description: string
    }
    termination: {
      title: string
      description: string
    }
    governingLaw: {
      title: string
      description: string
    }
    changes: {
      title: string
      description: string
    }
    contact: {
      title: string
      description: string
      email: string
      emailAddress: string
    }
  }
  subtitle: string
  title: string
}

interface CookiesTranslations {
  contact: {
    title: string
    description: string
  }
  description: string
  howWeUseCookies: {
    title: string
    description: string
    purposes: {
      essential: string
      preferences: string
      analytics: string
    }
  }
  lastUpdated: string
  title: string
  typesOfCookies: {
    title: string
    session: {
      title: string
      description: string
    }
    persistent: {
      title: string
      description: string
    }
    firstParty: {
      title: string
      description: string
    }
    thirdParty: {
      title: string
      description: string
    }
  }
  whatAreCookies: {
    title: string
    description: string
  }
  yourChoices: {
    title: string
    description: string
    options: {
      browserSettings: string
      ourSettings: string
      thirdPartyOptOut: string
    }
    disclaimer: string
  }
}

/**
 * Validates and sanitizes the filePrefix parameter to prevent injection attacks
 * This function ensures only safe file names are used in dynamic imports.
 * @param filePrefix - The prefix to validate
 * @returns Sanitized filePrefix containing only safe characters
 * @throws Error if filePrefix is invalid or contains unsafe characters
 */
function validateFilePrefix(filePrefix: string): string {
  // Input validation
  if (!filePrefix || typeof filePrefix !== 'string') {
    throw new Error('File prefix must be a non-empty string')
  }

  // Trim whitespace and convert to lowercase for consistency
  const trimmed = filePrefix.trim().toLowerCase()

  if (trimmed.length === 0) {
    throw new Error('File prefix cannot be empty or whitespace only')
  }

  // Check for path traversal attempts first (before sanitization)
  if (
    trimmed.includes('..') ||
    trimmed.includes('/') ||
    trimmed.includes('\\')
  ) {
    throw new Error(
      `File prefix contains invalid path characters: "${filePrefix}"`,
    )
  }

  // Allow only alphanumeric characters, underscores, and hyphens
  // This is stricter than sanitize-html as we need precise control over file paths
  const allowedPattern = /^[a-z0-9_-]+$/

  if (!allowedPattern.test(trimmed)) {
    throw new Error(
      `Invalid file prefix: "${filePrefix}". Only lowercase alphanumeric characters, underscores, and hyphens are allowed.`,
    )
  }

  // Additional security checks
  if (
    trimmed.startsWith('-') ||
    trimmed.endsWith('-') ||
    trimmed.startsWith('_')
  ) {
    throw new Error(
      `File prefix cannot start with underscore or hyphen, or end with hyphen: "${filePrefix}"`,
    )
  }

  // Prevent reserved names that could be problematic
  const reservedNames = ['con', 'prn', 'aux', 'nul', 'index', 'main', 'config']
  if (reservedNames.includes(trimmed)) {
    throw new Error(`File prefix cannot use reserved name: "${trimmed}"`)
  }

  return trimmed
}

/**
 * Generic hook for loading page translations with fallback to English
 * @param filePrefix - The prefix of the translation file (e.g., 'privacy', 'terms')
 * @returns Object containing translations, loading state, and error state
 */
function validateLocale(locale: string): string {
  const allowedLocales = ['en', 'sv']
  if (!allowedLocales.includes(locale)) {
    throw new Error(`Invalid locale: "${locale}"`)
  }
  return locale
}

function usePageTranslations<T>(filePrefix: string) {
  const locale = useLocale()
  const [translations, setTranslations] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTranslations() {
      try {
        setLoading(true) // Set loading to true when locale changes
        setError(null) // Reset error state on new load

        // Validate and sanitize the filePrefix before using it in dynamic import
        const validatedPrefix = validateFilePrefix(filePrefix)
        const validatedLocale = validateLocale(locale)

        const data = await import(
          `../messages/${validatedPrefix}.${validatedLocale}.json`
        )
        setTranslations(data.default as T)
      } catch (error) {
        console.error(
          `Error loading ${filePrefix} translations for ${locale}:`,
          error,
        )
        // Fallback to English
        try {
          // Use the same validated prefix for fallback
          const validatedPrefix = validateFilePrefix(filePrefix)
          const data = await import(`../messages/${validatedPrefix}.en.json`)
          setTranslations(data.default as T)
        } catch (fallbackError) {
          console.error(
            `Error loading fallback ${filePrefix} translations:`,
            fallbackError,
          )
          setError(
            fallbackError instanceof Error
              ? fallbackError
              : new Error(`Failed to load ${filePrefix} translations`),
          )
        }
      } finally {
        setLoading(false)
      }
    }

    loadTranslations()
  }, [locale, filePrefix])

  return { translations, loading, error }
}

export function usePrivacyTranslations() {
  return usePageTranslations<PrivacyTranslations>('privacy')
}

export function useTermsTranslations() {
  return usePageTranslations<TermsTranslations>('terms')
}

export function useCookiesTranslations() {
  return usePageTranslations<CookiesTranslations>('cookies')
}

// Export validation functions for testing purposes
export { validateFilePrefix, validateLocale }
