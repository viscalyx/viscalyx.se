'use client'

import { AlertCircle, Check, Info, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ComponentDemo from './ComponentDemo'

const ComponentsShowcase = () => {
  const t = useTranslations('brandProfile.componentsShowcase')

  return (
    <div className="space-y-12">
      <ComponentDemo
        title={t('buttons.title')}
        description={t('buttons.description')}
      >
        <div className="flex flex-wrap gap-4">
          <button type="button" className="btn-primary">
            {t('buttons.primary')}
          </button>
          <button type="button" className="btn-secondary">
            {t('buttons.secondary')}
          </button>
          <button type="button" className="btn-primary" disabled>
            {t('buttons.disabled')}
          </button>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('cards.title')}
        description={t('cards.description')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 card-hover">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              {t('cards.cardTitle')}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {t('cards.cardDescription')}
            </p>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 card-hover">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              {t('cards.anotherCard')}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {t('cards.anotherCardDescription')}
            </p>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('alerts.title')}
        description={t('alerts.description')}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300">
              {t('alerts.success')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-800 dark:text-yellow-300">
              {t('alerts.warning')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-300">
              {t('alerts.error')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-300">
              {t('alerts.info')}
            </span>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('forms.title')}
        description={t('forms.description')}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="showcase-email"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
            >
              {t('forms.emailLabel')}
            </label>
            <input
              id="showcase-email"
              type="email"
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
              placeholder={t('forms.emailPlaceholder')}
            />
          </div>
          <div>
            <label
              htmlFor="showcase-message"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
            >
              {t('forms.messageLabel')}
            </label>
            <textarea
              id="showcase-message"
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
              rows={4}
              placeholder={t('forms.messagePlaceholder')}
            />
          </div>
        </div>
      </ComponentDemo>
    </div>
  )
}

export default ComponentsShowcase
