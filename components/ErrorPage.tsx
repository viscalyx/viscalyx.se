'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations('error')
  const locale = useLocale()

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* "!" is a universal warning symbol — intentionally not translated */}
      <h1 className="mb-4 text-4xl font-bold text-red-600 sm:text-5xl lg:text-6xl dark:text-red-400">
        !
      </h1>
      <h2 className="mb-4 text-2xl font-semibold text-secondary-800 dark:text-secondary-200">
        {t('heading')}
      </h2>
      <p className="mb-8 max-w-md text-secondary-600 dark:text-secondary-400">
        {t('description')}
      </p>
      <div className="flex gap-4">
        <button
          aria-label={t('tryAgain')}
          className="min-h-[44px] min-w-[44px] rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus-visible:outline-primary-300"
          onClick={reset}
          type="button"
        >
          {t('tryAgain')}
        </button>
        <Link
          aria-label={t('goHome')}
          className="inline-flex min-h-[44px] min-w-[44px] rounded-lg border border-secondary-300 px-6 py-3 font-medium text-secondary-700 transition-colors duration-200 hover:bg-secondary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-secondary-600 dark:text-secondary-300 dark:hover:bg-secondary-800 dark:focus-visible:outline-primary-400"
          href={`/${locale}`}
        >
          {t('goHome')}
        </Link>
      </div>
    </main>
  )
}

export default ErrorPage
