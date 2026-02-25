'use client'

import { useTranslations } from 'next-intl'
import LegalPageLayout from '@/components/LegalPageLayout'
import LegalSection, { safeTranslationArray } from '@/components/LegalSection'

interface TermsPageClientProps {
  lastUpdatedDate: Date
}

const TermsPageClient = ({ lastUpdatedDate }: TermsPageClientProps) => {
  const t = useTranslations('terms')

  return (
    <LegalPageLayout
      lastUpdatedDate={lastUpdatedDate}
      lastUpdatedLabel={t('terms.lastUpdated')}
      subtitle={t('terms.subtitle')}
      title={t('terms.title')}
    >
      <LegalSection
        description={t('terms.sections.agreement.description')}
        title={t('terms.sections.agreement.title')}
      />

      <LegalSection
        description={t('terms.sections.services.description')}
        items={safeTranslationArray(t.raw('terms.sections.services.items'))}
        title={t('terms.sections.services.title')}
      />

      <LegalSection
        description={t('terms.sections.userResponsibilities.description')}
        items={safeTranslationArray(
          t.raw('terms.sections.userResponsibilities.items')
        )}
        title={t('terms.sections.userResponsibilities.title')}
      />

      <LegalSection
        description={t('terms.sections.intellectualProperty.description')}
        title={t('terms.sections.intellectualProperty.title')}
      />

      <LegalSection
        description={t('terms.sections.limitationOfLiability.description')}
        title={t('terms.sections.limitationOfLiability.title')}
      />

      <LegalSection
        description={t('terms.sections.termination.description')}
        title={t('terms.sections.termination.title')}
      />

      <LegalSection
        description={t('terms.sections.governingLaw.description')}
        title={t('terms.sections.governingLaw.title')}
      />

      <LegalSection
        description={t('terms.sections.changes.description')}
        title={t('terms.sections.changes.title')}
      />

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
          className="text-primary-600 dark:text-primary-400 hover:underline"
          href={`mailto:${t('terms.sections.contact.emailAddress')}`}
        >
          {t('terms.sections.contact.emailAddress')}
        </a>
      </p>
    </LegalPageLayout>
  )
}

export default TermsPageClient
