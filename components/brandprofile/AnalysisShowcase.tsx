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
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import RechartsComparison from './RechartsComparison'

// Sample data for various chart types that use the visualization colors
const generateSampleData = (
  colors: ColorItem[],
  t: (key: string) => string
) => {
  const barChartData = [
    {
      label: t('sampleData.frontendSkills'),
      data: [
        { x: 'React', y: 95, color: colors[0]?.hex },
        { x: 'TypeScript', y: 90, color: colors[1]?.hex },
        { x: 'Next.js', y: 88, color: colors[2]?.hex },
        { x: 'Tailwind', y: 85, color: colors[3]?.hex },
        { x: 'Vue.js', y: 75, color: colors[4]?.hex },
      ],
    },
  ]

  const lineChartData = [
    {
      label: t('sampleData.projectPerformance'),
      color: colors[0]?.hex,
      data: [
        { x: 'Jan', y: 32 },
        { x: 'Feb', y: 48 },
        { x: 'Mar', y: 64 },
        { x: 'Apr', y: 52 },
        { x: 'May', y: 78 },
        { x: 'Jun', y: 85 },
      ],
    },
    {
      label: t('sampleData.clientSatisfaction'),
      color: colors[1]?.hex,
      data: [
        { x: 'Jan', y: 28 },
        { x: 'Feb', y: 42 },
        { x: 'Mar', y: 58 },
        { x: 'Apr', y: 68 },
        { x: 'May', y: 72 },
        { x: 'Jun', y: 82 },
      ],
    },
  ]

  const areaChartData = [
    {
      label: t('sampleData.revenueGrowth'),
      color: colors[5]?.hex,
      data: [
        { x: 'Q1', y: 25 },
        { x: 'Q2', y: 45 },
        { x: 'Q3', y: 65 },
        { x: 'Q4', y: 85 },
      ],
    },
    {
      label: t('sampleData.marketShare'),
      color: colors[6]?.hex,
      data: [
        { x: 'Q1', y: 15 },
        { x: 'Q2', y: 28 },
        { x: 'Q3', y: 42 },
        { x: 'Q4', y: 58 },
      ],
    },
  ]

  // Additional chart types for more comprehensive examples
  const pieChartData = [
    { name: 'React', value: 35, color: colors[0]?.hex },
    { name: 'TypeScript', value: 25, color: colors[1]?.hex },
    { name: 'Next.js', value: 20, color: colors[2]?.hex },
    { name: 'Vue.js', value: 15, color: colors[3]?.hex },
    { name: t('sampleData.other'), value: 5, color: colors[7]?.hex },
  ]

  const scatterData = [
    {
      label: 'Team A Performance',
      color: colors[0]?.hex,
      data: [
        { x: 25, y: 85 },
        { x: 35, y: 90 },
        { x: 45, y: 88 },
        { x: 55, y: 92 },
        { x: 65, y: 95 },
      ],
    },
    {
      label: 'Team B Performance',
      color: colors[1]?.hex,
      data: [
        { x: 30, y: 75 },
        { x: 40, y: 82 },
        { x: 50, y: 78 },
        { x: 60, y: 85 },
        { x: 70, y: 88 },
      ],
    },
  ]

  return {
    barChartData,
    lineChartData,
    areaChartData,
    pieChartData,
    scatterData,
  }
}

interface ColorSwatchProps {
  color: ColorItem
  className?: string
}

const ColorSwatch = ({ color, className = '' }: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const t = useTranslations('brandProfile.analysisShowcase')

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
          {copied ? t('colorSwatch.copied') : t('colorSwatch.clickToCopy')}
        </div>
      )}

      {/* Copy confirmation */}
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <span className="text-white text-sm font-medium">
            {t('colorSwatch.copied')}
          </span>
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

// Chart Components
interface DataPoint {
  x: string
  y: number
}

interface ChartComponentProps {
  title: string
  colors: ColorItem[]
  className?: string
}

