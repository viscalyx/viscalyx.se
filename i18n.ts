import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
export const locales = ['en', 'sv'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the [locale] segment
  const requested = await requestLocale

  // Validate that locale is defined and is one of the supported locales
  const locale =
    requested && locales.includes(requested as Locale) ? requested : 'en' // fallback to default locale

  return {
    locale: locale,
    messages: {
      // Load main messages
      ...(await import(`./messages/${locale}.json`)).default,
      // Load additional page-specific messages
      cookies: (await import(`./messages/cookies.${locale}.json`)).default,
      privacy: (await import(`./messages/privacy.${locale}.json`)).default,
      terms: (await import(`./messages/terms.${locale}.json`)).default,
    },
  }
})
