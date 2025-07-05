'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface ColorItem {
  name: string
  hex: string
  rgb: string
  usage?: string
}

interface ColorSwatchProps {
  color: ColorItem
  className?: string
}

const ColorSwatch = ({ color, className = '' }: ColorSwatchProps) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedValue(null)
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
          onClick={() => handleCopy(color.hex)}
          className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
          tabIndex={0}
        >
          {color.hex}
        </button>
        <button
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

  const primaryColors = [
    { name: 'primary-50', hex: '#eff6ff', rgb: 'rgb(239, 246, 255)' },
    { name: 'primary-100', hex: '#dbeafe', rgb: 'rgb(219, 234, 254)' },
    { name: 'primary-200', hex: '#bfdbfe', rgb: 'rgb(191, 219, 254)' },
    { name: 'primary-300', hex: '#93c5fd', rgb: 'rgb(147, 197, 253)' },
    { name: 'primary-400', hex: '#60a5fa', rgb: 'rgb(96, 165, 250)' },
    { name: 'primary-500', hex: '#3b82f6', rgb: 'rgb(59, 130, 246)' },
    { name: 'primary-600', hex: '#2563eb', rgb: 'rgb(37, 99, 235)' },
    { name: 'primary-700', hex: '#1d4ed8', rgb: 'rgb(29, 78, 216)' },
    { name: 'primary-800', hex: '#1e40af', rgb: 'rgb(30, 64, 175)' },
    { name: 'primary-900', hex: '#1e3a8a', rgb: 'rgb(30, 58, 138)' },
  ]

  const secondaryColors = [
    { name: 'secondary-50', hex: '#f8fafc', rgb: 'rgb(248, 250, 252)' },
    { name: 'secondary-100', hex: '#f1f5f9', rgb: 'rgb(241, 245, 249)' },
    { name: 'secondary-200', hex: '#e2e8f0', rgb: 'rgb(226, 232, 240)' },
    { name: 'secondary-300', hex: '#cbd5e1', rgb: 'rgb(203, 213, 225)' },
    { name: 'secondary-400', hex: '#94a3b8', rgb: 'rgb(148, 163, 184)' },
    { name: 'secondary-500', hex: '#64748b', rgb: 'rgb(100, 116, 139)' },
    { name: 'secondary-600', hex: '#475569', rgb: 'rgb(71, 85, 105)' },
    { name: 'secondary-700', hex: '#334155', rgb: 'rgb(51, 65, 85)' },
    { name: 'secondary-800', hex: '#1e293b', rgb: 'rgb(30, 41, 59)' },
    { name: 'secondary-900', hex: '#0f172a', rgb: 'rgb(15, 23, 42)' },
  ]

  const accentColors = [
    {
      name: 'Success',
      hex: '#22c55e',
      rgb: 'rgb(34, 197, 94)',
      usage: 'Success states, confirmations',
    },
    {
      name: 'Warning',
      hex: '#f59e0b',
      rgb: 'rgb(245, 158, 11)',
      usage: 'Warnings, cautions',
    },
    {
      name: 'Error',
      hex: '#ef4444',
      rgb: 'rgb(239, 68, 68)',
      usage: 'Errors, destructive actions',
    },
    {
      name: 'Info',
      hex: '#3b82f6',
      rgb: 'rgb(59, 130, 246)',
      usage: 'Information, tips',
    },
  ]

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
