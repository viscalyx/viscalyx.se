'use client'

import { motion } from 'framer-motion'
import {
  AlertCircle,
  Check,
  Circle,
  Download,
  Eye,
  Info,
  MousePointer,
  Palette,
  Sparkles,
  Square,
  Type,
  X,
} from 'lucide-react'
import { ReactNode, useState } from 'react'

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

interface ComponentDemoProps {
  title: string
  description: string
  children: ReactNode
}

const BrandShowcase = () => {
  const [activeTab, setActiveTab] = useState('colors')

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

  const fontSizes = [
    { name: 'text-xs', size: '0.75rem', pixels: '12px', usage: 'Small labels' },
    { name: 'text-sm', size: '0.875rem', pixels: '14px', usage: 'Small text' },
    { name: 'text-base', size: '1rem', pixels: '16px', usage: 'Body text' },
    { name: 'text-lg', size: '1.125rem', pixels: '18px', usage: 'Large body' },
    { name: 'text-xl', size: '1.25rem', pixels: '20px', usage: 'Large text' },
    {
      name: 'text-2xl',
      size: '1.5rem',
      pixels: '24px',
      usage: 'Small headings',
    },
    {
      name: 'text-3xl',
      size: '1.875rem',
      pixels: '30px',
      usage: 'Medium headings',
    },
    {
      name: 'text-4xl',
      size: '2.25rem',
      pixels: '36px',
      usage: 'Large headings',
    },
    { name: 'text-5xl', size: '3rem', pixels: '48px', usage: 'Hero headings' },
  ]

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'components', label: 'Components', icon: Square },
    { id: 'animations', label: 'Animations', icon: MousePointer },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
  ]

  const ColorSwatch = ({ color, className = '' }: ColorSwatchProps) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`group relative ${className}`}
    >
      <div
        className={`w-full h-20 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 ${
          color.name.includes('50') || color.name.includes('100')
            ? 'border-secondary-300 dark:border-secondary-600'
            : ''
        }`}
        style={{ backgroundColor: color.hex }}
      />
      <div className="mt-2 space-y-1">
        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
          {color.name}
        </p>
        <p className="text-xs text-secondary-600 dark:text-secondary-400">
          {color.hex}
        </p>
        <p className="text-xs text-secondary-500 dark:text-secondary-500">
          {color.rgb}
        </p>
        {color.usage && (
          <p className="text-xs text-secondary-600 dark:text-secondary-400 italic">
            {color.usage}
          </p>
        )}
      </div>
    </motion.div>
  )

  const ComponentDemo = ({
    title,
    description,
    children,
  }: ComponentDemoProps) => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          {title}
        </h4>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          {description}
        </p>
      </div>
      <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
        {children}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <div className="container-custom section-padding">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-gradient mb-4"
          >
            Viscalyx Brand Showcase
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto"
          >
            Visual style guide and component library for consistent brand
            experience
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-12"
        >
          {/* Colors */}
          {activeTab === 'colors' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                  Primary Colors (Blue Scale)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
                  {primaryColors.map(color => (
                    <ColorSwatch key={color.name} color={color} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                  Secondary Colors (Gray Scale)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
                  {secondaryColors.map(color => (
                    <ColorSwatch key={color.name} color={color} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                  Accent Colors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {accentColors.map(color => (
                    <ColorSwatch key={color.name} color={color} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Typography */}
          {activeTab === 'typography' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                  Font Sizes & Hierarchy
                </h2>
                <div className="space-y-6">
                  {fontSizes.map(font => (
                    <div
                      key={font.name}
                      className="flex items-center space-x-6"
                    >
                      <div className="w-20 text-sm text-secondary-600 dark:text-secondary-400">
                        {font.name}
                      </div>
                      <div className="w-16 text-sm text-secondary-600 dark:text-secondary-400">
                        {font.pixels}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`${font.name} text-secondary-900 dark:text-secondary-100`}
                        >
                          The quick brown fox jumps over the lazy dog
                        </div>
                      </div>
                      <div className="text-sm text-secondary-500 dark:text-secondary-500 italic">
                        {font.usage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                  Font Weights
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      weight: 'font-light',
                      name: 'Light (300)',
                      usage: 'Subtle text',
                    },
                    {
                      weight: 'font-normal',
                      name: 'Regular (400)',
                      usage: 'Body text',
                    },
                    {
                      weight: 'font-medium',
                      name: 'Medium (500)',
                      usage: 'Emphasized text',
                    },
                    {
                      weight: 'font-semibold',
                      name: 'Semibold (600)',
                      usage: 'Subheadings',
                    },
                    {
                      weight: 'font-bold',
                      name: 'Bold (700)',
                      usage: 'Headings',
                    },
                    {
                      weight: 'font-extrabold',
                      name: 'Extrabold (800)',
                      usage: 'Hero text',
                    },
                  ].map(weight => (
                    <div
                      key={weight.name}
                      className="flex items-center space-x-6"
                    >
                      <div className="w-32 text-sm text-secondary-600 dark:text-secondary-400">
                        {weight.name}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`${weight.weight} text-lg text-secondary-900 dark:text-secondary-100`}
                        >
                          Viscalyx - Modern Web Development
                        </div>
                      </div>
                      <div className="text-sm text-secondary-500 dark:text-secondary-500 italic">
                        {weight.usage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Components */}
          {activeTab === 'components' && (
            <div className="space-y-12">
              <ComponentDemo
                title="Buttons"
                description="Primary and secondary button styles with hover states"
              >
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary">Primary Button</button>
                  <button className="btn-secondary">Secondary Button</button>
                  <button className="btn-primary" disabled>
                    Disabled Button
                  </button>
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Cards"
                description="Standard card component with hover effects"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 card-hover">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      Card Title
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      This is a sample card component with hover effects and
                      proper spacing.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 card-hover">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      Another Card
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      Cards maintain consistent styling and responsive behavior.
                    </p>
                  </div>
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Alerts"
                description="Status indicators and notification styles"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-800 dark:text-green-300">
                      Success message
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-300">
                      Warning message
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-red-800 dark:text-red-300">
                      Error message
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-300">
                      Info message
                    </span>
                  </div>
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Forms"
                description="Input fields and form controls"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
                      rows={4}
                      placeholder="Your message here"
                    />
                  </div>
                </div>
              </ComponentDemo>
            </div>
          )}

          {/* Animations */}
          {activeTab === 'animations' && (
            <div className="space-y-12">
              <ComponentDemo
                title="Fade In Animation"
                description="Smooth opacity transition for content reveals"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center"
                >
                  <p className="text-primary-700 dark:text-primary-300">
                    This element fades in smoothly
                  </p>
                </motion.div>
              </ComponentDemo>

              <ComponentDemo
                title="Slide Up Animation"
                description="Content slides up with fade in effect"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="p-6 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-center"
                >
                  <p className="text-secondary-700 dark:text-secondary-300">
                    This element slides up from below
                  </p>
                </motion.div>
              </ComponentDemo>

              <ComponentDemo
                title="Hover Interactions"
                description="Interactive elements with hover states"
              >
                <div className="flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer"
                  >
                    <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">
                      Hover to scale
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer"
                  >
                    <Circle className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">
                      Hover to rotate
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer"
                  >
                    <Square className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">
                      Hover to lift
                    </p>
                  </motion.div>
                </div>
              </ComponentDemo>
            </div>
          )}

          {/* Accessibility */}
          {activeTab === 'accessibility' && (
            <div className="space-y-12">
              <ComponentDemo
                title="Focus States"
                description="Clear focus indicators for keyboard navigation"
              >
                <div className="space-y-4">
                  <button className="btn-primary focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800">
                    Focusable Button
                  </button>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
                    placeholder="Focus me with Tab"
                  />
                  <a
                    href="#"
                    className="inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                  >
                    Focusable Link
                  </a>
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Color Contrast"
                description="WCAG AA compliant color combinations"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
                      Good Contrast
                    </h4>
                    <div className="p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded">
                      <p className="text-secondary-900 dark:text-secondary-100">
                        This text has sufficient contrast ratio (4.5:1+)
                      </p>
                    </div>
                    <div className="p-3 bg-primary-600 rounded">
                      <p className="text-white">
                        White text on primary background
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
                      Screen Reader Support
                    </h4>
                    <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded">
                      <p className="text-secondary-700 dark:text-secondary-300">
                        All interactive elements include proper ARIA labels
                      </p>
                      <button
                        className="mt-2 btn-secondary"
                        aria-label="Download brand guidelines document"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </ComponentDemo>

              <ComponentDemo
                title="Semantic HTML"
                description="Proper heading hierarchy and semantic elements"
              >
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    Heading 1 (Main Title)
                  </h1>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                    Heading 2 (Section Title)
                  </h2>
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                    Heading 3 (Subsection)
                  </h3>
                  <p className="text-secondary-700 dark:text-secondary-300">
                    Regular paragraph text with proper hierarchy and semantic
                    structure.
                  </p>
                </div>
              </ComponentDemo>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default BrandShowcase
