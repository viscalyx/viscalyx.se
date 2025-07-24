'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { hasConsent } from './cookie-consent'

type Theme = 'light' | 'dark' | 'system'

// Custom hook to handle initialization-guarded effects
function useEffectWhenInitialized(
  effect: React.EffectCallback,
  deps: React.DependencyList,
  isInitialized: boolean
) {
  useEffect(() => {
    if (!isInitialized) return
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, effect, ...deps])
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [isInitialized, setIsInitialized] = useState(false)
  const mediaQueryRef = useRef<MediaQueryList | null>(null)

  useEffect(() => {
    // Helper function to validate theme value
    const isValidTheme = (value: string | null): value is Theme => {
      return value !== null && ['light', 'dark', 'system'].includes(value)
    }

    // Load theme from localStorage with error handling
    let savedTheme: string | null = null
    try {
      // Only load from localStorage if user has consented to preferences cookies
      if (hasConsent('preferences')) {
        savedTheme = localStorage.getItem('theme')
      }
    } catch (error) {
      console.error('Failed to access localStorage for theme:', error)
    }

    // Validate and set theme with proper type safety
    const validTheme: Theme = isValidTheme(savedTheme) ? savedTheme : 'system'

    // Check current class on document to sync with blocking script
    // This syncs with an inline blocking script that should be placed in the <head>
    // to prevent FOUC (Flash of Unstyled Content). The script applies the theme
    // immediately before React hydration. For CSP compliance, consider using
    // nonce or hash-based CSP directives for the inline script, or move theme
    // application to a separate .js file if strict CSP is required.
    const isDarkApplied = document.documentElement.classList.contains('dark')

    // Determine initial resolved theme based on current state
    let initialResolvedTheme: 'light' | 'dark'
    if (isDarkApplied) {
      initialResolvedTheme = 'dark'
    } else {
      initialResolvedTheme = 'light'
    }

    setTheme(validTheme)
    setResolvedTheme(initialResolvedTheme)
    setIsInitialized(true)
  }, [])

  useEffectWhenInitialized(
    () => {
      // Initialize media query ref if not already done
      if (!mediaQueryRef.current) {
        mediaQueryRef.current = window.matchMedia(
          '(prefers-color-scheme: dark)'
        )
      }

      const mediaQuery = mediaQueryRef.current

      const updateResolvedTheme = () => {
        if (theme === 'system') {
          const systemTheme = mediaQuery.matches ? 'dark' : 'light'
          setResolvedTheme(systemTheme)
        } else {
          setResolvedTheme(theme as 'light' | 'dark')
        }
      }

      updateResolvedTheme()

      if (theme === 'system') {
        mediaQuery.addEventListener('change', updateResolvedTheme)
        return () => {
          mediaQuery.removeEventListener('change', updateResolvedTheme)
        }
      }
    },
    [theme],
    isInitialized
  )

  useEffectWhenInitialized(
    () => {
      // Apply theme to document
      const root = document.documentElement
      if (resolvedTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      // Save to localStorage with error handling and cookie consent check
      try {
        // Only save to localStorage if user has consented to preferences cookies
        if (hasConsent('preferences')) {
          localStorage.setItem('theme', theme)
        }
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error)
      }
    },
    [theme, resolvedTheme],
    isInitialized
  )

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleSetTheme, resolvedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
