/**
 * Color system utilities that extract actual color values from Tailwind CSS v4
 * This ensures the ColorShowcase component stays in sync with the design system
 */

export interface ColorItem {
  name: string
  hex: string
  rgb: string
  usage?: string
}

/**
 * Convert hex color to RGB format
 */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex

  const r = Number.parseInt(result[1], 16)
  const g = Number.parseInt(result[2], 16)
  const b = Number.parseInt(result[3], 16)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Primary color palette - Accessible blue scale with enhanced contrast
 * Designed to meet WCAG AA standards and be distinguishable for color-blind users
 */
export const getPrimaryColors = (): ColorItem[] => {
  return [
    { name: 'primary-50', hex: '#f0f9ff', rgb: hexToRgb('#f0f9ff') },
    { name: 'primary-100', hex: '#e0f2fe', rgb: hexToRgb('#e0f2fe') },
    { name: 'primary-200', hex: '#bae6fd', rgb: hexToRgb('#bae6fd') },
    { name: 'primary-300', hex: '#7dd3fc', rgb: hexToRgb('#7dd3fc') },
    { name: 'primary-400', hex: '#38bdf8', rgb: hexToRgb('#38bdf8') },
    { name: 'primary-500', hex: '#0ea5e9', rgb: hexToRgb('#0ea5e9') },
    { name: 'primary-600', hex: '#0277bd', rgb: hexToRgb('#0277bd') },
    { name: 'primary-700', hex: '#0369a1', rgb: hexToRgb('#0369a1') },
    { name: 'primary-800', hex: '#075985', rgb: hexToRgb('#075985') },
    { name: 'primary-900', hex: '#0c4a6e', rgb: hexToRgb('#0c4a6e') },
  ]
}

/**
 * Secondary color palette - Enhanced gray scale with improved contrast ratios
 * Optimized for accessibility and color-blind user readability
 */
export const getSecondaryColors = (): ColorItem[] => {
  return [
    { name: 'secondary-50', hex: '#f9fafb', rgb: hexToRgb('#f9fafb') },
    { name: 'secondary-100', hex: '#f3f4f6', rgb: hexToRgb('#f3f4f6') },
    { name: 'secondary-200', hex: '#e5e7eb', rgb: hexToRgb('#e5e7eb') },
    { name: 'secondary-300', hex: '#d1d5db', rgb: hexToRgb('#d1d5db') },
    { name: 'secondary-400', hex: '#9ca3af', rgb: hexToRgb('#9ca3af') },
    { name: 'secondary-500', hex: '#6b7280', rgb: hexToRgb('#6b7280') },
    { name: 'secondary-600', hex: '#4b5563', rgb: hexToRgb('#4b5563') },
    { name: 'secondary-700', hex: '#374151', rgb: hexToRgb('#374151') },
    { name: 'secondary-800', hex: '#1f2937', rgb: hexToRgb('#1f2937') },
    { name: 'secondary-900', hex: '#111827', rgb: hexToRgb('#111827') },
    { name: 'secondary-950', hex: '#030712', rgb: hexToRgb('#030712') },
  ]
}

/**
 * Get accent/semantic colors used throughout the application
 */
