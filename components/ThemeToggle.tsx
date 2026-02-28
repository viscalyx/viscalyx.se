'use client'

import { motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useId } from 'react'
import { useTheme } from '@/lib/theme-context'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('themeToggle')
  const instanceId = useId()
  const indicatorLayoutId = `theme-indicator-${instanceId}`

  const themes = [
    { value: 'light', icon: Sun, labelKey: 'light' },
    { value: 'dark', icon: Moon, labelKey: 'dark' },
    { value: 'system', icon: Monitor, labelKey: 'system' },
  ] as const

  return (
    <div className="relative inline-block w-fit max-w-max">
      <div className="inline-flex w-fit max-w-max items-center gap-1 rounded-lg border border-secondary-200 bg-secondary-100 p-1 dark:border-secondary-700 dark:bg-secondary-700">
        {themes.map(({ value, icon: Icon, labelKey }) => (
          <button
            aria-label={t('switchToTheme', { theme: t(labelKey) })}
            className={`
              relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-secondary-900
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
                layoutId={indicatorLayoutId}
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
