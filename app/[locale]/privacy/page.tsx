'use client'

export const runtime = 'edge'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import ScrollToTop from '@/components/ScrollToTop'
import { getStaticPageDates } from '@/lib/file-dates'
import { usePrivacyTranslations } from '@/lib/page-translations'
import { motion } from 'framer-motion'
import { useFormatter } from 'next-intl'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

export default function PrivacyPage() {
  const { translations, loading, error } = usePrivacyTranslations()
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
            Error Loading Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message ||
              'Failed to load privacy policy content. Please try again later.'}
          </p>
        </div>
      </div>
    )
  }

  const t = translations.privacy

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
              {format.dateTime(staticPageDates.privacy, {
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
              {/* Information We Collect */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.informationWeCollect.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t.sections.informationWeCollect.description}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.informationWeCollect.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* How We Use Your Information */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.howWeUse.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t.sections.howWeUse.description}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.howWeUse.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* Data Security */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.dataSecurity.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.dataSecurity.description}
              </p>

              {/* Cookies and Tracking */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.cookies.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.cookies.description}
              </p>

              {/* Third-Party Services */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.thirdParty.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t.sections.thirdParty.description}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.thirdParty.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* Your Rights */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t.sections.yourRights.title}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t.sections.yourRights.description}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {t.sections.yourRights.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* Contact Us */}
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
