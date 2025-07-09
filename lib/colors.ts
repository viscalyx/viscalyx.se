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
 * Get background colors used throughout the site
 * These colors are used for component backgrounds, overlays, and surfaces
 */
export const getBackgroundColors = (): ColorItem[] => {
  return [
    {
      name: 'White',
      hex: '#ffffff',
      rgb: 'rgb(255, 255, 255)',
      usage: 'Primary background, cards, modals',
    },
    {
      name: 'Primary 50',
      hex: '#f0f9ff',
      rgb: 'rgb(240, 249, 255)',
      usage: 'Light primary backgrounds, hover states',
    },
    {
      name: 'Primary 100',
      hex: '#e0f2fe',
      rgb: 'rgb(224, 242, 254)',
      usage: 'Primary accent backgrounds',
    },
    {
      name: 'Primary 600',
      hex: '#0277bd',
      rgb: 'rgb(2, 119, 189)',
      usage: 'Primary button backgrounds, call-to-action elements',
    },
    {
      name: 'Primary 900/20',
      hex: '#0c4a6e',
      rgb: 'rgb(12, 74, 110)',
      usage: 'Dark theme primary backgrounds with 20% opacity',
    },
    {
      name: 'Secondary 50',
      hex: '#f9fafb',
      rgb: 'rgb(249, 250, 251)',
      usage: 'Light neutral backgrounds, subtle sections',
    },
    {
      name: 'Secondary 100',
      hex: '#f3f4f6',
      rgb: 'rgb(243, 244, 246)',
      usage: 'Code block backgrounds, light containers',
    },
    {
      name: 'Secondary 800',
      hex: '#1f2937',
      rgb: 'rgb(31, 41, 55)',
      usage: 'Dark theme backgrounds, cards, modals',
    },
    {
      name: 'Secondary 900',
      hex: '#111827',
      rgb: 'rgb(17, 24, 39)',
      usage: 'Dark theme primary background',
    },
    {
      name: 'Gradient Primary',
      hex: '#0277bd',
      rgb: 'rgb(2, 119, 189)',
      usage: 'Gradient backgrounds (primary-600 to primary-800)',
    },
    {
      name: 'Gradient Secondary',
      hex: '#374151',
      rgb: 'rgb(55, 65, 81)',
      usage: 'Gradient backgrounds (secondary-600 to secondary-800)',
    },
  ]
}

/**
 * Get typography colors used for text content
 * These colors ensure proper contrast and readability
 */
export const getTypographyColors = (): ColorItem[] => {
  return [
    {
      name: 'Primary Content',
      hex: '#111827',
      rgb: 'rgb(17, 24, 39)',
      usage: 'Primary text, headings (secondary-900)',
    },
    {
      name: 'Primary Content Dark',
      hex: '#f9fafb',
      rgb: 'rgb(249, 250, 251)',
      usage: 'Primary text in dark mode (secondary-50)',
    },
    {
      name: 'Secondary Content',
      hex: '#4b5563',
      rgb: 'rgb(75, 85, 99)',
      usage: 'Body text, descriptions (secondary-600)',
    },
    {
      name: 'Secondary Content Dark',
      hex: '#9ca3af',
      rgb: 'rgb(156, 163, 175)',
      usage: 'Body text in dark mode (secondary-400)',
    },
    {
      name: 'Tertiary Content',
      hex: '#374151',
      rgb: 'rgb(55, 65, 81)',
      usage: 'Strong body text, emphasized content (secondary-700)',
    },
    {
      name: 'Tertiary Content Dark',
      hex: '#d1d5db',
      rgb: 'rgb(209, 213, 219)',
      usage: 'Strong text in dark mode (secondary-300)',
    },
    {
      name: 'Muted Content',
      hex: '#6b7280',
      rgb: 'rgb(107, 114, 128)',
      usage: 'Labels, captions, subtle text (secondary-500)',
    },
    {
      name: 'Brand Primary',
      hex: '#0277bd',
      rgb: 'rgb(2, 119, 189)',
      usage: 'Brand text, primary links (primary-600)',
    },
    {
      name: 'Brand Primary Dark',
      hex: '#38bdf8',
      rgb: 'rgb(56, 189, 248)',
      usage: 'Brand text in dark mode (primary-400)',
    },
    {
      name: 'Link Hover',
      hex: '#0369a1',
      rgb: 'rgb(3, 105, 161)',
      usage: 'Link hover states (primary-700)',
    },
    {
      name: 'Link Hover Dark',
      hex: '#7dd3fc',
      rgb: 'rgb(125, 211, 252)',
      usage: 'Link hover in dark mode (primary-300)',
    },
  ]
}

