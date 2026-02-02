'use client'

import {
  cleanupCookies,
  type CookieCategory,
  type CookieConsentSettings,
  cookieRegistry,
  defaultConsentSettings,
  getConsentSettings,
  hasConsentChoice,
  saveConsentSettings,
} from '@/lib/cookie-consent'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Cookie, Palette, Settings, Shield, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

const CookieConsentBanner = () => {
  const t = useTranslations('cookieConsent')
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [settings, setSettings] = useState<CookieConsentSettings>(
    defaultConsentSettings
  )

  // Refs for focus management
  const bannerRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null) // Accept All button
  const rejectButtonRef = useRef<HTMLButtonElement>(null) // Reject All button
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Cache focusable elements to avoid repeated DOM queries
  const cachedFocusableElements = useRef<NodeListOf<Element> | null>(null)

  // Memoized focusable elements query function
  const getFocusableElements = useCallback(() => {
    if (!bannerRef.current) return null

    // Use cached elements if available and banner structure hasn't changed
    if (cachedFocusableElements.current) {
      return cachedFocusableElements.current
    }

    const elements = bannerRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    )

    // Cache the elements
    cachedFocusableElements.current = elements
    return elements
  }, [])

  // Clear cached elements when showDetails changes (structure changes)
  useEffect(() => {
    cachedFocusableElements.current = null
  }, [showDetails])

  // Manage focus and body scroll when banner is visible
  useEffect(() => {
    // Focus trap functionality
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return

      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements()

        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement

        if (event.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab (forward)
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }

      if (event.key === 'Escape') {
        // Escape should focus the Reject All button (cancel action)
        rejectButtonRef.current?.focus()
      }
    }

    if (isVisible) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Add bottom padding to body to prevent content overlap
      document.body.style.paddingBottom = '200px' // Adjust based on banner height

      // Add keyboard event listener for focus trap
      document.addEventListener('keydown', handleKeyDown)

      // Focus the first interactive element (Accept All button) for better UX
      setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 100)
    } else {
      // Remove bottom padding when banner is hidden
      document.body.style.paddingBottom = ''

      // Remove keyboard event listener
      document.removeEventListener('keydown', handleKeyDown)

      // Restore focus to previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
        previousActiveElement.current = null
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.paddingBottom = ''
    }
  }, [isVisible, getFocusableElements])

  useEffect(() => {
    // Check if user has already made a choice
    const hasChoice = hasConsentChoice()
    setIsVisible(!hasChoice)

    if (hasChoice) {
      const currentSettings = getConsentSettings()
      if (currentSettings) {
        setSettings(currentSettings)
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookieConsentSettings = {
      'strictly-necessary': true,
      analytics: true,
      preferences: true,
    }

    setSettings(allAccepted)
    saveConsentSettings(allAccepted)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    setSettings(defaultConsentSettings)
    saveConsentSettings(defaultConsentSettings)
    cleanupCookies(defaultConsentSettings)
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    saveConsentSettings(settings)
    cleanupCookies(settings)
    setIsVisible(false)
  }

  const handleCategoryToggle = (category: CookieCategory) => {
    if (category === 'strictly-necessary') return // Cannot be disabled

    setSettings(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
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

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={bannerRef}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        aria-live="polite"
      >
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {!showDetails ? (
            // Simple banner view
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                <div>
                  <h2
                    id="cookie-banner-title"
                    className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                  >
                    {t('title')}
                  </h2>
                  <p
                    id="cookie-banner-description"
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    {t('description')}{' '}
                    <button
                      type="button"
                      onClick={() => setShowDetails(true)}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      aria-label={t('customizeSettings')}
                    >
                      {t('learnMore')}
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  ref={rejectButtonRef}
                  type="button"
                  onClick={handleRejectAll}
                  className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label={t('rejectAll')}
                >
                  {t('rejectAll')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="px-6 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                  aria-label={t('customizeSettings')}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  {t('customizeSettings')}
                </button>
                <button
                  ref={firstFocusableRef}
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
                  aria-label={t('acceptAll')}
                >
                  {t('acceptAll')}
                </button>
              </div>
            </div>
          ) : (
            // Detailed settings view
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="cookie-settings-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  {t('cookieSettings')}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={t('close')}
                  aria-describedby="cookie-settings-title"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
                {(
                  [
                    'strictly-necessary',
                    'preferences',
                    'analytics',
                  ] as CookieCategory[]
                ).map(category => {
                  const categoryName = t(`categories.${category}.name`)
                  const categoryDescription = t(
                    `categories.${category}.description`
                  )
                  const isRequired = category === 'strictly-necessary'
                  const cookiesInCategory = getCookiesForCategory(category)

                  return (
                    <div
                      key={category}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(category)}
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
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
                            aria-label={`${categoryName} ${isRequired ? t('required') : ''}`}
                            id={`toggle-${category}`}
                          />
                          <div
                            className={`
                            w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
                            ${
                              settings[category]
                                ? 'bg-primary-600 dark:bg-primary-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }
                            ${isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                            role="presentation"
                          >
                            <div
                              className={`
                              w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out transform
                              ${settings[category] ? 'translate-x-5' : 'translate-x-0'}
                            `}
                            />
                          </div>
                        </label>
                      </div>

                      <p
                        id={`${category}-description`}
                        className="text-sm text-gray-600 dark:text-gray-300 mb-3"
                      >
                        {categoryDescription}
                      </p>

                      {cookiesInCategory.length > 0 && (
                        <details className="text-xs text-gray-500 dark:text-gray-400">
                          <summary
                            className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded px-1"
                            aria-label={`${t('viewCookies')} for ${categoryName} (${cookiesInCategory.length} cookies)`}
                          >
                            {t('viewCookies')} ({cookiesInCategory.length})
                          </summary>
                          <ul className="mt-2 space-y-2 pl-4">
                            {cookiesInCategory.map(cookie => (
                              <li
                                key={cookie.name}
                                className="border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                              >
                                <div className="font-mono font-medium">
                                  {cookie.name}
                                </div>
                                <div>{cookie.purpose}</div>
                                <div className="text-gray-400 dark:text-gray-500">
                                  {t('duration')}: {cookie.duration}
                                  {cookie.provider &&
                                    ` • ${t('provider')}: ${cookie.provider}`}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {t('rejectAll')}
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                >
                  {t('acceptAll')}
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
                >
                  {t('savePreferences')}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieConsentBanner
