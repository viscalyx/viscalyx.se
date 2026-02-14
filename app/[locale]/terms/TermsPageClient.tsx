'use client'

import LegalPageLayout from '@/components/LegalPageLayout'
import LegalSection, { safeTranslationArray } from '@/components/LegalSection'
import { useTranslations } from 'next-intl'

interface TermsPageClientProps {
  lastUpdatedDate: Date
}

const TermsPageClient = ({ lastUpdatedDate }: TermsPageClientProps) => {
  const t = useTranslations('terms')

  return (
    <LegalPageLayout
      title={t('terms.title')}
      subtitle={t('terms.subtitle')}
      lastUpdatedLabel={t('terms.lastUpdated')}
      lastUpdatedDate={lastUpdatedDate}
    >
      <LegalSection
        title={t('terms.sections.agreement.title')}
        description={t('terms.sections.agreement.description')}
      />

      <LegalSection
        title={t('terms.sections.services.title')}
        description={t('terms.sections.services.description')}
        items={safeTranslationArray(t.raw('terms.sections.services.items'))}
      />

      <LegalSection
        title={t('terms.sections.userResponsibilities.title')}
        description={t('terms.sections.userResponsibilities.description')}
        items={safeTranslationArray(
          t.raw('terms.sections.userResponsibilities.items')
        )}
      />

      <LegalSection
        title={t('terms.sections.intellectualProperty.title')}
        description={t('terms.sections.intellectualProperty.description')}
      />

      <LegalSection
        title={t('terms.sections.limitationOfLiability.title')}
        description={t('terms.sections.limitationOfLiability.description')}
      />

      <LegalSection
        title={t('terms.sections.termination.title')}
        description={t('terms.sections.termination.description')}
      />

      <LegalSection
        title={t('terms.sections.governingLaw.title')}
        description={t('terms.sections.governingLaw.description')}
      />

      <LegalSection
        title={t('terms.sections.changes.title')}
        description={t('terms.sections.changes.description')}
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
