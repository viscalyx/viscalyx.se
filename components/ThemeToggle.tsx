'use client'

import { useTheme } from '@/lib/theme-context'
import { motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
              ${
                theme === value
                  ? 'text-white'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
              }
            `}
            title={`Switch to ${label} theme`}
            aria-label={`Switch to ${label} theme`}
          >
            {theme === value && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-primary-600 rounded-md"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon size={16} className="relative z-10" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeToggle
