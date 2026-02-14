'use client'

import LegalPageLayout from '@/components/LegalPageLayout'
import { getStaticPageDates } from '@/lib/file-dates'
import { useTranslations } from 'next-intl'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

const TermsPageClient = () => {
  const t = useTranslations('terms')

  return (
    <LegalPageLayout
      title={t('terms.title')}
      subtitle={t('terms.subtitle')}
      lastUpdatedLabel={t('terms.lastUpdated')}
      lastUpdatedDate={staticPageDates.terms}
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
        {(t.raw('terms.sections.userResponsibilities.items') as string[]).map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
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
    </LegalPageLayout>
  )
}

export default TermsPageClient
