'use client'

import { motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/lib/theme-context'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('themeToggle')

  const themes = [
    { value: 'light', icon: Sun, labelKey: 'light' },
    { value: 'dark', icon: Moon, labelKey: 'dark' },
    { value: 'system', icon: Monitor, labelKey: 'system' },
  ] as const

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
        {themes.map(({ value, icon: Icon, labelKey }) => (
          <button
            aria-label={t('switchToTheme', { theme: t(labelKey) })}
            className={`
              relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
              ${
                theme === value
                  ? 'text-white'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
              }
            `}
            key={value}
            onClick={() => setTheme(value)}
            title={t('switchToTheme', { theme: t(labelKey) })}
            type="button"
          >
            {theme === value && (
              <motion.div
                className="absolute inset-0 bg-primary-600 rounded-md"
                initial={false}
                layoutId="theme-indicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="relative z-10" size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeToggle
