'use client'

import { getAllColors, type ColorItem } from '@/lib/colors'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

interface ColorSwatchProps {
  color: ColorItem
  className?: string
}

const ColorSwatch = ({ color, className = '' }: ColorSwatchProps) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Reset the copied state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setCopiedValue(null)
        timeoutRef.current = null
      }, 2000)
    } catch (err) {
      console.error('Failed to copy color: ', err)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`group relative ${className}`}
    >
      <button
        type="button"
        onClick={() => handleCopy(color.hex)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
        aria-label={`Copy ${color.name} color ${color.hex}`}
        tabIndex={0}
      >
        <div
          className={`w-full h-20 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 ${
            color.name.includes('50') || color.name.includes('100')
              ? 'border-secondary-300 dark:border-secondary-600'
              : ''
          }`}
          style={{ backgroundColor: color.hex }}
        />

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            {copiedValue ? 'Copied!' : 'Click to copy'}
          </div>
        )}

        {/* Copy confirmation */}
        {copiedValue === color.hex && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <span className="text-white text-sm font-medium">Copied!</span>
          </div>
        )}
      </button>

      <div className="mt-2 space-y-1">
        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
          {color.name}
        </p>
        <button
          type="button"
          onClick={() => handleCopy(color.hex)}
          className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
          tabIndex={0}
        >
          {color.hex}
        </button>
        <button
          type="button"
          onClick={() => handleCopy(color.rgb)}
          className="text-xs text-secondary-500 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
          tabIndex={0}
        >
          {color.rgb}
        </button>
        {color.usage && (
          <p className="text-xs text-secondary-600 dark:text-secondary-400 italic">
            {color.usage}
          </p>
        )}
      </div>
    </motion.div>
  )
}

const ColorShowcase = () => {
  const t = useTranslations('brandProfile.colorShowcase')
  const {
    primary: primaryColors,
    secondary: secondaryColors,
    accent: accentColors,
  } = getAllColors()

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          {t('primaryColors')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {primaryColors.map(color => (
            <ColorSwatch key={color.name} color={color} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          {t('secondaryColors')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {secondaryColors.map(color => (
            <ColorSwatch key={color.name} color={color} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          {t('accentColors')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accentColors.map(color => (
            <ColorSwatch key={color.name} color={color} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ColorShowcase
