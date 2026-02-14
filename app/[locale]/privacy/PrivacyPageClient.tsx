'use client'

import LegalPageLayout from '@/components/LegalPageLayout'
import { getStaticPageDates } from '@/lib/file-dates'
import { useTranslations } from 'next-intl'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

const PrivacyPageClient = () => {
  const t = useTranslations('privacy')

  return (
    <LegalPageLayout
      title={t('privacy.title')}
      subtitle={t('privacy.subtitle')}
      lastUpdatedLabel={t('privacy.lastUpdated')}
      lastUpdatedDate={staticPageDates.privacy}
    >
      {/* Information We Collect */}
      <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
        {t('privacy.sections.informationWeCollect.title')}
      </h2>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6">
        {t('privacy.sections.informationWeCollect.description')}
      </p>
      <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-400 mb-8">
        {(t.raw('privacy.sections.informationWeCollect.items') as string[]).map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
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
    </LegalPageLayout>
  )
}

export default PrivacyPageClient
