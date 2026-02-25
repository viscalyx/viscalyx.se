'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Cookie, Settings, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import CookieCategoryIcon from '@/components/CookieCategoryIcon'
import CookieCategoryToggle from '@/components/CookieCategoryToggle'
import {
  type CookieCategory,
  type CookieConsentSettings,
  cleanupCookies,
  defaultConsentSettings,
  getConsentSettings,
  saveConsentSettings,
} from '@/lib/cookie-consent'
import { getCookiesForCategory } from '@/lib/cookie-ui-utils'

const CookieConsentBanner = () => {
  const t = useTranslations('cookieConsent')
  // Start with false/defaults to match server rendering, then sync after hydration
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [settings, setSettings] = useState<CookieConsentSettings>(
    defaultConsentSettings,
  )

  // Sync state with localStorage/cookies after hydration to avoid SSR mismatch
  // This is intentional - we're syncing with external storage state on mount
  useEffect(() => {
    // Single storage read: getConsentSettings returns null if no choice exists
    const storedSettings = getConsentSettings()
    const hasChoice = storedSettings !== null
    setIsVisible(!hasChoice)
    if (storedSettings) {
      setSettings(storedSettings)
    }
  }, [])

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
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
    )

    // Cache the elements
    cachedFocusableElements.current = elements
    return elements
  }, [])

  // Manage focus and keyboard behavior when banner is visible
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

      // Add keyboard event listener for focus trap
      document.addEventListener('keydown', handleKeyDown)

      // Focus the first interactive element (Accept All button) for better UX
      setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 100)
    } else {
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
    }
  }, [isVisible, getFocusableElements])

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

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        aria-describedby="cookie-banner-description"
        aria-labelledby="cookie-banner-title"
        aria-live="polite"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
        exit={{ y: 100, opacity: 0 }}
        initial={{ y: 100, opacity: 0 }}
        ref={bannerRef}
        role="dialog"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {!showDetails ? (
            // Simple banner view
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-primary-600 dark:text-primary-400 shrink-0 mt-1" />
                <div>
                  <h2
                    className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                    id="cookie-banner-title"
                  >
                    {t('title')}
                  </h2>
                  <p
                    className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                    id="cookie-banner-description"
                  >
                    {t('description')}{' '}
                    <button
                      aria-label={t('customizeSettings')}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      onClick={() => {
                        cachedFocusableElements.current = null
                        setShowDetails(true)
                      }}
                      type="button"
                    >
                      {t('learnMore')}
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  aria-label={t('rejectAll')}
                  className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={handleRejectAll}
                  ref={rejectButtonRef}
                  type="button"
                >
                  {t('rejectAll')}
                </button>
                <button
                  aria-label={t('customizeSettings')}
                  className="px-6 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                  onClick={() => {
                    cachedFocusableElements.current = null
                    setShowDetails(true)
                  }}
                  type="button"
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  {t('customizeSettings')}
                </button>
                <button
                  aria-label={t('acceptAll')}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
                  onClick={handleAcceptAll}
                  ref={firstFocusableRef}
                  type="button"
                >
                  {t('acceptAll')}
                </button>
              </div>
            </div>
          ) : (
            // Detailed settings view
            <div className="flex flex-col max-h-[70vh]">
              <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                    id="cookie-settings-title"
                  >
                    {t('cookieSettings')}
                  </h2>
                  <button
                    aria-describedby="cookie-settings-title"
                    aria-label={t('close')}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      cachedFocusableElements.current = null
                      setShowDetails(false)
                    }}
                    type="button"
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
                      `categories.${category}.description`,
                    )
                    const isRequired = category === 'strictly-necessary'
                    const cookiesInCategory = getCookiesForCategory(category)

                    return (
                      <div
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        key={category}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <CookieCategoryIcon category={category} />
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
                          <CookieCategoryToggle
                            category={category}
                            categoryName={categoryName}
                            checked={settings[category]}
                            onChange={handleCategoryToggle}
                            requiredLabel={t('required')}
                          />
                        </div>

                        <p
                          className="text-sm text-gray-600 dark:text-gray-300 mb-3"
                          id={`${category}-description`}
                        >
                          {categoryDescription}
                        </p>

                        {cookiesInCategory.length > 0 && (
                          <details className="text-xs text-gray-500 dark:text-gray-400">
                            <summary
                              aria-label={t('viewCookiesAriaLabel', {
                                categoryName,
                                count: cookiesInCategory.length,
                              })}
                              className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded px-1"
                            >
                              {t('viewCookies')} ({cookiesInCategory.length})
                            </summary>
                            <ul className="mt-2 space-y-2 pl-4">
                              {cookiesInCategory.map(cookie => (
                                <li
                                  className="border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                                  key={cookie.name}
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
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={handleRejectAll}
                  type="button"
                >
                  {t('rejectAll')}
                </button>
                <button
                  className="px-6 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                  onClick={handleAcceptAll}
                  type="button"
                >
                  {t('acceptAll')}
                </button>
                <button
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
                  onClick={handleSavePreferences}
                  type="button"
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
