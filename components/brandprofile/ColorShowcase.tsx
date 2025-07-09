'use client'

import {
  getAccessibilityInfo,
  getAllColors,
  getColorCombinations,
  type ColorItem,
} from '@/lib/colors'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

interface ColorSwatchProps {
  color: ColorItem
  className?: string
  showAccessibilityInfo?: boolean
}

const ColorSwatch = ({
  color,
  className = '',
  showAccessibilityInfo = false,
}: ColorSwatchProps) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
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

  const contrastWithWhite = color.hex
    ? // Simple contrast calculation for demonstration
      parseInt(color.hex.replace('#', ''), 16) > 0x808080
      ? 'low'
      : 'high'
    : 'unknown'

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`group relative ${className}`}
    >
      <div className="relative">
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
        </button>

        {/* Accessibility info button - moved outside the main button */}
        {showAccessibilityInfo && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              setShowAccessibilityPanel(!showAccessibilityPanel)
            }}
            className="absolute top-1 right-1 w-6 h-6 bg-white dark:bg-secondary-800 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Show accessibility info"
          >
            <Info className="w-3 h-3 text-primary-600" />
          </button>
        )}
      </div>

      {/* Accessibility Panel */}
      {showAccessibilityPanel && (
        <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg text-left">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-secondary-900 dark:text-secondary-100">
                Accessibility
              </span>
              {contrastWithWhite === 'high' ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <AlertCircle className="w-3 h-3 text-yellow-500" />
              )}
            </div>
            <p className="text-xs text-secondary-600 dark:text-secondary-400">
              {contrastWithWhite === 'high'
                ? 'Good contrast with white text'
                : 'Use dark text on this background'}
            </p>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !showAccessibilityPanel && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary-900 dark:bg-secondary-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          {copiedValue ? 'Copied!' : 'Click to copy'}
        </div>
      )}

      {/* Copy confirmation */}
      {copiedValue === color.hex && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <span className="text-white text-sm font-medium">Copied!</span>
        </div>
      )}

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

interface ColorCombinationProps {
  combination: {
    name: string
    lightBackground: string
    lightText: string
    darkBackground: string
    darkText: string
    usage: string
    component: string
  }
}

