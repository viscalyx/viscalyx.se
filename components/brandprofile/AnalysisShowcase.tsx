'use client'

import { getDataVisualizationColors, type ColorItem } from '@/lib/colors'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Cloud,
  Database,
  GitBranch,
  PieChart,
  Settings,
  Shield,
  Terminal,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ColorSwatchProps {
  color: ColorItem
  className?: string
}

const ColorSwatch = ({ color, className = '' }: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false)
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
      setCopied(true)

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Reset the copied state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    } catch (err) {
      console.error('Failed to copy color: ', err)
    }
  }

  const getIcon = (colorName: string) => {
    switch (colorName.toLowerCase()) {
      case 'visualization 1':
        return BarChart3
      case 'visualization 2':
        return PieChart
      case 'visualization 3':
        return Cloud
      case 'visualization 4':
        return Database
      case 'visualization 5':
        return Shield
      case 'visualization 6':
        return Settings
      case 'visualization 7':
        return Terminal
      case 'visualization 8':
        return GitBranch
      default:
        return BarChart3
    }
  }

  const IconComponent = getIcon(color.name)

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
            className="w-full h-24 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: color.hex }}
          >
            <IconComponent className="w-8 h-8 text-white/80 drop-shadow-md" />
          </div>
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary-900 dark:bg-secondary-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          {copied ? 'Copied!' : 'Click to copy'}
        </div>
      )}

      {/* Copy confirmation */}
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <span className="text-white text-sm font-medium">Copied!</span>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          {color.name}
        </h4>
        <button
          type="button"
          onClick={() => handleCopy(color.hex)}
          className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer block"
          tabIndex={0}
        >
          {color.hex}
        </button>
        <button
          type="button"
          onClick={() => handleCopy(color.rgb)}
          className="text-sm text-secondary-500 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer block"
          tabIndex={0}
        >
          {color.rgb}
        </button>
        {color.usage && (
          <p className="text-sm text-secondary-600 dark:text-secondary-400 italic">
            {color.usage}
          </p>
        )}
      </div>
    </motion.div>
  )
}

const DataVisualizationShowcase = () => {
  const dataVisualizationColors = getDataVisualizationColors()

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          Analysis & Data Visualization Colors
        </h2>
        <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
          Specialized color palette designed for charts, diagrams, spreadsheets,
          and technical visualizations. These colors provide optimal contrast
          and clarity for data presentation while maintaining brand consistency.
        </p>
      </motion.div>

      {/* Color Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataVisualizationColors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ColorSwatch color={color} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Usage Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-8"
      >
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Usage Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Recommended Use Cases
            </h4>
            <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Technology skill visualizations and progress bars
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Infrastructure diagrams and system architecture
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Data dashboards and analytics displays
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Process flow charts and workflow diagrams
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Color Accessibility
            </h4>
            <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                All colors meet WCAG AA contrast standards
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Color-blind friendly palette tested
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Distinct hues for clear differentiation
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Works effectively in both light and dark themes
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Implementation Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-secondary-800 rounded-xl p-8 shadow-sm border border-secondary-200 dark:border-secondary-700"
      >
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          Implementation Example
        </h3>
        <div className="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-6 font-mono text-sm">
          <pre className="text-secondary-800 dark:text-secondary-200">
            {`import { getDataVisualizationColors } from '@/lib/colors'

const colors = getDataVisualizationColors()

// Usage in data visualization charts
const primaryColor = colors.find(c => c.name === 'Visualization 1')?.hex
<div style={{ backgroundColor: primaryColor }}>
  Primary Data Series
</div>

// Usage in dashboard components
const secondaryColor = colors.find(c => c.name === 'Visualization 2')?.hex
const errorColor = colors.find(c => c.name === 'Visualization 5')?.hex`}
          </pre>
        </div>
      </motion.div>
    </div>
  )
}

export default DataVisualizationShowcase
