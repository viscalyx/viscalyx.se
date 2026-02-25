import { renderHook, waitFor } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  usePrivacyTranslations,
  useTermsTranslations,
  validateFilePrefix,
} from '../page-translations'

// Mock next-intl
const mockUseLocale = vi.fn()
vi.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
}))

// Store console.error spy for cleanup
let consoleErrorSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.clearAllMocks()
  mockUseLocale.mockReturnValue('en')

  // Setup console.error mock to suppress error logs in tests
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
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
      expect(result.current.translations.title).toBeTruthy()
      expect(result.current.translations.sections).toBeTruthy()
      expect(
        result.current.translations.sections.informationWeCollect,
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
      expect(result.current.translations.title).toBeTruthy()
      expect(result.current.translations.sections).toBeTruthy()
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
      const enKeys = Object.keys(enResult.current.translations.sections)
      const svKeys = Object.keys(svResult.current.translations.sections)
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

describe('validateFilePrefix', () => {
  describe('valid inputs', () => {
    it('accepts valid alphanumeric strings', () => {
      expect(validateFilePrefix('privacy')).toBe('privacy')
      expect(validateFilePrefix('terms')).toBe('terms')
      expect(validateFilePrefix('about')).toBe('about')
      expect(validateFilePrefix('test123')).toBe('test123')
    })

    it('accepts strings with hyphens and underscores', () => {
      expect(validateFilePrefix('privacy-policy')).toBe('privacy-policy')
      expect(validateFilePrefix('terms_of_service')).toBe('terms_of_service')
      expect(validateFilePrefix('user-guide')).toBe('user-guide')
    })

    it('converts input to lowercase', () => {
      expect(validateFilePrefix('PRIVACY')).toBe('privacy')
      expect(validateFilePrefix('Terms')).toBe('terms')
      expect(validateFilePrefix('MixedCase')).toBe('mixedcase') // cSpell: disable-line
    })

    it('trims whitespace', () => {
      expect(validateFilePrefix('  privacy  ')).toBe('privacy')
      expect(validateFilePrefix('\tterms\n')).toBe('terms')
    })
  })

  describe('invalid inputs', () => {
    it('throws error for empty or null inputs', () => {
      expect(() => validateFilePrefix('')).toThrow(
        'File prefix must be a non-empty string',
      )
      expect(() => validateFilePrefix('   ')).toThrow(
        'File prefix cannot be empty or whitespace only',
      )
      // @ts-expect-error - Testing null input
      expect(() => validateFilePrefix(null)).toThrow(
        'File prefix must be a non-empty string',
      )
      // @ts-expect-error - Testing undefined input
      expect(() => validateFilePrefix(undefined)).toThrow(
        'File prefix must be a non-empty string',
      )
    })

    it('throws error for non-string inputs', () => {
      // @ts-expect-error - Testing number input
      expect(() => validateFilePrefix(123)).toThrow(
        'File prefix must be a non-empty string',
      )
      // @ts-expect-error - Testing object input
      expect(() => validateFilePrefix({})).toThrow(
        'File prefix must be a non-empty string',
      )
      // @ts-expect-error - Testing array input
      expect(() => validateFilePrefix([])).toThrow(
        'File prefix must be a non-empty string',
      )
    })

    it('throws error for path traversal attempts', () => {
      expect(() => validateFilePrefix('../etc/passwd')).toThrow(
        'File prefix contains invalid path characters',
      )
      expect(() => validateFilePrefix('../../secret')).toThrow(
        'File prefix contains invalid path characters',
      )
      expect(() => validateFilePrefix('path/to/file')).toThrow(
        'File prefix contains invalid path characters',
      )
      expect(() => validateFilePrefix('path\\to\\file')).toThrow(
        'File prefix contains invalid path characters',
      )
    })

    it('throws error for invalid characters', () => {
      expect(() => validateFilePrefix('privacy!')).toThrow(
        'Only lowercase alphanumeric characters',
      )
      expect(() => validateFilePrefix('terms@domain.com')).toThrow(
        'Only lowercase alphanumeric characters',
      )
      expect(() => validateFilePrefix('file.txt')).toThrow(
        'Only lowercase alphanumeric characters',
      )
      expect(() => validateFilePrefix('file space')).toThrow(
        'Only lowercase alphanumeric characters',
      )
      expect(() => validateFilePrefix('file#hash')).toThrow(
        'Only lowercase alphanumeric characters',
      )
    })

    it('throws error for strings starting with underscore or hyphen', () => {
      expect(() => validateFilePrefix('_private')).toThrow(
        'File prefix cannot start with underscore or hyphen',
      )
      expect(() => validateFilePrefix('-hidden')).toThrow(
        'File prefix cannot start with underscore or hyphen',
      )
    })

    it('throws error for strings ending with hyphen', () => {
      expect(() => validateFilePrefix('file-')).toThrow(
        'File prefix cannot start with underscore or hyphen, or end with hyphen',
      )
    })

    it('throws error for reserved names', () => {
      expect(() => validateFilePrefix('con')).toThrow(
        'File prefix cannot use reserved name',
      )
      expect(() => validateFilePrefix('prn')).toThrow(
        'File prefix cannot use reserved name',
      )
      expect(() => validateFilePrefix('aux')).toThrow(
        'File prefix cannot use reserved name',
      )
      expect(() => validateFilePrefix('nul')).toThrow(
        'File prefix cannot use reserved name',
      )
      expect(() => validateFilePrefix('index')).toThrow(
        'File prefix cannot use reserved name',
      )
      expect(() => validateFilePrefix('main')).toThrow(
        'File prefix cannot use reserved name',
      )
      expect(() => validateFilePrefix('config')).toThrow(
        'File prefix cannot use reserved name',
      )
    })
  })

  describe('edge cases', () => {
    it('handles mixed case reserved names', () => {
      expect(() => validateFilePrefix('CON')).toThrow(
        'File prefix cannot use reserved name',
      )
      expect(() => validateFilePrefix('Index')).toThrow(
        'File prefix cannot use reserved name',
      )
    })

    it('allows valid names that contain reserved names as substrings', () => {
      expect(validateFilePrefix('configuration')).toBe('configuration')
      expect(validateFilePrefix('contact')).toBe('contact')
      expect(validateFilePrefix('mainpage')).toBe('mainpage') // cSpell: disable-line
    })
  })
})

// Cleanup after all tests
afterAll(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  // Explicitly restore console.error spy
  if (consoleErrorSpy) {
    consoleErrorSpy.mockRestore()
  }
})
