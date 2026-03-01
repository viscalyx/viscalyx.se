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
      lastUpdatedLabel={t('lastUpdated')}
      subtitle={t('subtitle')}
      title={t('title')}
    >
      <LegalSection
        description={t('sections.agreement.description')}
        title={t('sections.agreement.title')}
      />

      <LegalSection
        description={t('sections.services.description')}
        items={safeTranslationArray(t.raw('sections.services.items'))}
        title={t('sections.services.title')}
      />

      <LegalSection
        description={t('sections.userResponsibilities.description')}
        items={safeTranslationArray(
          t.raw('sections.userResponsibilities.items'),
        )}
        title={t('sections.userResponsibilities.title')}
      />

      <LegalSection
        description={t('sections.intellectualProperty.description')}
        title={t('sections.intellectualProperty.title')}
      />

      <LegalSection
        description={t('sections.limitationOfLiability.description')}
        title={t('sections.limitationOfLiability.title')}
      />

      <LegalSection
        description={t('sections.termination.description')}
        title={t('sections.termination.title')}
      />

      <LegalSection
        description={t('sections.governingLaw.description')}
        title={t('sections.governingLaw.title')}
      />

      <LegalSection
        description={t('sections.changes.description')}
        title={t('sections.changes.title')}
      />

      {/* Contact */}
      <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
        {t('sections.contact.title')}
      </h2>
      <p className="text-secondary-600 dark:text-secondary-400 mb-4">
        {t('sections.contact.description')}
      </p>
      <p className="text-secondary-600 dark:text-secondary-400">
        <strong>{t('sections.contact.email')}:</strong>{' '}
        <a
          className="text-primary-600 dark:text-primary-400 hover:underline"
          href={`mailto:${t('sections.contact.emailAddress')}`}
        >
          {t('sections.contact.emailAddress')}
        </a>
      </p>
    </LegalPageLayout>
  )
}

export default TermsPageClient