// Simple Bar Chart using CSS/HTML to ensure colors are used
const SimpleBarChart = ({
  title,
  colors,
  className = '',
}: ChartComponentProps) => {
  const t = useTranslations('brandProfile.analysisShowcase')
  const { barChartData } = generateSampleData(colors, t)
  const data = barChartData[0].data
  const maxValue = Math.max(...data.map(d => d.y))

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title}
      </h4>
      <div className="h-64 flex items-end justify-between space-x-2 p-4">
        {data.map((item, index) => (
          <div
            key={item.x}
            className="flex-1 flex flex-col items-center space-y-2"
          >
            <div className="w-full flex flex-col items-center">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80 hover:scale-105 shadow-sm"
                style={{
                  backgroundColor: colors[index]?.hex,
                  height: `${Math.max((item.y / maxValue) * 180, 8)}px`,
                }}
              />
              <div
                className="text-white text-xs font-medium mt-1 px-2 py-1 rounded shadow-sm"
                style={{ backgroundColor: colors[index]?.hex }}
              >
                {item.y}%
              </div>
            </div>
            <div className="text-xs text-secondary-600 dark:text-secondary-400 text-center font-medium">
              {item.x}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple Line Chart using SVG
const SimpleLineChart = ({
  title,
  colors,
  className = '',
}: ChartComponentProps) => {
  const t = useTranslations('brandProfile.analysisShowcase')
  const { lineChartData } = generateSampleData(colors, t)
  const width = 320
  const height = 200
  const padding = 40

  const allData = lineChartData.flatMap(series => series.data)
  const maxY = Math.max(...allData.map(d => d.y))
  const minY = Math.min(...allData.map(d => d.y))

  const getPath = (data: DataPoint[]) => {
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
      const y =
        height -
        padding -
        ((point.y - minY) / (maxY - minY)) * (height - 2 * padding)
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title}
      </h4>
      <div className="h-64 flex flex-col items-center">
        <svg width={width} height={height} className="mb-4">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding)) / 4}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding)) / 4}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {lineChartData.map((series, index) => (
            <g key={series.label}>
              <path
                d={getPath(series.data)}
                fill="none"
                stroke={colors[index]?.hex}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              {series.data.map((point, pointIndex) => {
                const x =
                  padding +
                  (pointIndex / (series.data.length - 1)) *
                    (width - 2 * padding)
                const y =
                  height -
                  padding -
                  ((point.y - minY) / (maxY - minY)) * (height - 2 * padding)

                return (
                  <circle
                    key={pointIndex}
                    cx={x}
                    cy={y}
                    r="5"
                    fill={colors[index]?.hex}
                    stroke="white"
                    strokeWidth="2"
                    className="hover:r-6 transition-all duration-200 drop-shadow-sm"
                  />
                )
              })}
            </g>
          ))}

          {/* X-axis labels */}
          {lineChartData[0].data.map((point, index) => {
            const x =
              padding +
              (index / (lineChartData[0].data.length - 1)) *
                (width - 2 * padding)
            return (
              <text
                key={point.x}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-secondary-600 dark:fill-secondary-400"
              >
                {point.x}
              </text>
            )
          })}
        </svg>

        <div className="flex justify-center space-x-6">
          {lineChartData.map((series, index) => (
            <div key={series.label} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2 shadow-sm"
                style={{ backgroundColor: colors[index]?.hex }}
              />
              <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                {series.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simple Area Chart using SVG
const SimpleAreaChart = ({
  title,
  colors,
  className = '',
}: ChartComponentProps) => {
  const t = useTranslations('brandProfile.analysisShowcase')
  const { areaChartData } = generateSampleData(colors, t)
  const width = 320
  const height = 200
  const padding = 40

  const allData = areaChartData.flatMap(series => series.data)
  const maxY = Math.max(...allData.map(d => d.y))
  const minY = Math.min(...allData.map(d => d.y))

  const getAreaPath = (data: DataPoint[]) => {
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
      const y =
        height -
        padding -
        ((point.y - minY) / (maxY - minY)) * (height - 2 * padding)
      return { x, y }
    })

    let path = `M ${points[0].x},${points[0].y}`
    points.slice(1).forEach(point => {
      path += ` L ${point.x},${point.y}`
    })

    // Close the area to the bottom
    path += ` L ${points[points.length - 1].x},${height - padding}`
    path += ` L ${points[0].x},${height - padding} Z`

    return path
  }

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title}
      </h4>
      <div className="h-64 flex flex-col items-center">
        <svg width={width} height={height} className="mb-4">
          <defs>
            {areaChartData.map((series, index) => (
              <linearGradient
                key={index}
                id={`area-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={colors[index + 5]?.hex || colors[index]?.hex}
                  stopOpacity="0.6"
                />
                <stop
                  offset="100%"
                  stopColor={colors[index + 5]?.hex || colors[index]?.hex}
                  stopOpacity="0.1"
                />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding)) / 4}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding)) / 4}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {areaChartData.map((series, index) => (
            <g key={series.label}>
              <path
                d={getAreaPath(series.data)}
                fill={`url(#area-gradient-${index})`}
                stroke={colors[index + 5]?.hex || colors[index]?.hex}
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity"
              />
            </g>
          ))}

          {/* X-axis labels */}
          {areaChartData[0].data.map((point, index) => {
            const x =
              padding +
              (index / (areaChartData[0].data.length - 1)) *
                (width - 2 * padding)
            return (
              <text
                key={point.x}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-secondary-600 dark:fill-secondary-400"
              >
                {point.x}
              </text>
            )
          })}
        </svg>

        <div className="flex justify-center space-x-6">
          {areaChartData.map((series, index) => (
            <div key={series.label} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2 shadow-sm"
                style={{
                  backgroundColor: colors[index + 5]?.hex || colors[index]?.hex,
                }}
              />
              <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                {series.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simple Pie Chart using SVG to showcase colors
const PieChartExample = ({
  title,
  colors,
  className = '',
}: ChartComponentProps) => {
  const t = useTranslations('brandProfile.analysisShowcase')
  const { pieChartData } = generateSampleData(colors, t)

  let cumulativePercentage = 0
  const radius = 80
  const centerX = 100
  const centerY = 100

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title}
      </h4>
      <div className="flex items-center justify-between">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="flex-shrink-0"
        >
          {pieChartData.map(slice => {
            const percentage = slice.value
            const startAngle = (cumulativePercentage / 100) * 360
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360

            const startAngleRad = (startAngle - 90) * (Math.PI / 180)
            const endAngleRad = (endAngle - 90) * (Math.PI / 180)

            const x1 = centerX + radius * Math.cos(startAngleRad)
            const y1 = centerY + radius * Math.sin(startAngleRad)
            const x2 = centerX + radius * Math.cos(endAngleRad)
            const y2 = centerY + radius * Math.sin(endAngleRad)

            const largeArc = percentage > 50 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z',
            ].join(' ')

            cumulativePercentage += percentage

            return (
              <path
                key={slice.name}
                d={pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity"
              />
            )
          })}
        </svg>

        <div className="ml-6 space-y-2">
          {pieChartData.map(slice => (
            <div key={slice.name} className="flex items-center text-sm">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-secondary-600 dark:text-secondary-400">
                {slice.name}: {slice.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Metrics Display Component
const MetricsExample = ({
  title,
  colors,
  className = '',
}: ChartComponentProps) => {
  const t = useTranslations('brandProfile.analysisShowcase')
  const metrics = [
    {
      label: t('metrics.activeProjects'),
      value: '24',
      trend: '+12%',
      color: colors[5]?.hex,
    },
    {
      label: t('metrics.successRate'),
      value: '98%',
      trend: '+3%',
      color: colors[0]?.hex,
    },
    {
      label: t('metrics.clientSatisfaction'),
      value: '4.9',
      trend: '+0.2',
      color: colors[1]?.hex,
    },
    {
      label: t('metrics.responseTime'),
      value: '1.2s',
      trend: '-15%',
      color: colors[4]?.hex,
    },
  ]

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="text-center">
            <div
              className="w-full h-2 rounded-full mb-2"
              style={{ backgroundColor: metric.color + '20' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: metric.color,
                  width: `${75 + index * 5}%`,
                }}
              />
            </div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: metric.color }}
            >
              {metric.value}
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              {metric.label}
            </div>
            <div className="text-xs text-green-500 font-medium">
              {metric.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DataVisualizationShowcase = () => {
  const dataVisualizationColors = getDataVisualizationColors()
  const t = useTranslations('brandProfile.analysisShowcase')

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
          {t('title')}
        </h2>
        <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
          {t('description')}
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
          {t('usageGuidelines.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              {t('usageGuidelines.recommendedUseCases.title')}
            </h4>
            <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.recommendedUseCases.items.0')}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.recommendedUseCases.items.1')}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.recommendedUseCases.items.2')}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.recommendedUseCases.items.3')}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              {t('usageGuidelines.colorAccessibility.title')}
            </h4>
            <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.colorAccessibility.items.0')}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.colorAccessibility.items.1')}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.colorAccessibility.items.2')}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {t('usageGuidelines.colorAccessibility.items.3')}
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
          {t('implementationExample.title')}
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

      {/* Chart Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-8 text-center">
          {t('chartExamples.title')}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleBarChart
            title={t('chartExamples.skillsAssessment')}
            colors={dataVisualizationColors}
          />
          <SimpleLineChart
            title={t('chartExamples.performanceTrends')}
            colors={dataVisualizationColors}
          />
          <SimpleAreaChart
            title={t('chartExamples.growthMetrics')}
            colors={dataVisualizationColors}
          />
          <PieChartExample
            title={t('chartExamples.technologyStack')}
            colors={dataVisualizationColors}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MetricsExample
            title={t('chartExamples.keyPerformanceIndicators')}
            colors={dataVisualizationColors}
          />
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              {t('chartExamples.colorPaletteReference')}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {dataVisualizationColors.slice(0, 8).map((color, index) => (
                <div key={color.name} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                      {t('chartExamples.colorLabel', { index: index + 1 })}
                    </div>
                    <div className="text-xs text-secondary-600 dark:text-secondary-400">
                      {color.hex}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recharts Comparison Section */}
      <RechartsComparison />
    </div>
  )
}

export default DataVisualizationShowcase