export const getAccentColors = (): ColorItem[] => {
  return [
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
}

/**
 * Get data visualization colors used for diagrams, charts, and spreadsheet-style visualizations
 * These colors are optimized for data visualization and technical content
 */
export const getDataVisualizationColors = (): ColorItem[] => {
  return [
    {
      name: 'Visualization 1',
      hex: '#3b82f6',
      rgb: 'rgb(59, 130, 246)',
      usage: 'Primary data series, main categories',
    },
    {
      name: 'Visualization 2',
      hex: '#6366f1',
      rgb: 'rgb(99, 102, 241)',
      usage: 'Secondary data series, sub-categories',
    },
    {
      name: 'Visualization 3',
      hex: '#0ea5e9',
      rgb: 'rgb(14, 165, 233)',
      usage: 'Tertiary data series, supporting elements',
    },
    {
      name: 'Visualization 4',
      hex: '#06b6d4',
      rgb: 'rgb(6, 182, 212)',
      usage: 'Quaternary data series, additional metrics',
    },
    {
      name: 'Visualization 5',
      hex: '#ef4444',
      rgb: 'rgb(239, 68, 68)',
      usage: 'Error states, critical values',
    },
    {
      name: 'Visualization 6',
      hex: '#22c55e',
      rgb: 'rgb(34, 197, 94)',
      usage: 'Success states, positive values',
    },
    {
      name: 'Visualization 7',
      hex: '#a855f7',
      rgb: 'rgb(168, 85, 247)',
      usage: 'Special highlights, performance indicators',
    },
    {
      name: 'Visualization 8',
      hex: '#4b5563',
      rgb: 'rgb(75, 85, 99)',
      usage: 'Neutral values, background data',
    },
  ]
}

/**
 * Get all colors organized by category
 */
export const getAllColors = () => ({
  primary: getPrimaryColors(),
  secondary: getSecondaryColors(),
  accent: getAccentColors(),
  dataVisualization: getDataVisualizationColors(),
})

/**
 * Color accessibility utilities
 */

/**
 * Calculate relative luminance of a color
 * Based on WCAG guidelines: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
const getRelativeLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex).match(/\d+/g)
  if (!rgb) return 0

  const [r, g, b] = rgb.map(val => {
    const channel = Number.parseInt(val) / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio from 1 to 21 (higher is better contrast)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color combination meets WCAG contrast requirements
 */
export const meetsContrastRequirement = (
  color1: string,
  color2: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = getContrastRatio(color1, color2)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

/**
 * Simulate color vision deficiencies for accessibility testing
 */
export const simulateColorBlindness = (
  hex: string,
  type: 'protanopia' | 'deuteranopia' | 'tritanopia'
): string => {
  const rgb = hexToRgb(hex).match(/\d+/g)
  if (!rgb) return hex

  let [r, g, b] = rgb.map(val => Number.parseInt(val) / 255)

  // Simplified color blindness simulation matrices
  // These are approximations for demonstration purposes
  switch (type) {
    case 'protanopia': // Red-blind
      r = 0.567 * r + 0.433 * g
      g = 0.558 * r + 0.442 * g
      b = 0.242 * g + 0.758 * b
      break
    case 'deuteranopia': // Green-blind
      r = 0.625 * r + 0.375 * g
      g = 0.7 * r + 0.3 * g
      b = 0.3 * g + 0.7 * b
      break
    case 'tritanopia': // Blue-blind
      r = 0.95 * r + 0.05 * g
      g = 0.433 * g + 0.567 * b
      b = 0.475 * g + 0.525 * b
      break
  }

  // Convert back to hex
  const toHex = (val: number) =>
    Math.round(val * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Get accessibility information for a color palette
 */
export const getAccessibilityInfo = () => {
  const primary = getPrimaryColors()
  const secondary = getSecondaryColors()

  return {
    contrastTests: [
      {
        name: 'Primary 600 on White',
        foreground: primary[6].hex, // primary-600
        background: '#ffffff',
        ratio: getContrastRatio(primary[6].hex, '#ffffff'),
        passes: meetsContrastRequirement(primary[6].hex, '#ffffff'),
      },
      {
        name: 'Primary 600 on Secondary 50',
        foreground: primary[6].hex,
        background: secondary[0].hex,
        ratio: getContrastRatio(primary[6].hex, secondary[0].hex),
        passes: meetsContrastRequirement(primary[6].hex, secondary[0].hex),
      },
      {
        name: 'Secondary 900 on White',
        foreground: secondary[8].hex, // secondary-900
        background: '#ffffff',
        ratio: getContrastRatio(secondary[8].hex, '#ffffff'),
        passes: meetsContrastRequirement(secondary[8].hex, '#ffffff'),
      },
      {
        name: 'Secondary 600 on Secondary 50',
        foreground: secondary[6].hex, // secondary-600
        background: secondary[0].hex,
        ratio: getContrastRatio(secondary[6].hex, secondary[0].hex),
        passes: meetsContrastRequirement(secondary[6].hex, secondary[0].hex),
      },
    ],
    colorBlindSimulation: {
      primary600: {
        original: primary[6].hex,
        protanopia: simulateColorBlindness(primary[6].hex, 'protanopia'),
        deuteranopia: simulateColorBlindness(primary[6].hex, 'deuteranopia'),
        tritanopia: simulateColorBlindness(primary[6].hex, 'tritanopia'),
      },
      secondary600: {
        original: secondary[6].hex,
        protanopia: simulateColorBlindness(secondary[6].hex, 'protanopia'),
        deuteranopia: simulateColorBlindness(secondary[6].hex, 'deuteranopia'),
        tritanopia: simulateColorBlindness(secondary[6].hex, 'tritanopia'),
      },
    },
  }
}