/**
 * Get border colors used for component boundaries
 * These colors provide visual separation and structure
 */
export const getBorderColors = (): ColorItem[] => {
  return [
    {
      name: 'Default Border',
      hex: '#e5e7eb',
      rgb: 'rgb(229, 231, 235)',
      usage: 'Default border color (secondary-200)',
    },
    {
      name: 'Default Border Dark',
      hex: '#374151',
      rgb: 'rgb(55, 65, 81)',
      usage: 'Default border in dark mode (secondary-700)',
    },
    {
      name: 'Subtle Border',
      hex: '#f3f4f6',
      rgb: 'rgb(243, 244, 246)',
      usage: 'Subtle borders, light separation (secondary-100)',
    },
    {
      name: 'Subtle Border Dark',
      hex: '#4b5563',
      rgb: 'rgb(75, 85, 99)',
      usage: 'Subtle borders in dark mode (secondary-600)',
    },
    {
      name: 'Primary Border',
      hex: '#0277bd',
      rgb: 'rgb(2, 119, 189)',
      usage: 'Primary colored borders (primary-600)',
    },
    {
      name: 'Primary Border Dark',
      hex: '#38bdf8',
      rgb: 'rgb(56, 189, 248)',
      usage: 'Primary borders in dark mode (primary-400)',
    },
    {
      name: 'Focus Border',
      hex: '#0ea5e9',
      rgb: 'rgb(14, 165, 233)',
      usage: 'Focus ring borders (primary-500)',
    },
    {
      name: 'Accent Border Left',
      hex: '#7dd3fc',
      rgb: 'rgb(125, 211, 252)',
      usage: 'Left accent borders, blockquotes (primary-300)',
    },
    {
      name: 'Accent Border Left Dark',
      hex: '#0277bd',
      rgb: 'rgb(2, 119, 189)',
      usage: 'Left accent borders in dark mode (primary-600)',
    },
  ]
}

/**
 * Get semantic colors for states and feedback
 * These colors convey meaning and status information
 */
export const getSemanticColors = (): ColorItem[] => {
  return [
    {
      name: 'Success',
      hex: '#16a34a',
      rgb: 'rgb(22, 163, 74)',
      usage: 'Success messages, positive states (green-600)',
    },
    {
      name: 'Success Dark',
      hex: '#4ade80',
      rgb: 'rgb(74, 222, 128)',
      usage: 'Success in dark mode (green-400)',
    },
    {
      name: 'Success Background',
      hex: '#059669',
      rgb: 'rgb(5, 150, 105)',
      usage: 'Success background elements (green-600)',
    },
    {
      name: 'Warning',
      hex: '#f59e0b',
      rgb: 'rgb(245, 158, 11)',
      usage: 'Warning messages, caution states (amber-500)',
    },
    {
      name: 'Warning Alternative',
      hex: '#ca8a04',
      rgb: 'rgb(202, 138, 4)',
      usage: 'Alternative warning color (yellow-600)',
    },
    {
      name: 'Error',
      hex: '#ef4444',
      rgb: 'rgb(239, 68, 68)',
      usage: 'Error messages, destructive actions (red-500)',
    },
    {
      name: 'Error Alternative',
      hex: '#dc2626',
      rgb: 'rgb(220, 38, 38)',
      usage: 'Alternative error color (red-600)',
    },
    {
      name: 'Info',
      hex: '#3b82f6',
      rgb: 'rgb(59, 130, 246)',
      usage: 'Info messages, neutral feedback (blue-500)',
    },
    {
      name: 'Info Alternative',
      hex: '#1d4ed8',
      rgb: 'rgb(29, 78, 216)',
      usage: 'Alternative info color (blue-700)',
    },
    {
      name: 'Important',
      hex: '#7c3aed',
      rgb: 'rgb(124, 58, 237)',
      usage: 'Important messages, emphasis (violet-600)',
    },
    {
      name: 'Gold Accent',
      hex: '#facc15',
      rgb: 'rgb(250, 204, 21)',
      usage: 'Gold highlights, star ratings (yellow-400)',
    },
  ]
}

/**
 * Get UI state colors for interactive elements
 * These colors provide feedback for user interactions
 */
export const getUIStateColors = (): ColorItem[] => {
  return [
    {
      name: 'Hover Background',
      hex: '#f0f9ff',
      rgb: 'rgb(240, 249, 255)',
      usage: 'Hover backgrounds, interactive states (primary-50)',
    },
    {
      name: 'Hover Background Dark',
      hex: '#0c4a6e',
      rgb: 'rgb(12, 74, 110)',
      usage: 'Hover backgrounds in dark mode (primary-900/20)',
    },
    {
      name: 'Active Background',
      hex: '#e0f2fe',
      rgb: 'rgb(224, 242, 254)',
      usage: 'Active/selected backgrounds (primary-100)',
    },
    {
      name: 'Active Background Dark',
      hex: '#0c4a6e',
      rgb: 'rgb(12, 74, 110)',
      usage: 'Active backgrounds in dark mode (primary-900/30)',
    },
    {
      name: 'Focus Ring',
      hex: '#0ea5e9',
      rgb: 'rgb(14, 165, 233)',
      usage: 'Focus ring color (primary-500)',
    },
    {
      name: 'Focus Ring Dark',
      hex: '#075985',
      rgb: 'rgb(7, 89, 133)',
      usage: 'Focus ring in dark mode (primary-800)',
    },
    {
      name: 'Disabled Background',
      hex: '#f3f4f6',
      rgb: 'rgb(243, 244, 246)',
      usage: 'Disabled element backgrounds (secondary-100)',
    },
    {
      name: 'Disabled Text',
      hex: '#9ca3af',
      rgb: 'rgb(156, 163, 175)',
      usage: 'Disabled text color (secondary-400)',
    },
    {
      name: 'Selection Background',
      hex: '#bae6fd',
      rgb: 'rgb(186, 230, 253)',
      usage: 'Text selection, highlighted content (primary-200)',
    },
    {
      name: 'Shadow Color',
      hex: '#1f2937',
      rgb: 'rgb(31, 41, 55)',
      usage: 'Shadow color with opacity (secondary-800)',
    },
  ]
}

/**
 * Get code syntax highlighting colors
 * These colors are used for code blocks and syntax highlighting
 */
export const getCodeColors = (): ColorItem[] => {
  return [
    {
      name: 'Comment',
      hex: '#6b7280',
      rgb: 'rgb(107, 114, 128)',
      usage: 'Code comments (gray-500)',
    },
    {
      name: 'Comment Dark',
      hex: '#9ca3af',
      rgb: 'rgb(156, 163, 175)',
      usage: 'Code comments in dark mode (gray-400)',
    },
    {
      name: 'Keyword',
      hex: '#2563eb',
      rgb: 'rgb(37, 99, 235)',
      usage: 'Keywords, reserved words (blue-600)',
    },
    {
      name: 'Keyword Dark',
      hex: '#60a5fa',
      rgb: 'rgb(96, 165, 250)',
      usage: 'Keywords in dark mode (blue-400)',
    },
    {
      name: 'String',
      hex: '#059669',
      rgb: 'rgb(5, 150, 105)',
      usage: 'String literals (green-600)',
    },
    {
      name: 'String Dark',
      hex: '#34d399',
      rgb: 'rgb(52, 211, 153)',
      usage: 'String literals in dark mode (green-400)',
    },
    {
      name: 'Function',
      hex: '#7c3aed',
      rgb: 'rgb(124, 58, 237)',
      usage: 'Function names (violet-600)',
    },
    {
      name: 'Function Dark',
      hex: '#a78bfa',
      rgb: 'rgb(167, 139, 250)',
      usage: 'Function names in dark mode (violet-400)',
    },
    {
      name: 'Variable',
      hex: '#ea580c',
      rgb: 'rgb(234, 88, 12)',
      usage: 'Variables (orange-600)',
    },
    {
      name: 'Variable Dark',
      hex: '#fb923c',
      rgb: 'rgb(251, 146, 60)',
      usage: 'Variables in dark mode (orange-400)',
    },
    {
      name: 'Operator',
      hex: '#d97706',
      rgb: 'rgb(217, 119, 6)',
      usage: 'Operators (amber-600)',
    },
    {
      name: 'Operator Dark',
      hex: '#fbbf24',
      rgb: 'rgb(251, 191, 36)',
      usage: 'Operators in dark mode (amber-400)',
    },
    {
      name: 'Property',
      hex: '#dc2626',
      rgb: 'rgb(220, 38, 38)',
      usage: 'Properties, attributes (red-600)',
    },
    {
      name: 'Property Dark',
      hex: '#f87171',
      rgb: 'rgb(248, 113, 113)',
      usage: 'Properties in dark mode (red-400)',
    },
    {
      name: 'Code Background',
      hex: '#f3f4f6',
      rgb: 'rgb(243, 244, 246)',
      usage: 'Inline code backgrounds (secondary-100)',
    },
    {
      name: 'Code Background Dark',
      hex: '#1f2937',
      rgb: 'rgb(31, 41, 55)',
      usage: 'Inline code backgrounds in dark mode (secondary-800)',
    },
    {
      name: 'Highlight Line',
      hex: '#3b82f6',
      rgb: 'rgb(59, 130, 246)',
      usage: 'Line highlighting with 10% opacity (blue-500)',
    },
    {
      name: 'Highlight Line Dark',
      hex: '#60a5fa',
      rgb: 'rgb(96, 165, 250)',
      usage: 'Line highlighting in dark mode with 10% opacity (blue-400)',
    },
  ]
}

