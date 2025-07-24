'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  Cookie,
  Download,
  Palette,
  Settings,
  Shield,
  Trash2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import {
  cleanupCookies,
  type CookieCategory,
  type CookieConsentSettings,
  cookieRegistry,
  defaultConsentSettings,
  getConsentSettings,
  getConsentTimestamp,
  resetConsent,
  saveConsentSettings,
} from '../lib/cookie-consent'

interface CookieSettingsProps {
  onSettingsChange?: (settings: CookieConsentSettings) => void
}

const CookieSettings = ({ onSettingsChange }: CookieSettingsProps) => {
  const t = useTranslations('cookieConsent')
  const [settings, setSettings] = useState<CookieConsentSettings>(
    defaultConsentSettings
  )
  const [consentTimestamp, setConsentTimestamp] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const currentSettings = getConsentSettings()
    if (currentSettings) {
      setSettings(currentSettings)
    }

    const timestamp = getConsentTimestamp()
    setConsentTimestamp(timestamp)
  }, [])

  const handleCategoryToggle = (category: CookieCategory) => {
    if (category === 'strictly-necessary') return // Cannot be disabled

    const newSettings = {
      ...settings,
      [category]: !settings[category],
    }

    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    saveConsentSettings(settings)
    cleanupCookies(settings)
    setConsentTimestamp(new Date())
    setShowSuccess(true)
    setIsLoading(false)

    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleAcceptAll = () => {
    const allAccepted: CookieConsentSettings = {
      'strictly-necessary': true,
      analytics: true,
      preferences: true,
    }

    setSettings(allAccepted)
    onSettingsChange?.(allAccepted)
  }

  const handleRejectAll = () => {
    setSettings(defaultConsentSettings)
    onSettingsChange?.(defaultConsentSettings)
  }

  const handleResetConsent = async () => {
    if (confirm(t('resetConfirmation'))) {
      setIsLoading(true)
      resetConsent()
      setSettings(defaultConsentSettings)
      setConsentTimestamp(null)
      onSettingsChange?.(defaultConsentSettings)
      setIsLoading(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleExportData = () => {
    const data = {
      consentSettings: settings,
      consentTimestamp: consentTimestamp?.toISOString(),
      cookieRegistry: cookieRegistry,
      exportTimestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cookie-consent-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getCategoryIcon = (category: CookieCategory) => {
    switch (category) {
      case 'strictly-necessary':
        return <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'analytics':
        return (
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        )
      case 'preferences':
        return (
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        )
      default:
        return <Cookie className="w-5 h-5" />
    }
  }

  const getCookiesForCategory = (category: CookieCategory) => {
    return cookieRegistry.filter(cookie => cookie.category === category)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('cookieSettings')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {t('settingsDescription')}
        </p>

        {consentTimestamp && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              {t('lastUpdated')}: {consentTimestamp.toLocaleDateString()}{' '}
              {consentTimestamp.toLocaleTimeString()}
            </p>
          </div>
        )}

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ {t('settingsSaved')}
            </p>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('quickActions')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
          >
            {t('acceptAll')}
          </button>
          <button
            onClick={handleRejectAll}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {t('rejectAll')}
          </button>
          <button
            onClick={handleExportData}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" />
            {t('exportData')}
          </button>
          <button
            onClick={handleResetConsent}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            {t('resetConsent')}
          </button>
        </div>
      </div>

      {/* Cookie Categories */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('categories.title')}
        </h2>

        {(
          ['strictly-necessary', 'preferences', 'analytics'] as CookieCategory[]
        ).map(category => {
          const categoryName = t(`categories.${category}.name`)
          const categoryDescription = t(`categories.${category}.description`)
          const isRequired = category === 'strictly-necessary'
          const cookiesInCategory = getCookiesForCategory(category)

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {categoryName}
                      {isRequired && (
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                          {t('required')}
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[category]}
                    onChange={() => handleCategoryToggle(category)}
                    disabled={isRequired}
                    className="sr-only"
                    aria-describedby={`${category}-description`}
                  />
                  <div
                    className={`
                    w-12 h-6 rounded-full transition-colors duration-200 ease-in-out
                    ${
                      settings[category]
                        ? 'bg-primary-600 dark:bg-primary-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }
                    ${isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  >
                    <div
                      className={`
                      w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out transform mt-0.5 ml-0.5
                      ${settings[category] ? 'translate-x-6' : 'translate-x-0'}
                    `}
                    />
                  </div>
                </label>
              </div>

              <p
                id={`${category}-description`}
                className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
              >
                {categoryDescription}
              </p>

              {cookiesInCategory.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                    {t('viewCookies')} ({cookiesInCategory.length})
                  </summary>
                  <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    {cookiesInCategory.map(cookie => (
                      <div
                        key={cookie.name}
                        className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg"
                      >
                        <div className="font-mono font-medium text-primary-600 dark:text-primary-400 mb-2">
                          {cookie.name}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 mb-2">
                          {cookie.purpose}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          <div>
                            {t('duration')}:{' '}
                            <span className="font-medium">
                              {cookie.duration}
                            </span>
                          </div>
                          {cookie.provider && (
                            <div>
                              {t('provider')}:{' '}
                              <span className="font-medium">
                                {cookie.provider}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="px-8 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('saving') : t('savePreferences')}
        </button>
      </div>
    </div>
  )
}

export default CookieSettings
