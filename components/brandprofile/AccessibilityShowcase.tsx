'use client'

import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

interface ComponentDemoProps {
  title: string
  description: string
  children: ReactNode
}

const ComponentDemo = ({
  title,
  description,
  children,
}: ComponentDemoProps) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
        {title}
      </h4>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        {description}
      </p>
    </div>
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
      {children}
    </div>
  </div>
)

const AccessibilityShowcase = () => {
  const t = useTranslations('brandProfile.accessibility')

  return (
    <div className="space-y-12">
      <ComponentDemo
        title={t('focusStates.title')}
        description={t('focusStates.description')}
      >
        <div className="space-y-4">
          <button type="button" className="btn-primary focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800">
            {t('focusStates.buttonText')}
          </button>
          <input
            type="text"
            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
            placeholder={t('focusStates.inputPlaceholder')}
          />
          <button
            type="button"
            className="inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded underline"
          >
            {t('focusStates.linkText')}
          </button>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('colorContrast.title')}
        description={t('colorContrast.description')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
              {t('colorContrast.goodContrast')}
            </h4>
            <div className="p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded">
              <p className="text-secondary-900 dark:text-secondary-100">
                {t('colorContrast.contrastText')}
              </p>
            </div>
            <div className="p-3 bg-primary-600 rounded">
              <p className="text-white">{t('colorContrast.whiteOnPrimary')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
              {t('colorContrast.screenReaderSupport')}
            </h4>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded">
              <p className="text-secondary-700 dark:text-secondary-300">
                {t('colorContrast.ariaText')}
              </p>
              <button
                type="button"
                className="mt-2 btn-secondary"
                aria-label={t('colorContrast.downloadLabel')}
              >
                <Download className="w-4 h-4 mr-2" />
                {t('colorContrast.downloadText')}
              </button>
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('semanticHtml.title')}
        description={t('semanticHtml.description')}
      >
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {t('semanticHtml.heading1')}
          </h1>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            {t('semanticHtml.heading2')}
          </h2>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
            {t('semanticHtml.heading3')}
          </h3>
          <p className="text-secondary-700 dark:text-secondary-300">
            {t('semanticHtml.paragraphText')}
          </p>
        </div>
      </ComponentDemo>
    </div>
  )
}

export default AccessibilityShowcase
