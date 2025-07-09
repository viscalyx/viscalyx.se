import { describe, expect, it } from 'vitest'
import {
  getAccessibilityInfo,
  getAllColors,
  getContrastRatio,
  getDataVisualizationColors,
  getPrimaryColors,
  getSecondaryColors,
  meetsContrastRequirement,
  simulateColorBlindness,
} from '../colors'

describe('colors utility', () => {
  describe('getPrimaryColors', () => {
    it('should return updated primary colors with correct structure', () => {
      const colors = getPrimaryColors()

      expect(colors).toHaveLength(10)
      expect(colors[0]).toHaveProperty('name', 'primary-50')
      expect(colors[0]).toHaveProperty('hex', '#f0f9ff')
      expect(colors[0]).toHaveProperty('rgb', 'rgb(240, 249, 255)')

      expect(colors[5]).toHaveProperty('name', 'primary-500')
      expect(colors[5]).toHaveProperty('hex', '#0ea5e9')
      expect(colors[5]).toHaveProperty('rgb', 'rgb(14, 165, 233)')

      expect(colors[6]).toHaveProperty('name', 'primary-600')
      expect(colors[6]).toHaveProperty('hex', '#0277bd')
      expect(colors[6]).toHaveProperty('rgb', 'rgb(2, 119, 189)')
    })
  })

  describe('getSecondaryColors', () => {
    it('should return updated secondary colors with correct structure', () => {
      const colors = getSecondaryColors()

      expect(colors).toHaveLength(11)
      expect(colors[0]).toHaveProperty('name', 'secondary-50')
      expect(colors[0]).toHaveProperty('hex', '#f9fafb')
      expect(colors[0]).toHaveProperty('rgb', 'rgb(249, 250, 251)')

      expect(colors[5]).toHaveProperty('name', 'secondary-500')
      expect(colors[5]).toHaveProperty('hex', '#6b7280')
      expect(colors[5]).toHaveProperty('rgb', 'rgb(107, 114, 128)')

      expect(colors[6]).toHaveProperty('name', 'secondary-600')
      expect(colors[6]).toHaveProperty('hex', '#4b5563')
      expect(colors[6]).toHaveProperty('rgb', 'rgb(75, 85, 99)')
    })
  })

  describe('getDataVisualizationColors', () => {
    it('should return analysis colors with correct structure', () => {
      const colors = getDataVisualizationColors()

      expect(colors).toHaveLength(8)
      expect(colors[0]).toHaveProperty('name', 'Visualization 1')
      expect(colors[0]).toHaveProperty('hex', '#3b82f6')
      expect(colors[0]).toHaveProperty('rgb', 'rgb(59, 130, 246)')
      expect(colors[0]).toHaveProperty(
        'usage',
        'Primary data series, main categories'
      )

      expect(colors[4]).toHaveProperty('name', 'Visualization 5')
      expect(colors[4]).toHaveProperty('hex', '#ef4444')
      expect(colors[4]).toHaveProperty('rgb', 'rgb(239, 68, 68)')
      expect(colors[4]).toHaveProperty('usage', 'Error states, critical values')
    })
  })

  describe('getAllColors', () => {
    it('should return all colors organized by category', () => {
      const allColors = getAllColors()

      expect(allColors).toHaveProperty('primary')
      expect(allColors).toHaveProperty('secondary')
      expect(allColors).toHaveProperty('dataVisualization')

      expect(allColors.primary).toHaveLength(10)
      expect(allColors.secondary).toHaveLength(11)
      expect(allColors.dataVisualization).toHaveLength(8)
    })
  })

  describe('color values consistency', () => {
    it('should have consistent color values across all functions', () => {
      const { primary, secondary } = getAllColors()
      const primaryDirect = getPrimaryColors()
      const secondaryDirect = getSecondaryColors()

      expect(primary).toEqual(primaryDirect)
      expect(secondary).toEqual(secondaryDirect)
    })
  })

  describe('getContrastRatio', () => {
    it('calculates contrast ratio correctly', () => {
      // Test with black on white (should be 21:1)
      const blackOnWhite = getContrastRatio('#000000', '#ffffff')
      expect(blackOnWhite).toBeCloseTo(21, 0)

      // Test with white on black (should be 21:1)
      const whiteOnBlack = getContrastRatio('#ffffff', '#000000')
      expect(whiteOnBlack).toBeCloseTo(21, 0)

      // Test with same color (should be 1:1)
      const sameColor = getContrastRatio('#333333', '#333333')
      expect(sameColor).toBeCloseTo(1, 0)
    })
  })

  describe('meetsContrastRequirement', () => {
    it('correctly identifies AA compliance', () => {
      // High contrast combination
      expect(meetsContrastRequirement('#000000', '#ffffff')).toBe(true)

      // Low contrast combination
      expect(meetsContrastRequirement('#cccccc', '#ffffff')).toBe(false)

      // Primary color on white should pass
      expect(meetsContrastRequirement('#0277bd', '#ffffff')).toBe(true)
    })

    it('correctly identifies AAA compliance', () => {
      // Black on white should pass AAA
      expect(meetsContrastRequirement('#000000', '#ffffff', 'AAA')).toBe(true)

      // Lower contrast should fail AAA
      expect(meetsContrastRequirement('#666666', '#ffffff', 'AAA')).toBe(false)
    })
  })

  describe('simulateColorBlindness', () => {
    it('returns different colors for different types of color blindness', () => {
      const originalColor = '#0277bd'

      const protanopia = simulateColorBlindness(originalColor, 'protanopia')
      const deuteranopia = simulateColorBlindness(originalColor, 'deuteranopia')
      const tritanopia = simulateColorBlindness(originalColor, 'tritanopia')

      // All should be valid hex colors
      expect(protanopia).toMatch(/^#[0-9a-f]{6}$/i)
      expect(deuteranopia).toMatch(/^#[0-9a-f]{6}$/i)
      expect(tritanopia).toMatch(/^#[0-9a-f]{6}$/i)

      // They should be different (at least some of them)
      expect(
        protanopia !== deuteranopia ||
          deuteranopia !== tritanopia ||
          tritanopia !== protanopia
      ).toBe(true)
    })
  })

  describe('getAccessibilityInfo', () => {
    it('returns accessibility test results', () => {
      const info = getAccessibilityInfo()

      expect(info).toHaveProperty('contrastTests')
      expect(info).toHaveProperty('colorBlindSimulation')

      expect(Array.isArray(info.contrastTests)).toBe(true)
      expect(info.contrastTests.length).toBeGreaterThan(0)

      // Check structure of contrast tests
      info.contrastTests.forEach(test => {
        expect(test).toHaveProperty('name')
        expect(test).toHaveProperty('foreground')
        expect(test).toHaveProperty('background')
        expect(test).toHaveProperty('ratio')
        expect(test).toHaveProperty('passes')
        expect(typeof test.passes).toBe('boolean')
        expect(typeof test.ratio).toBe('number')
      })
    })
  })
})
