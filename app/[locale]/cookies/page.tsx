import CookieSettingsWrapper from '@/components/CookieSettingsWrapper'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { getStaticPageDates } from '@/lib/file-dates'

export const runtime = 'edge'
import { useFormatter, useTranslations } from 'next-intl'

// Get the actual last modified date
const staticPageDates = getStaticPageDates()

export default function CookiesPage() {
  const translations = useTranslations('cookies')
  const format = useFormatter()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {translations('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {translations('description')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {translations('lastUpdated')}:{' '}
              {format.dateTime(staticPageDates.cookies, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Cookie Policy Content */}
          <div className="max-w-4xl mx-auto mb-12 prose prose-lg dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {translations('whatAreCookies.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {translations('whatAreCookies.description')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {translations('howWeUseCookies.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {translations('howWeUseCookies.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{translations('howWeUseCookies.purposes.essential')}</li>
                <li>{translations('howWeUseCookies.purposes.preferences')}</li>
                <li>{translations('howWeUseCookies.purposes.analytics')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {translations('typesOfCookies.title')}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {translations('typesOfCookies.session.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {translations('typesOfCookies.session.description')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {translations('typesOfCookies.persistent.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {translations('typesOfCookies.persistent.description')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {translations('typesOfCookies.firstParty.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {translations('typesOfCookies.firstParty.description')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {translations('typesOfCookies.thirdParty.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {translations('typesOfCookies.thirdParty.description')}
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {translations('yourChoices.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {translations('yourChoices.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{translations('yourChoices.options.browserSettings')}</li>
                <li>{translations('yourChoices.options.ourSettings')}</li>
                <li>{translations('yourChoices.options.thirdPartyOptOut')}</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {translations('yourChoices.disclaimer')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {translations('contact.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {translations('contact.description')}
              </p>
            </section>
          </div>

          {/* Cookie Settings */}
          <CookieSettingsWrapper />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
