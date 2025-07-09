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

export function usePrivacyTranslations() {
  const locale = useLocale()
  const [translations, setTranslations] = useState<PrivacyTranslations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTranslations() {
      try {
        const data = await import(`../messages/privacy.${locale}.json`)
        setTranslations(data.default as PrivacyTranslations)
      } catch (error) {
        console.error(`Error loading privacy translations for ${locale}:`, error)
        // Fallback to English
        try {
          const data = await import('../messages/privacy.en.json')
          setTranslations(data.default as PrivacyTranslations)
        } catch (fallbackError) {
          console.error('Error loading fallback privacy translations:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadTranslations()
  }, [locale])

  return { translations, loading }
}

export function useTermsTranslations() {
  const locale = useLocale()
  const [translations, setTranslations] = useState<TermsTranslations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTranslations() {
      try {
        const data = await import(`../messages/terms.${locale}.json`)
        setTranslations(data.default as TermsTranslations)
      } catch (error) {
        console.error(`Error loading terms translations for ${locale}:`, error)
        // Fallback to English
        try {
          const data = await import('../messages/terms.en.json')
          setTranslations(data.default as TermsTranslations)
        } catch (fallbackError) {
          console.error('Error loading fallback terms translations:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadTranslations()
  }, [locale])

  return { translations, loading }
}
