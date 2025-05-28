'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('language')

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'sv', name: t('swedish'), flag: '🇸🇪' },
  ]

  const currentLanguage = languages.find(lang => lang.code === locale)

  // Ensure the component re-renders when locale changes
  useEffect(() => {
    // This effect will run whenever locale changes, ensuring proper re-rendering
    setIsOpen(false) // Close dropdown when locale changes
  }, [locale])

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/'
    router.push(`/${newLocale}${currentPath}`)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
      >
        <Globe className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
        <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 right-0 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg overflow-hidden z-50 min-w-[150px]"
        >
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200 ${
                locale === language.code
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-secondary-700 dark:text-secondary-300'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
            </button>
          ))}
        </motion.div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}

export default LanguageSwitcher
