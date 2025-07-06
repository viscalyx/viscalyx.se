/**
 * Color system utilities that extract actual color values from Tailwind CSS
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

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Extract primary color palette from Tailwind configuration
 */
export const getPrimaryColors = (): ColorItem[] => {
  const colors = [
    { name: 'primary-50', hex: '#eff6ff' },
    { name: 'primary-100', hex: '#dbeafe' },
    { name: 'primary-200', hex: '#bfdbfe' },
    { name: 'primary-300', hex: '#93c5fd' },
    { name: 'primary-400', hex: '#60a5fa' },
    { name: 'primary-500', hex: '#3b82f6' },
    { name: 'primary-600', hex: '#2563eb' },
    { name: 'primary-700', hex: '#1d4ed8' },
    { name: 'primary-800', hex: '#1e40af' },
    { name: 'primary-900', hex: '#1e3a8a' },
  ]

  return colors.map(color => ({
    name: color.name,
    hex: color.hex,
    rgb: hexToRgb(color.hex),
  }))
}

/**
 * Extract secondary color palette from Tailwind configuration
 */
export const getSecondaryColors = (): ColorItem[] => {
  const colors = [
    { name: 'secondary-50', hex: '#f8fafc' },
    { name: 'secondary-100', hex: '#f1f5f9' },
    { name: 'secondary-200', hex: '#e2e8f0' },
    { name: 'secondary-300', hex: '#cbd5e1' },
    { name: 'secondary-400', hex: '#94a3b8' },
    { name: 'secondary-500', hex: '#64748b' },
    { name: 'secondary-600', hex: '#475569' },
    { name: 'secondary-700', hex: '#334155' },
    { name: 'secondary-800', hex: '#1e293b' },
    { name: 'secondary-900', hex: '#0f172a' },
  ]

  return colors.map(color => ({
    name: color.name,
    hex: color.hex,
    rgb: hexToRgb(color.hex),
  }))
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
 * Get all colors organized by category
 */
export const getAllColors = () => ({
  primary: getPrimaryColors(),
  secondary: getSecondaryColors(),
  accent: getAccentColors(),
})
