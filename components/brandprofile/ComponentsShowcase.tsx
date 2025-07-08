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
          <div className="flex items-center space-x-3 p-4 bg-[#059669]/10 dark:bg-[#059669]/20 border border-[#86efac]/30 dark:border-[#065f46]/50 rounded-lg">
            <Check className="w-5 h-5 text-[#065f46]/80 dark:text-[#86efac]" />
            <span className="text-[#065f46]/80 dark:text-[#86efac]">
              {t('alerts.success')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20 border border-[#92400e]/30 dark:border-[#fcd34d]/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-[#92400e]/80 dark:text-[#fcd34d]" />
            <span className="text-[#92400e]/80 dark:text-[#fcd34d]">
              {t('alerts.warning')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#ef4444]/10 dark:bg-[#ef4444]/20 border border-[#991b1b]/30 dark:border-[#fca5a5]/50 rounded-lg">
            <X className="w-5 h-5 text-[#991b1b] dark:text-[#fca5a5]" />
            <span className="text-[#991b1b] dark:text-[#fca5a5]">
              {t('alerts.error')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#3b82f6]/10 dark:bg-[#3b82f6]/20 border border-[#1e40af]/30 dark:border-[#93c5fd]/50 rounded-lg">
            <Info className="w-5 h-5 text-[#1e40af] dark:text-[#93c5fd]" />
            <span className="text-[#1e40af] dark:text-[#93c5fd]">
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