/**
 * Get all colors organized by category
 */
export const getAllColors = () => ({
  primary: getPrimaryColors(),
  secondary: getSecondaryColors(),
  dataVisualization: getDataVisualizationColors(),
  backgrounds: getBackgroundColors(),
  typography: getTypographyColors(),
  borders: getBorderColors(),
  semantic: getSemanticColors(),
  uiStates: getUIStateColors(),
  code: getCodeColors(),
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

/**
 * Get color combinations used together in light and dark themes
 * These show how colors pair together in actual UI components
 */
export const getColorCombinations = () => {
  return {
    textOnBackground: [
      {
        name: 'Primary Text on White',
        lightBackground: '#ffffff',
        lightText: '#111827',
        darkBackground: '#111827',
        darkText: '#f9fafb',
        usage: 'Main content text, headings',
        component: 'Headers, paragraphs, body text',
      },
      {
        name: 'Secondary Text on Light Background',
        lightBackground: '#f9fafb',
        lightText: '#4b5563',
        darkBackground: '#1f2937',
        darkText: '#9ca3af',
        usage: 'Secondary content, descriptions',
        component: 'Card descriptions, meta information',
      },
      {
        name: 'Primary Brand on Light Background',
        lightBackground: '#f0f9ff',
        lightText: '#0277bd',
        darkBackground: '#0c4a6e',
        darkText: '#38bdf8',
        usage: 'Brand elements, call-to-action text',
        component: 'Links, buttons, brand highlights',
      },
      {
        name: 'Muted Text on Background',
        lightBackground: '#ffffff',
        lightText: '#6b7280',
        darkBackground: '#111827',
        darkText: '#6b7280',
        usage: 'Labels, captions, subtle information',
        component: 'Form labels, timestamps, metadata',
      },
    ],
    buttonStates: [
      {
        name: 'Primary Button',
        lightBackground: '#0277bd',
        lightText: '#ffffff',
        darkBackground: '#0ea5e9',
        darkText: '#ffffff',
        usage: 'Primary call-to-action buttons',
        component: 'Submit buttons, primary actions',
      },
      {
        name: 'Primary Button Hover',
        lightBackground: '#0369a1',
        lightText: '#ffffff',
        darkBackground: '#0277bd',
        darkText: '#ffffff',
        usage: 'Primary button hover state',
        component: 'Button hover feedback',
      },
      {
        name: 'Secondary Button',
        lightBackground: '#ffffff',
        lightText: '#4b5563',
        darkBackground: '#1f2937',
        darkText: '#f9fafb',
        usage: 'Secondary actions, cancel buttons',
        component: 'Cancel buttons, secondary actions',
      },
      {
        name: 'Secondary Button Hover',
        lightBackground: '#f9fafb',
        lightText: '#111827',
        darkBackground: '#374151',
        darkText: '#f9fafb',
        usage: 'Secondary button hover state',
        component: 'Secondary button hover feedback',
      },
    ],
    cardElements: [
      {
        name: 'Card Background',
        lightBackground: '#ffffff',
        lightText: '#111827',
        darkBackground: '#1f2937',
        darkText: '#f9fafb',
        usage: 'Main card container',
        component: 'Service cards, testimonials, content cards',
      },
      {
        name: 'Card Border',
        lightBackground: '#ffffff',
        lightText: '#e5e7eb',
        darkBackground: '#1f2937',
        darkText: '#374151',
        usage: 'Card borders and separators',
        component: 'Card outlines, dividers',
      },
      {
        name: 'Card Hover State',
        lightBackground: '#f0f9ff',
        lightText: '#0277bd',
        darkBackground: '#0c4a6e',
        darkText: '#38bdf8',
        usage: 'Card hover effects',
        component: 'Interactive card highlights',
      },
    ],
    navigationElements: [
      {
        name: 'Navigation Text',
        lightBackground: '#ffffff',
        lightText: '#374151',
        darkBackground: '#111827',
        darkText: '#d1d5db',
        usage: 'Navigation menu items',
        component: 'Header navigation, menu items',
      },
      {
        name: 'Navigation Hover',
        lightBackground: '#f0f9ff',
        lightText: '#0277bd',
        darkBackground: '#0c4a6e',
        darkText: '#38bdf8',
        usage: 'Navigation item hover state',
        component: 'Menu item hover effects',
      },
      {
        name: 'Navigation Active',
        lightBackground: '#e0f2fe',
        lightText: '#0277bd',
        darkBackground: '#0c4a6e',
        darkText: '#38bdf8',
        usage: 'Active navigation item',
        component: 'Current page indicator',
      },
    ],
    alertCombinations: [
      {
        name: 'Success Alert',
        lightBackground: '#059669',
        lightText: '#ffffff',
        darkBackground: '#059669',
        darkText: '#ffffff',
        usage: 'Success messages and confirmations',
        component: 'Success notifications, completed states',
      },
      {
        name: 'Warning Alert',
        lightBackground: '#f59e0b',
        lightText: '#ffffff',
        darkBackground: '#f59e0b',
        darkText: '#ffffff',
        usage: 'Warning messages and cautions',
        component: 'Warning notifications, caution states',
      },
      {
        name: 'Error Alert',
        lightBackground: '#ef4444',
        lightText: '#ffffff',
        darkBackground: '#ef4444',
        darkText: '#ffffff',
        usage: 'Error messages and failures',
        component: 'Error notifications, failed states',
      },
      {
        name: 'Info Alert',
        lightBackground: '#3b82f6',
        lightText: '#ffffff',
        darkBackground: '#3b82f6',
        darkText: '#ffffff',
        usage: 'Information messages and tips',
        component: 'Info notifications, helpful tips',
      },
    ],
    codeElements: [
      {
        name: 'Code Block Background',
        lightBackground: '#f3f4f6',
        lightText: '#374151',
        darkBackground: '#1f2937',
        darkText: '#d1d5db',
        usage: 'Code block containers',
        component: 'Pre-formatted code blocks',
      },
      {
        name: 'Inline Code',
        lightBackground: '#f3f4f6',
        lightText: '#1f2937',
        darkBackground: '#1f2937',
        darkText: '#e5e7eb',
        usage: 'Inline code elements',
        component: 'Code spans, variable names',
      },
      {
        name: 'Code Keywords',
        lightBackground: '#f3f4f6',
        lightText: '#2563eb',
        darkBackground: '#1f2937',
        darkText: '#60a5fa',
        usage: 'Syntax highlighting - keywords',
        component: 'Reserved words, language keywords',
      },
      {
        name: 'Code Strings',
        lightBackground: '#f3f4f6',
        lightText: '#059669',
        darkBackground: '#1f2937',
        darkText: '#34d399',
        usage: 'Syntax highlighting - strings',
        component: 'String literals, text values',
      },
    ],
  }
}
