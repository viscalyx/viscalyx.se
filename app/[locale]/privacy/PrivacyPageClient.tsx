'use client'

import { useTranslations } from 'next-intl'
import LegalPageLayout from '@/components/LegalPageLayout'
import LegalSection, { safeTranslationArray } from '@/components/LegalSection'

interface PrivacyPageClientProps {
  lastUpdatedDate: Date
}

const PrivacyPageClient = ({ lastUpdatedDate }: PrivacyPageClientProps) => {
  const t = useTranslations('privacy')

  return (
    <LegalPageLayout
      lastUpdatedDate={lastUpdatedDate}
      lastUpdatedLabel={t('lastUpdated')}
      subtitle={t('subtitle')}
      title={t('title')}
    >
      <LegalSection
        description={t('sections.informationWeCollect.description')}
        items={safeTranslationArray(
          t.raw('sections.informationWeCollect.items'),
        )}
        title={t('sections.informationWeCollect.title')}
      />

      <LegalSection
        description={t('sections.howWeUse.description')}
        items={safeTranslationArray(t.raw('sections.howWeUse.items'))}
        title={t('sections.howWeUse.title')}
      />

      <LegalSection
        description={t('sections.dataSecurity.description')}
        title={t('sections.dataSecurity.title')}
      />

      <LegalSection
        description={t('sections.cookies.description')}
        title={t('sections.cookies.title')}
      />

      <LegalSection
        description={t('sections.thirdParty.description')}
        items={safeTranslationArray(t.raw('sections.thirdParty.items'))}
        title={t('sections.thirdParty.title')}
      />

      <LegalSection
        description={t('sections.yourRights.description')}
        items={safeTranslationArray(t.raw('sections.yourRights.items'))}
        title={t('sections.yourRights.title')}
      />

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
          aria-label={`Email ${t('sections.contact.emailAddress')}`}
          className="text-primary-600 dark:text-primary-400 hover:underline"
          href={`mailto:${t('sections.contact.emailAddress')}`}
        >
          {t('sections.contact.emailAddress')}
        </a>
      </p>
    </LegalPageLayout>
  )
}

export default PrivacyPageClient
