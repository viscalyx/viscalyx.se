import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

interface PrivacyTranslations {
  privacy: {
    title: string
    subtitle: string
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
  }
}

interface TermsTranslations {
  terms: {
    title: string
    subtitle: string
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
  }
}

/**
 * Generic hook for loading page translations with fallback to English
 * @param filePrefix - The prefix of the translation file (e.g., 'privacy', 'terms')
 * @returns Object containing translations, loading state, and error state
 */
function usePageTranslations<T>(filePrefix: string) {
  const locale = useLocale()
  const [translations, setTranslations] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTranslations() {
      try {
        setError(null) // Reset error state on new load
        const data = await import(`../messages/${filePrefix}.${locale}.json`)
        setTranslations(data.default as T)
      } catch (error) {
        console.error(
          `Error loading ${filePrefix} translations for ${locale}:`,
          error
        )
        // Fallback to English
        try {
          const data = await import(`../messages/${filePrefix}.en.json`)
          setTranslations(data.default as T)
        } catch (fallbackError) {
          console.error(
            `Error loading fallback ${filePrefix} translations:`,
            fallbackError
          )
          setError(
            fallbackError instanceof Error
              ? fallbackError
              : new Error(`Failed to load ${filePrefix} translations`)
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
