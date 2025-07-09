import { renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  usePrivacyTranslations,
  useTermsTranslations,
} from '../page-translations'

// Mock next-intl
const mockUseLocale = vi.fn()
vi.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockUseLocale.mockReturnValue('en')

  // Setup console.error mock to suppress error logs in tests
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('usePrivacyTranslations', () => {
  it('should start with loading state and no translations', () => {
    const { result } = renderHook(() => usePrivacyTranslations())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.translations).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should load English privacy translations successfully', async () => {
    mockUseLocale.mockReturnValue('en')
    const { result } = renderHook(() => usePrivacyTranslations())

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify translations are loaded and have the expected structure
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)

    if (result.current.translations) {
      expect(result.current.translations.privacy).toBeTruthy()
      expect(result.current.translations.privacy.title).toBeTruthy()
      expect(result.current.translations.privacy.sections).toBeTruthy()
      expect(
        result.current.translations.privacy.sections.informationWeCollect
      ).toBeTruthy()
    }
  })

  it('should load Swedish privacy translations successfully', async () => {
    mockUseLocale.mockReturnValue('sv')
    const { result } = renderHook(() => usePrivacyTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify translations are loaded
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)

    if (result.current.translations) {
      expect(result.current.translations.privacy).toBeTruthy()
      expect(result.current.translations.privacy.title).toBeTruthy()
      expect(result.current.translations.privacy.sections).toBeTruthy()
    }
  })

  it('should fallback to English when using unsupported locale', async () => {
    // Use a locale that doesn't have translation files
    mockUseLocale.mockReturnValue('fr')
    const { result } = renderHook(() => usePrivacyTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should fallback to English translations
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)
  })

  it('should reload translations when locale changes from English to Swedish', async () => {
    mockUseLocale.mockReturnValue('en')
    const { result, rerender } = renderHook(() => usePrivacyTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const initialTranslations = result.current.translations

    // Change locale to Swedish
    mockUseLocale.mockReturnValue('sv')
    rerender()

    // Wait for the new translations to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Translations should be different (Swedish vs English)
    expect(result.current.translations).toBeTruthy()
    expect(result.current.translations).not.toEqual(initialTranslations)
  })

  it('should have consistent interface across locales', async () => {
    // Test English
    mockUseLocale.mockReturnValue('en')
    const { result: enResult } = renderHook(() => usePrivacyTranslations())

    await waitFor(() => {
      expect(enResult.current.loading).toBe(false)
    })

    // Test Swedish
    mockUseLocale.mockReturnValue('sv')
    const { result: svResult } = renderHook(() => usePrivacyTranslations())

    await waitFor(() => {
      expect(svResult.current.loading).toBe(false)
    })

    // Both should have the same structure
    if (enResult.current.translations && svResult.current.translations) {
      const enKeys = Object.keys(enResult.current.translations.privacy.sections)
      const svKeys = Object.keys(svResult.current.translations.privacy.sections)
      expect(enKeys).toEqual(svKeys)
    }
  })
})

describe('useTermsTranslations', () => {
  it('should start with loading state and no translations', () => {
    const { result } = renderHook(() => useTermsTranslations())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.translations).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should load English terms translations successfully', async () => {
    mockUseLocale.mockReturnValue('en')
    const { result } = renderHook(() => useTermsTranslations())

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify translations are loaded and have the expected structure
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)

    if (result.current.translations) {
      expect(result.current.translations.terms).toBeTruthy()
      expect(result.current.translations.terms.title).toBeTruthy()
      expect(result.current.translations.terms.sections).toBeTruthy()
      expect(result.current.translations.terms.sections.agreement).toBeTruthy()
    }
  })

  it('should load Swedish terms translations successfully', async () => {
    mockUseLocale.mockReturnValue('sv')
    const { result } = renderHook(() => useTermsTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify translations are loaded
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)

    if (result.current.translations) {
      expect(result.current.translations.terms).toBeTruthy()
      expect(result.current.translations.terms.title).toBeTruthy()
      expect(result.current.translations.terms.sections).toBeTruthy()
    }
  })

  it('should fallback to English when using unsupported locale', async () => {
    // Use a locale that doesn't have translation files
    mockUseLocale.mockReturnValue('fr')
    const { result } = renderHook(() => useTermsTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should fallback to English translations
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)
  })

  it('should reload translations when locale changes from English to Swedish', async () => {
    mockUseLocale.mockReturnValue('en')
    const { result, rerender } = renderHook(() => useTermsTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const initialTranslations = result.current.translations

    // Change locale to Swedish
    mockUseLocale.mockReturnValue('sv')
    rerender()

    // Wait for the new translations to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Translations should be different (Swedish vs English)
    expect(result.current.translations).toBeTruthy()
    expect(result.current.translations).not.toEqual(initialTranslations)
  })

  it('should have consistent interface across locales', async () => {
    // Test English
    mockUseLocale.mockReturnValue('en')
    const { result: enResult } = renderHook(() => useTermsTranslations())

    await waitFor(() => {
      expect(enResult.current.loading).toBe(false)
    })

    // Test Swedish
    mockUseLocale.mockReturnValue('sv')
    const { result: svResult } = renderHook(() => useTermsTranslations())

    await waitFor(() => {
      expect(svResult.current.loading).toBe(false)
    })

    // Both should have the same structure
    if (enResult.current.translations && svResult.current.translations) {
      const enKeys = Object.keys(enResult.current.translations.terms.sections)
      const svKeys = Object.keys(svResult.current.translations.terms.sections)
      expect(enKeys).toEqual(svKeys)
    }
  })
})

// Test error handling - test with invalid locale that will trigger fallback behavior
describe('usePrivacyTranslations error handling', () => {
  it('should handle unsupported locale and fallback to English', async () => {
    // Use a locale that doesn't have translation files to test fallback behavior
    mockUseLocale.mockReturnValue('fr') // French is not supported
    const { result } = renderHook(() => usePrivacyTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have translations (fallback to English) and no error
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)

    // The English translations should be loaded as fallback
    if (result.current.translations) {
      expect(result.current.translations.privacy.title).toBe('Privacy Policy')
    }
  })
})

describe('useTermsTranslations error handling', () => {
  it('should handle unsupported locale and fallback to English', async () => {
    // Use a locale that doesn't have translation files to test fallback behavior
    mockUseLocale.mockReturnValue('fr') // French is not supported
    const { result } = renderHook(() => useTermsTranslations())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have translations (fallback to English) and no error
    expect(result.current.translations).toBeTruthy()
    expect(result.current.error).toBe(null)

    // The English translations should be loaded as fallback
    if (result.current.translations) {
      expect(result.current.translations.terms.title).toBe('Terms of Service')
    }
  })
})

// Cleanup after all tests
afterAll(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
