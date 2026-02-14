'use client'

import LegalPageLayout from '@/components/LegalPageLayout'
import LegalSection, { safeTranslationArray } from '@/components/LegalSection'
import { useTranslations } from 'next-intl'

interface PrivacyPageClientProps {
  lastUpdatedDate: Date
}

const PrivacyPageClient = ({ lastUpdatedDate }: PrivacyPageClientProps) => {
  const t = useTranslations('privacy')

  return (
    <LegalPageLayout
      title={t('privacy.title')}
      subtitle={t('privacy.subtitle')}
      lastUpdatedLabel={t('privacy.lastUpdated')}
      lastUpdatedDate={lastUpdatedDate}
    >
      <LegalSection
        title={t('privacy.sections.informationWeCollect.title')}
        description={t('privacy.sections.informationWeCollect.description')}
        items={safeTranslationArray(
          t.raw('privacy.sections.informationWeCollect.items')
        )}
      />

      <LegalSection
        title={t('privacy.sections.howWeUse.title')}
        description={t('privacy.sections.howWeUse.description')}
        items={safeTranslationArray(t.raw('privacy.sections.howWeUse.items'))}
      />

      <LegalSection
        title={t('privacy.sections.dataSecurity.title')}
        description={t('privacy.sections.dataSecurity.description')}
      />

      <LegalSection
        title={t('privacy.sections.cookies.title')}
        description={t('privacy.sections.cookies.description')}
      />

      <LegalSection
        title={t('privacy.sections.thirdParty.title')}
        description={t('privacy.sections.thirdParty.description')}
        items={safeTranslationArray(t.raw('privacy.sections.thirdParty.items'))}
      />

      <LegalSection
        title={t('privacy.sections.yourRights.title')}
        description={t('privacy.sections.yourRights.description')}
        items={safeTranslationArray(t.raw('privacy.sections.yourRights.items'))}
      />

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
