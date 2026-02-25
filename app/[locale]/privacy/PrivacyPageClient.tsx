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
      title={t('title')}
      subtitle={t('subtitle')}
      lastUpdatedLabel={t('lastUpdated')}
      lastUpdatedDate={lastUpdatedDate}
    >
      <LegalSection
        title={t('sections.informationWeCollect.title')}
        description={t('sections.informationWeCollect.description')}
        items={safeTranslationArray(
          t.raw('sections.informationWeCollect.items')
        )}
      />

      <LegalSection
        title={t('sections.howWeUse.title')}
        description={t('sections.howWeUse.description')}
        items={safeTranslationArray(t.raw('sections.howWeUse.items'))}
      />

      <LegalSection
        title={t('sections.dataSecurity.title')}
        description={t('sections.dataSecurity.description')}
      />

      <LegalSection
        title={t('sections.cookies.title')}
        description={t('sections.cookies.description')}
      />

      <LegalSection
        title={t('sections.thirdParty.title')}
        description={t('sections.thirdParty.description')}
        items={safeTranslationArray(t.raw('sections.thirdParty.items'))}
      />

      <LegalSection
        title={t('sections.yourRights.title')}
        description={t('sections.yourRights.description')}
        items={safeTranslationArray(t.raw('sections.yourRights.items'))}
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
          href={`mailto:${t('sections.contact.emailAddress')}`}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          {t('sections.contact.emailAddress')}
        </a>
      </p>
    </LegalPageLayout>
  )
}

export default PrivacyPageClient
