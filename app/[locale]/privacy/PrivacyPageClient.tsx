'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { getStaticPageDates } from '@/lib/file-dates'
import { motion } from 'framer-motion'
import { useFormatter, useTranslations } from 'next-intl'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

const PrivacyPageClient = () => {
  const t = useTranslations('privacy')
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
              {t('privacy.title')}
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {t('privacy.subtitle')}
            </p>
            <p className="text-secondary-500 dark:text-secondary-500">
              {t('privacy.lastUpdated')}:{' '}
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
                {t('privacy.sections.informationWeCollect.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('privacy.sections.informationWeCollect.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {(
                  t.raw(
                    'privacy.sections.informationWeCollect.items'
                  ) as string[]
                ).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* How We Use Your Information */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('privacy.sections.howWeUse.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('privacy.sections.howWeUse.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {(t.raw('privacy.sections.howWeUse.items') as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>

              {/* Data Security */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('privacy.sections.dataSecurity.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('privacy.sections.dataSecurity.description')}
              </p>

              {/* Cookies and Tracking */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('privacy.sections.cookies.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('privacy.sections.cookies.description')}
              </p>

              {/* Third-Party Services */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('privacy.sections.thirdParty.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('privacy.sections.thirdParty.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {(t.raw('privacy.sections.thirdParty.items') as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>

              {/* Your Rights */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('privacy.sections.yourRights.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('privacy.sections.yourRights.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                {(t.raw('privacy.sections.yourRights.items') as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>

              {/* Contact Us */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('privacy.sections.contact.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                {t('privacy.sections.contact.description')}
              </p>
              <p className="text-secondary-600 dark:text-secondary-400">
                <strong>{t('privacy.sections.contact.email')}:</strong>{' '}
                <a
                  href={`mailto:${t('privacy.sections.contact.emailAddress')}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t('privacy.sections.contact.emailAddress')}
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

export default PrivacyPageClient
