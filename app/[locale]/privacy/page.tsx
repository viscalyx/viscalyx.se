'use client'

import { motion } from 'framer-motion'
import { useTranslations, useFormatter } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { getStaticPageDates } from '@/lib/file-dates'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

export default function PrivacyPage() {
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
              {t('title')}
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {t('subtitle')}
            </p>
            <p className="text-secondary-500 dark:text-secondary-500">
              {t('lastUpdated')}:{' '}
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
                {t('sections.informationWeCollect.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('sections.informationWeCollect.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                <li>{t('sections.informationWeCollect.items.0')}</li>
                <li>{t('sections.informationWeCollect.items.1')}</li>
                <li>{t('sections.informationWeCollect.items.2')}</li>
                <li>{t('sections.informationWeCollect.items.3')}</li>
              </ul>

              {/* How We Use Your Information */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('sections.howWeUse.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('sections.howWeUse.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                <li>{t('sections.howWeUse.items.0')}</li>
                <li>{t('sections.howWeUse.items.1')}</li>
                <li>{t('sections.howWeUse.items.2')}</li>
                <li>{t('sections.howWeUse.items.3')}</li>
              </ul>

              {/* Data Security */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('sections.dataSecurity.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('sections.dataSecurity.description')}
              </p>

              {/* Cookies and Tracking */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('sections.cookies.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                {t('sections.cookies.description')}
              </p>

              {/* Third-Party Services */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('sections.thirdParty.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('sections.thirdParty.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                <li>{t('sections.thirdParty.items.0')}</li>
                <li>{t('sections.thirdParty.items.1')}</li>
              </ul>

              {/* Your Rights */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('sections.yourRights.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {t('sections.yourRights.description')}
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
                <li>{t('sections.yourRights.items.0')}</li>
                <li>{t('sections.yourRights.items.1')}</li>
                <li>{t('sections.yourRights.items.2')}</li>
                <li>{t('sections.yourRights.items.3')}</li>
              </ul>

              {/* Contact Us */}
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {t('sections.contact.title')}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                {t('sections.contact.description')}
              </p>
              <p className="text-secondary-600 dark:text-secondary-400">
                <strong>{t('sections.contact.email')}:</strong>{' '}
                <a
                  href="mailto:privacy@viscalyx.se"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  privacy@viscalyx.se
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
