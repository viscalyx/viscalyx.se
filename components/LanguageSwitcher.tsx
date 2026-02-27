'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { saveLanguagePreference } from '@/lib/language-preferences'

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('language')

  const languages = useMemo(
    () => [
      { code: 'en', name: t('english'), flag: '🇺🇸' },
      { code: 'sv', name: t('swedish'), flag: '🇸🇪' },
    ],
    [t],
  )

  const currentLanguage = languages.find(lang => lang.code === locale)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Focus the active option when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const activeIndex = languages.findIndex(lang => lang.code === locale)
      setFocusedIndex(activeIndex)
    }
  }, [isOpen, locale, languages])

  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/'

      // Save language preference if user has consented to preferences cookies
      saveLanguagePreference(newLocale)

      router.push(`/${newLocale}${currentPath}`)
      setIsOpen(false)
      setFocusedIndex(-1)
    },
    [pathname, router],
  )

  const languageCount = languages.length

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          setIsOpen(true)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => (prev < languageCount - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : languageCount - 1))
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < languageCount) {
            handleLanguageChange(languages[focusedIndex].code)
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setFocusedIndex(-1)
          break
        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setFocusedIndex(languageCount - 1)
          break
      }
    },
    [isOpen, focusedIndex, languageCount, handleLanguageChange, languages],
  )

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        aria-activedescendant={
          isOpen && focusedIndex >= 0
            ? `language-option-${languages[focusedIndex].code}`
            : undefined
        }
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('selectLanguage')}
        className="flex min-h-[44px] min-w-[44px] items-center space-x-2 rounded-lg border border-secondary-200 bg-white px-3 py-2 transition-colors duration-200 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:hover:bg-secondary-700"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
        <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            aria-label={t('selectLanguage')}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg overflow-hidden z-50 min-w-37.5"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            onKeyDown={handleKeyDown}
            ref={listboxRef}
            role="listbox"
          >
            {languages.map((language, index) => (
              <button
                aria-selected={locale === language.code}
                className={`flex min-h-[44px] min-w-[44px] w-full cursor-pointer items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 ${
                  locale === language.code
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-secondary-700 dark:text-secondary-300'
                } ${focusedIndex === index ? 'ring-2 ring-inset ring-primary-500' : ''}`}
                id={`language-option-${language.code}`}
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                role="option"
                tabIndex={focusedIndex === index ? 0 : -1}
                type="button"
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher
