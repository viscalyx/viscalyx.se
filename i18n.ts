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
      // Load main messages - shouldn't have error handling that returns an empty object (we want main message loading failures to bubble up)
      ...(await import(`./messages/${locale}.json`)).default,
      // Parallel page-specific imports with error handling
      ...Object.fromEntries(
        await Promise.all(
          ['cookies', 'privacy', 'terms'].map(async page => [
            page,
            await import(`./messages/${page}.${locale}.json`)
              .then(m => m.default)
              .catch(() => ({})),
          ]),
        ),
      ),
    },
  }
})
