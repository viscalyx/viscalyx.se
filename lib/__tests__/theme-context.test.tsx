import { isValidTheme, ThemeProvider, useTheme } from '@/lib/theme-context'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ReactNode } from 'react'

// Mock cookie-consent
const hasConsentMock = vi.fn((_category: string) => true)
vi.mock('@/lib/cookie-consent', () => ({
  hasConsent: (category: string) => hasConsentMock(category),
}))

// --- localStorage mock ---
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// --- matchMedia mock ---
// Mutable object so tests can change .matches and the ref in ThemeProvider sees it
let mediaChangeHandler: ((e: { matches: boolean }) => void) | null = null

const mediaQueryObject = {
  matches: false,
  addEventListener: vi.fn(
    (_event: string, handler: (e: { matches: boolean }) => void) => {
      mediaChangeHandler = handler
    }
  ),
  removeEventListener: vi.fn(() => {
    mediaChangeHandler = null
  }),
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}

const matchMediaMock = vi.fn(() => mediaQueryObject)

Object.defineProperty(window, 'matchMedia', { value: matchMediaMock })

// --- Helper ---
const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('isValidTheme', () => {
  it('returns true for valid theme values', () => {
    expect(isValidTheme('light')).toBe(true)
    expect(isValidTheme('dark')).toBe(true)
    expect(isValidTheme('system')).toBe(true)
  })

  it('returns false for null and invalid strings', () => {
    expect(isValidTheme(null)).toBe(false)
    expect(isValidTheme('')).toBe(false)
    expect(isValidTheme('auto')).toBe(false)
    expect(isValidTheme('midnight')).toBe(false)
  })

  it('returns false for non-theme strings', () => {
    expect(isValidTheme('LIGHT')).toBe(false)
    expect(isValidTheme(' dark ')).toBe(false)
    expect(isValidTheme('System')).toBe(false)
  })
})

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    mediaQueryObject.matches = false
    mediaQueryObject.addEventListener = vi.fn(
      (_event: string, handler: (e: { matches: boolean }) => void) => {
        mediaChangeHandler = handler
      }
    )
    mediaQueryObject.removeEventListener = vi.fn(() => {
      mediaChangeHandler = null
    })
    mediaChangeHandler = null
    document.documentElement.classList.remove('dark')
    hasConsentMock.mockReturnValue(true)
  })

  describe('initialization', () => {
    it('defaults to system theme with light resolved before mount effects', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      // With no localStorage and no .dark class, should remain system/light
      const capturedTheme = result.current.theme
      const capturedResolved = result.current.resolvedTheme

      expect(capturedTheme).toBe('system')
      expect(capturedResolved).toBe('light')
    })

    it('reads theme from localStorage on mount when consent exists', () => {
      localStorageMock.setItem('theme', 'dark')

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
      expect(result.current.theme).toBe('dark')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('ignores localStorage when consent is not given', () => {
      hasConsentMock.mockReturnValue(false)
      localStorageMock.setItem('theme', 'dark')

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('system')
    })

    it('falls back to system when localStorage has an invalid value', () => {
      localStorageMock.setItem('theme', 'invalid-value')

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('system')
    })

    it('reads .dark class from document to determine initial resolved theme', () => {
      document.documentElement.classList.add('dark')
      // matchMedia must also agree, since post-init effect resolves via matchMedia for system theme
      mediaQueryObject.matches = true

      const { result } = renderHook(() => useTheme(), { wrapper })

      // Both DOM class and matchMedia indicate dark, so resolved stays dark
      expect(result.current.resolvedTheme).toBe('dark')
    })
  })

  describe('theme switching', () => {
    it('updates theme and resolvedTheme when setTheme is called with dark', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('dark')
      })

      expect(result.current.theme).toBe('dark')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('updates theme and resolvedTheme when setTheme is called with light', () => {
      // Start from dark
      localStorageMock.setItem('theme', 'dark')
      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('light')
      })

      expect(result.current.theme).toBe('light')
      expect(result.current.resolvedTheme).toBe('light')
    })

    it('resolves system theme via matchMedia', () => {
      mediaQueryObject.matches = true // prefers dark
      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('system')
      })

      expect(result.current.theme).toBe('system')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('adds and removes .dark class on document.documentElement', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('dark')
      })
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      act(() => {
        result.current.setTheme('light')
      })
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('writes to localStorage when consent exists, skips when absent', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      localStorageMock.setItem.mockClear()

      act(() => {
        result.current.setTheme('dark')
      })
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')

      // Now disable consent
      hasConsentMock.mockReturnValue(false)
      localStorageMock.setItem.mockClear()

      act(() => {
        result.current.setTheme('light')
      })
      // setItem should not be called for theme when no consent
      const themeCalls = localStorageMock.setItem.mock.calls.filter(
        (call: string[]) => call[0] === 'theme'
      )
      expect(themeCalls).toHaveLength(0)
    })
  })

  describe('system theme detection', () => {
    it('resolves to dark when matchMedia prefers dark', () => {
      mediaQueryObject.matches = true
      const { result } = renderHook(() => useTheme(), { wrapper })

      // Default theme is system, matchMedia says dark
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('resolves to light when matchMedia prefers light', () => {
      mediaQueryObject.matches = false
      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.resolvedTheme).toBe('light')
    })

    it('responds to matchMedia change events', () => {
      mediaQueryObject.matches = false
      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.resolvedTheme).toBe('light')

      // Simulate OS dark mode change — update the mock object AND call the handler
      act(() => {
        mediaQueryObject.matches = true
        if (mediaChangeHandler) {
          mediaChangeHandler({ matches: true })
        }
      })

      expect(result.current.resolvedTheme).toBe('dark')
    })
  })
})

describe('useTheme', () => {
  it('throws when used outside ThemeProvider', () => {
    // Suppress console.error for the expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useTheme())
    }).toThrow('useTheme must be used within a ThemeProvider')

    consoleSpy.mockRestore()
  })

  it('returns theme, setTheme, and resolvedTheme inside ThemeProvider', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current).toHaveProperty('theme')
    expect(result.current).toHaveProperty('setTheme')
    expect(result.current).toHaveProperty('resolvedTheme')
    expect(typeof result.current.setTheme).toBe('function')
  })
})
