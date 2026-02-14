'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { getStaticPageDates } from '@/lib/file-dates'
import { motion } from 'framer-motion'
import { useFormatter, useTranslations } from 'next-intl'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

const TermsPageClient = () => {
  const t = useTranslations('terms')
  const format = useFormatter()

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
              {t('terms.title')}
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {t('terms.subtitle')}
            </p>
            <p className="text-secondary-500 dark:text-secondary-500">
              {t('terms.lastUpdated')}:{' '}
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
                {t('terms.sections.agreement.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('terms.sections.agreement.description')}
              </p>

              {/* Services */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.services.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('terms.sections.services.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {(t.raw('terms.sections.services.items') as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>

              {/* User Responsibilities */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.userResponsibilities.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('terms.sections.userResponsibilities.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {(
                  t.raw('terms.sections.userResponsibilities.items') as string[]
                ).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* Intellectual Property */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.intellectualProperty.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('terms.sections.intellectualProperty.description')}
              </p>

              {/* Limitation of Liability */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.limitationOfLiability.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('terms.sections.limitationOfLiability.description')}
              </p>

              {/* Termination */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.termination.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('terms.sections.termination.description')}
              </p>

              {/* Governing Law */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.governingLaw.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('terms.sections.governingLaw.description')}
              </p>

              {/* Changes to Terms */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.changes.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('terms.sections.changes.description')}
              </p>

              {/* Contact */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('terms.sections.contact.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                {t('terms.sections.contact.description')}
              </p>
              <p className="text-secondary-600 dark:text-secondary-400">
                <strong>{t('terms.sections.contact.email')}:</strong>{' '}
                <a
                  href={`mailto:${t('terms.sections.contact.emailAddress')}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t('terms.sections.contact.emailAddress')}
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

export default TermsPageClient
