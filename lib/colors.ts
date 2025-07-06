/**
 * Color system utilities that extract actual color values from Tailwind CSS
 * This ensures the ColorShowcase component stays in sync with the design system
 */

import resolveConfig from 'tailwindcss/resolveConfig.js'
import tailwindConfig from '../tailwind.config.js'

export interface ColorItem {
  name: string
  hex: string
  rgb: string
  usage?: string
}

// Resolve the full Tailwind configuration
const fullConfig = resolveConfig(tailwindConfig)

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
 * Helper function to extract color palette from Tailwind config
 */
const extractColorPalette = (
  colorKey: string,
  fallbackColor: string
): ColorItem[] => {
  const colors = fullConfig.theme?.colors as unknown as Record<string, unknown>
  const colorPalette = colors?.[colorKey] as Record<string, string>

  if (!colorPalette || typeof colorPalette !== 'object') {
    // Fallback to default color if config is not available
    console.warn(
      `${colorKey} colors not found in Tailwind config, using fallback colors`
    )
    return [
      {
        name: `${colorKey}-500`,
        hex: fallbackColor,
        rgb: hexToRgb(fallbackColor),
      },
    ]
  }

  return Object.entries(colorPalette).map(([key, hex]) => ({
    name: `${colorKey}-${key}`,
    hex,
    rgb: hexToRgb(hex),
  }))
}

/**
 * Extract primary color palette from Tailwind configuration
 */
export const getPrimaryColors = (): ColorItem[] => {
  return extractColorPalette('primary', '#3b82f6')
}

/**
 * Extract secondary color palette from Tailwind configuration
 */
export const getSecondaryColors = (): ColorItem[] => {
  return extractColorPalette('secondary', '#64748b')
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
