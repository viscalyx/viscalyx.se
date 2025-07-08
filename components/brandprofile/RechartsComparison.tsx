'use client'

import { getDataVisualizationColors, type ColorItem } from '@/lib/colors'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Sample data optimized for recharts
const generateRechartsData = (colors: ColorItem[]) => {
  const barChartData = [
    { name: 'React', value: 95, color: colors[0]?.hex },
    { name: 'TypeScript', value: 90, color: colors[1]?.hex },
    { name: 'Next.js', value: 88, color: colors[2]?.hex },
    { name: 'Tailwind', value: 85, color: colors[3]?.hex },
    { name: 'Vue.js', value: 75, color: colors[4]?.hex },
  ]

  const lineChartData = [
    { month: 'Jan', performance: 32, satisfaction: 28 },
    { month: 'Feb', performance: 48, satisfaction: 42 },
    { month: 'Mar', performance: 64, satisfaction: 58 },
    { month: 'Apr', performance: 52, satisfaction: 68 },
    { month: 'May', performance: 78, satisfaction: 72 },
    { month: 'Jun', performance: 85, satisfaction: 82 },
  ]

  const areaChartData = [
    { quarter: 'Q1', revenue: 25, market: 15 },
    { quarter: 'Q2', revenue: 45, market: 28 },
    { quarter: 'Q3', revenue: 65, market: 42 },
    { quarter: 'Q4', revenue: 85, market: 58 },
  ]

  const pieChartData = [
    { name: 'React', value: 35, color: colors[0]?.hex },
    { name: 'TypeScript', value: 25, color: colors[1]?.hex },
    { name: 'Next.js', value: 20, color: colors[2]?.hex },
    { name: 'Vue.js', value: 15, color: colors[3]?.hex },
    { name: 'Other', value: 5, color: colors[7]?.hex },
  ]

  return {
    barChartData,
    lineChartData,
    areaChartData,
    pieChartData,
  }
}

interface RechartsChartProps {
  title: string
  colors: ColorItem[]
  className?: string
}

// Recharts Bar Chart Implementation
const RechartsBarChart = ({
  title,
  colors,
  className = '',
}: RechartsChartProps) => {
  const { barChartData } = generateRechartsData(colors)

  // Custom bar shape to use individual colors (Note: recharts handles individual colors automatically via data)

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title} (Recharts)
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.3}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-secondary-600 dark:text-secondary-400"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-secondary-600 dark:text-secondary-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {barChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Recharts Line Chart Implementation
const RechartsLineChart = ({
  title,
  colors,
  className = '',
}: RechartsChartProps) => {
  const { lineChartData } = generateRechartsData(colors)

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title} (Recharts)
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              className="text-secondary-600 dark:text-secondary-400"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-secondary-600 dark:text-secondary-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="performance"
              stroke={colors[0]?.hex}
              strokeWidth={3}
              dot={{ fill: colors[0]?.hex, strokeWidth: 2, r: 5 }}
              name="Performance"
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke={colors[1]?.hex}
              strokeWidth={3}
              dot={{ fill: colors[1]?.hex, strokeWidth: 2, r: 5 }}
              name="Satisfaction"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Recharts Area Chart Implementation
const RechartsAreaChart = ({
  title,
  colors,
  className = '',
}: RechartsChartProps) => {
  const { areaChartData } = generateRechartsData(colors)

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title} (Recharts)
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={areaChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors[5]?.hex}
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor={colors[5]?.hex}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors[6]?.hex}
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor={colors[6]?.hex}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.3}
            />
            <XAxis
              dataKey="quarter"
              tick={{ fontSize: 12 }}
              className="text-secondary-600 dark:text-secondary-400"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-secondary-600 dark:text-secondary-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={colors[5]?.hex}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue Growth"
            />
            <Area
              type="monotone"
              dataKey="market"
              stroke={colors[6]?.hex}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMarket)"
              name="Market Share"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Recharts Pie Chart Implementation
const RechartsPieChart = ({
  title,
  colors,
  className = '',
}: RechartsChartProps) => {
  const { pieChartData } = generateRechartsData(colors)

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx?: number
    cy?: number
    midAngle?: number
    innerRadius?: number
    outerRadius?: number
    percent?: number
  }) => {
    if (
      !cx ||
      !cy ||
      midAngle === undefined ||
      !innerRadius ||
      !outerRadius ||
      !percent
    ) {
      return null
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title} (Recharts)
      </h4>
      <div className="h-64 flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Main Comparison Component
interface RechartsComparisonProps {
  className?: string
}

const RechartsComparison = ({ className = '' }: RechartsComparisonProps) => {
  const t = useTranslations('brandProfile.analysisShowcase.rechartsComparison')
  const dataVisualizationColors = getDataVisualizationColors()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-8 ${className}`}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Bar Chart Comparison */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
          Bar Chart Comparison
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RechartsBarChart
            title="Skills Assessment"
            colors={dataVisualizationColors}
          />
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Custom SVG Implementation
            </h4>
            <div className="text-sm text-secondary-600 dark:text-secondary-400 space-y-2">
              <p>✅ Full control over styling and animations</p>
              <p>✅ Exact color palette usage</p>
              <p>✅ No external dependencies</p>
              <p>✅ Custom interactions and hover effects</p>
              <p>❌ More development time required</p>
              <p>❌ Need to handle responsive design manually</p>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart Comparison */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
          Line Chart Comparison
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RechartsLineChart
            title="Performance Trends"
            colors={dataVisualizationColors}
          />
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Recharts Benefits
            </h4>
            <div className="text-sm text-secondary-600 dark:text-secondary-400 space-y-2">
              <p>✅ Built-in responsive behavior</p>
              <p>✅ Rich tooltip and legend support</p>
              <p>✅ Smooth animations out of the box</p>
              <p>✅ Accessibility features included</p>
              <p>✅ Faster development time</p>
              <p>❌ Additional bundle size (~160KB)</p>
              <p>❌ Less granular control over styling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Area Chart Comparison */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
          Area Chart Comparison
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RechartsAreaChart
            title="Growth Metrics"
            colors={dataVisualizationColors}
          />
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Color Consistency
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {dataVisualizationColors.slice(5, 7).map(color => (
                <div key={color.name} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                      {color.name}
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
      </div>

      {/* Pie Chart Comparison */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
          Pie Chart Comparison
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RechartsPieChart
            title="Technology Stack"
            colors={dataVisualizationColors}
          />
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Implementation Recommendation
            </h4>
            <div className="text-sm text-secondary-600 dark:text-secondary-400 space-y-3">
              <div>
                <p className="font-medium text-secondary-800 dark:text-secondary-200 mb-1">
                  Use Recharts when:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Rapid prototyping is needed</li>
                  <li>Standard chart types are sufficient</li>
                  <li>Built-in interactions are adequate</li>
                  <li>Team has limited SVG experience</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-secondary-800 dark:text-secondary-200 mb-1">
                  Use Custom SVG when:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Unique design requirements</li>
                  <li>Custom animations needed</li>
                  <li>Bundle size is critical</li>
                  <li>Full control over accessibility</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-8"
      >
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
          Performance & Bundle Size Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              ~160KB
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Recharts Bundle Size
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              ~0KB
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Custom SVG Overhead
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
              100%
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Color Palette Accuracy
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RechartsComparison
