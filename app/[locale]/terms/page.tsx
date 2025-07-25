'use client'

export const runtime = 'edge'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import ScrollToTop from '@/components/ScrollToTop'
import { getStaticPageDates } from '@/lib/file-dates'
import { useTermsTranslations } from '@/lib/page-translations'
import { motion } from 'framer-motion'
import { useFormatter } from 'next-intl'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

export default function TermsPage() {
  const { translations, loading, error } = useTermsTranslations()
  const format = useFormatter()

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !translations) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Terms
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message ||
              'Failed to load terms content. Please try again later.'}
          </p>
        </div>
      </div>
    )
  }

  const t = translations.terms

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-secondary-900"
    >
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg section-padding pt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {t.subtitle}
            </p>
            <p className="text-secondary-500 dark:text-secondary-500">
              {t.lastUpdated}:{' '}
              {format.dateTime(staticPageDates.terms, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white dark:bg-secondary-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              {/* Agreement */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.agreement.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.agreement.description}
              </p>

              {/* Services */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.services.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t.sections.services.description}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.services.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* User Responsibilities */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.userResponsibilities.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t.sections.userResponsibilities.description}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.userResponsibilities.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* Intellectual Property */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.intellectualProperty.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.intellectualProperty.description}
              </p>

              {/* Limitation of Liability */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.limitationOfLiability.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.limitationOfLiability.description}
              </p>

              {/* Termination */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.termination.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.termination.description}
              </p>

              {/* Governing Law */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.governingLaw.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.governingLaw.description}
              </p>

              {/* Changes to Terms */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.changes.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.changes.description}
              </p>

              {/* Contact */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.contact.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                {t.sections.contact.description}
              </p>
              <p className="text-secondary-600 dark:text-secondary-400">
                <strong>{t.sections.contact.email}:</strong>{' '}
                <a
                  href={`mailto:${t.sections.contact.emailAddress}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t.sections.contact.emailAddress}
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </motion.main>
  )
}
