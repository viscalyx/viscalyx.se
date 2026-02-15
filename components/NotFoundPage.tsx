'use client'

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

const NotFoundPage = () => {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-primary-600 sm:text-5xl lg:text-6xl dark:text-primary-400">
        404
      </h1>
      <h2 className="mb-4 text-xl font-semibold text-secondary-800 sm:text-2xl dark:text-secondary-200">
        {t('heading')}
      </h2>
      <p className="mb-8 max-w-md text-secondary-600 dark:text-secondary-400">
        {t('description')}
      </p>
      <Link
        href={`/${locale}`}
        className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {t('goHome')}
      </Link>
    </main>
  )
}

export default NotFoundPage
