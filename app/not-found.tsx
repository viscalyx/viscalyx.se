import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function RootNotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'notFound' })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        {t('heading')}
      </h2>
      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-300">
        {t('description')}
      </p>
      <Link
        aria-label={t('goHomeAriaLabel')}
        className="inline-flex min-h-[44px] min-w-[44px] rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        href={`/${locale}`}
      >
        {t('goHome')}
      </Link>
    </main>
  )
}