const ColorCombination = ({ combination }: ColorCombinationProps) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

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
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 space-y-4"
    >
      <div>
        <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
          {combination.name}
        </h4>
        <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-2">
          {combination.usage}
        </p>
        <p className="text-xs text-secondary-500 dark:text-secondary-500 italic">
          Used in: {combination.component}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Light Theme */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
            Light Theme
          </div>
          <div
            className="h-16 rounded-md border border-secondary-200 dark:border-secondary-600 flex items-center justify-center text-sm font-medium relative overflow-hidden"
            style={{
              backgroundColor: combination.lightBackground,
              color: combination.lightText,
            }}
          >
            <span className="relative z-10">Sample Text</span>
            {copiedValue && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xs">Copied!</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleCopy(combination.lightBackground)}
              className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
            >
              Background: {combination.lightBackground}
            </button>
            <button
              onClick={() => handleCopy(combination.lightText)}
              className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
            >
              Text: {combination.lightText}
            </button>
          </div>
        </div>

        {/* Dark Theme */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
            Dark Theme
          </div>
          <div
            className="h-16 rounded-md border border-secondary-200 dark:border-secondary-600 flex items-center justify-center text-sm font-medium relative overflow-hidden"
            style={{
              backgroundColor: combination.darkBackground,
              color: combination.darkText,
            }}
          >
            <span className="relative z-10">Sample Text</span>
            {copiedValue && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xs">Copied!</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleCopy(combination.darkBackground)}
              className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
            >
              Background: {combination.darkBackground}
            </button>
            <button
              onClick={() => handleCopy(combination.darkText)}
              className="text-xs text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
            >
              Text: {combination.darkText}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ColorShowcase = () => {
  const t = useTranslations('brandProfile.colorShowcase')
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false)
  const {
    primary: primaryColors,
    secondary: secondaryColors,
    dataVisualization: dataVisualizationColors,
    backgrounds: backgroundColors,
    typography: typographyColors,
    borders: borderColors,
    semantic: semanticColors,
    uiStates: uiStateColors,
    code: codeColors,
  } = getAllColors()

  const colorCombinations = getColorCombinations()
  const accessibilityInfo = getAccessibilityInfo()

  return (
    <div className="space-y-12">
      {/* Accessibility Toggle */}
      <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
            Color Accessibility
          </h3>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            All colors meet WCAG AA contrast requirements (4.5:1 ratio minimum)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showAccessibilityInfo
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-secondary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-secondary-700'
          }`}
        >
          {showAccessibilityInfo ? 'Hide' : 'Show'} Accessibility Info
        </button>
      </div>

      {/* Accessibility Summary */}
      {showAccessibilityInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
          <div>
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Contrast Test Results
            </h4>
            <div className="space-y-1">
              {accessibilityInfo.contrastTests.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  {test.passes ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-secondary-700 dark:text-secondary-300">
                    {test.name}: {test.ratio.toFixed(2)}:1
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Color Blind Friendly
            </h4>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
              Colors tested for common color vision deficiencies:
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">
                  Protanopia (Red-blind)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">
                  Deuteranopia (Green-blind)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">
                  Tritanopia (Blue-blind)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          {t('primaryColors')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {primaryColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          {t('secondaryColors')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {secondaryColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Background Colors
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Colors used for component backgrounds, overlays, and surfaces
          throughout the site.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {backgroundColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Typography Colors
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Colors used for text content, ensuring proper contrast and readability
          across themes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {typographyColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Border Colors
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Colors used for component boundaries, providing visual separation and
          structure.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {borderColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Semantic Colors
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Colors that convey meaning and status information for user feedback
          and state communication.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {semanticColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          UI State Colors
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Colors that provide feedback for user interactions like hover, focus,
          and active states.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {uiStateColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Code Syntax Colors
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Colors used for code blocks and syntax highlighting in both light and
          dark themes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {codeColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          {t('analysisColors')}
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Colors optimized for data visualization, charts, and technical
          content.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataVisualizationColors.map(color => (
            <ColorSwatch
              key={color.name}
              color={color}
              showAccessibilityInfo={showAccessibilityInfo}
            />
          ))}
        </div>
      </div>

      {/* Color Combinations Section */}
      <div className="border-t border-secondary-200 dark:border-secondary-700 pt-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            Color Combinations
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 text-lg">
            See how colors work together in both light and dark themes across
            different UI components.
          </p>
        </div>

        {/* Text on Background Combinations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Text on Background
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            How text colors pair with background colors for optimal readability
            in both themes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorCombinations.textOnBackground.map((combination, index) => (
              <ColorCombination key={index} combination={combination} />
            ))}
          </div>
        </div>

        {/* Button State Combinations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Button States
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Color combinations for buttons and their interactive states.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorCombinations.buttonStates.map((combination, index) => (
              <ColorCombination key={index} combination={combination} />
            ))}
          </div>
        </div>

        {/* Card Element Combinations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Card Elements
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Color combinations used in card components and containers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorCombinations.cardElements.map((combination, index) => (
              <ColorCombination key={index} combination={combination} />
            ))}
          </div>
        </div>

        {/* Navigation Element Combinations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Navigation Elements
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Color combinations for navigation menus and interactive elements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorCombinations.navigationElements.map((combination, index) => (
              <ColorCombination key={index} combination={combination} />
            ))}
          </div>
        </div>

        {/* Alert Combinations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Alert & Notification Colors
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Semantic color combinations for alerts, notifications, and status
            indicators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorCombinations.alertCombinations.map((combination, index) => (
              <ColorCombination key={index} combination={combination} />
            ))}
          </div>
        </div>

        {/* Code Element Combinations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Code Elements
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Color combinations for code blocks, syntax highlighting, and
            technical content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorCombinations.codeElements.map((combination, index) => (
              <ColorCombination key={index} combination={combination} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorShowcase
