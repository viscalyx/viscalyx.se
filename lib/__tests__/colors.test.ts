import { describe, expect, it } from 'vitest'
import {
  getAccentColors,
  getAllColors,
  getPrimaryColors,
  getSecondaryColors,
} from '../colors'

describe('colors utility', () => {
  describe('getPrimaryColors', () => {
    it('should return primary colors with correct structure', () => {
      const colors = getPrimaryColors()

      expect(colors).toHaveLength(10)
      expect(colors[0]).toHaveProperty('name', 'primary-50')
      expect(colors[0]).toHaveProperty('hex', '#eff6ff')
      expect(colors[0]).toHaveProperty('rgb', 'rgb(239, 246, 255)')

      expect(colors[5]).toHaveProperty('name', 'primary-500')
      expect(colors[5]).toHaveProperty('hex', '#3b82f6')
      expect(colors[5]).toHaveProperty('rgb', 'rgb(59, 130, 246)')
    })
  })

  describe('getSecondaryColors', () => {
    it('should return secondary colors with correct structure', () => {
      const colors = getSecondaryColors()

      expect(colors).toHaveLength(10)
      expect(colors[0]).toHaveProperty('name', 'secondary-50')
      expect(colors[0]).toHaveProperty('hex', '#f8fafc')
      expect(colors[0]).toHaveProperty('rgb', 'rgb(248, 250, 252)')

      expect(colors[5]).toHaveProperty('name', 'secondary-500')
      expect(colors[5]).toHaveProperty('hex', '#64748b')
      expect(colors[5]).toHaveProperty('rgb', 'rgb(100, 116, 139)')
    })
  })

  describe('getAccentColors', () => {
    it('should return accent colors with correct structure', () => {
      const colors = getAccentColors()

      expect(colors).toHaveLength(4)
      expect(colors[0]).toHaveProperty('name', 'Success')
      expect(colors[0]).toHaveProperty('hex', '#22c55e')
      expect(colors[0]).toHaveProperty('rgb', 'rgb(34, 197, 94)')
      expect(colors[0]).toHaveProperty('usage', 'Success states, confirmations')

      expect(colors[2]).toHaveProperty('name', 'Error')
      expect(colors[2]).toHaveProperty('hex', '#ef4444')
      expect(colors[2]).toHaveProperty('rgb', 'rgb(239, 68, 68)')
      expect(colors[2]).toHaveProperty('usage', 'Errors, destructive actions')
    })
  })

  describe('getAllColors', () => {
    it('should return all colors organized by category', () => {
      const allColors = getAllColors()

      expect(allColors).toHaveProperty('primary')
      expect(allColors).toHaveProperty('secondary')
      expect(allColors).toHaveProperty('accent')

      expect(allColors.primary).toHaveLength(10)
      expect(allColors.secondary).toHaveLength(10)
      expect(allColors.accent).toHaveLength(4)
    })
  })

  describe('color values consistency', () => {
    it('should have consistent color values across all functions', () => {
      const { primary, secondary, accent } = getAllColors()
      const primaryDirect = getPrimaryColors()
      const secondaryDirect = getSecondaryColors()
      const accentDirect = getAccentColors()

      expect(primary).toEqual(primaryDirect)
      expect(secondary).toEqual(secondaryDirect)
      expect(accent).toEqual(accentDirect)
    })
  })
})
