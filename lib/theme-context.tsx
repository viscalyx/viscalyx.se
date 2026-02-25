'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { hasConsent } from './cookie-consent'

type Theme = 'light' | 'dark' | 'system'

// Custom hook to handle initialization-guarded effects
function useEffectWhenInitialized(
  effect: React.EffectCallback,
  deps: React.DependencyList,
  isInitialized: boolean,
) {
  useEffect(() => {
    if (!isInitialized) return
    return effect()
  }, [isInitialized, effect, ...deps])
}

interface ThemeContextType {
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  theme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper function to validate theme value
export const isValidTheme = (value: string | null): value is Theme => {
  return value !== null && ['light', 'dark', 'system'].includes(value)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with defaults to match server rendering
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [isInitialized, setIsInitialized] = useState(false)
  const mediaQueryRef = useRef<MediaQueryList | null>(null)

  // Sync with localStorage and DOM after hydration
  // This is intentional - we're syncing with external storage state on mount
  useEffect(() => {
    // Load theme from localStorage with error handling
    let savedTheme: Theme = 'system'
    try {
      if (hasConsent('preferences')) {
        const stored = localStorage.getItem('theme')
        if (isValidTheme(stored)) {
          savedTheme = stored
        }
      }
    } catch (error) {
      console.error('Failed to access localStorage for theme:', error)
    }

    // Check current class on document to sync with blocking script
    const isDarkApplied = document.documentElement.classList.contains('dark')
    const initialResolvedTheme: 'light' | 'dark' = isDarkApplied
      ? 'dark'
      : 'light'

    setTheme(savedTheme)
    setResolvedTheme(initialResolvedTheme)
    setIsInitialized(true)
  }, [])

  useEffectWhenInitialized(
    () => {
      // Initialize media query ref if not already done
      if (!mediaQueryRef.current) {
        mediaQueryRef.current = window.matchMedia(
          '(prefers-color-scheme: dark)',
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
    isInitialized,
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
    isInitialized,
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
