import { type Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import CookieSettings from '../../../components/CookieSettings'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cookiePolicy' })

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/${locale}/cookies`,
      languages: {
        en: '/en/cookies',
        sv: '/sv/cookies',
      },
    },
  }
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cookiePolicy' })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('description')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {t('lastUpdated')}: {new Date().toLocaleDateString(locale)}
          </p>
        </div>

        {/* Cookie Policy Content */}
        <div className="max-w-4xl mx-auto mb-12 prose prose-lg dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('whatAreCookies.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {t('whatAreCookies.description')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('howWeUseCookies.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {t('howWeUseCookies.description')}
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>{t('howWeUseCookies.purposes.essential')}</li>
              <li>{t('howWeUseCookies.purposes.preferences')}</li>
              <li>{t('howWeUseCookies.purposes.analytics')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('typesOfCookies.title')}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('typesOfCookies.session.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('typesOfCookies.session.description')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('typesOfCookies.persistent.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('typesOfCookies.persistent.description')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('typesOfCookies.firstParty.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('typesOfCookies.firstParty.description')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('typesOfCookies.thirdParty.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('typesOfCookies.thirdParty.description')}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('yourChoices.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {t('yourChoices.description')}
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>{t('yourChoices.options.browserSettings')}</li>
              <li>{t('yourChoices.options.ourSettings')}</li>
              <li>{t('yourChoices.options.thirdPartyOptOut')}</li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {t('yourChoices.disclaimer')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('contact.description')}
            </p>
          </section>
        </div>

        {/* Cookie Settings */}
        <CookieSettings />
      </div>
    </div>
  )
}
