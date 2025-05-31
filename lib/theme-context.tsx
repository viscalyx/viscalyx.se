'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

// Custom hook to handle initialization-guarded effects
function useInitializedEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList,
  isInitialized: boolean
) {
  useEffect(() => {
    if (!isInitialized) return
    return effect()
  }, [isInitialized, ...deps])
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

  useEffect(() => {
    // Load theme from localStorage and get initial resolved theme
    const savedTheme = localStorage.getItem('theme') as Theme
    const validTheme =
      savedTheme && ['light', 'dark', 'system'].includes(savedTheme)
        ? savedTheme
        : 'system'

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

  useInitializedEffect(
    () => {
      const updateResolvedTheme = () => {
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light'
          setResolvedTheme(systemTheme)
        } else {
          setResolvedTheme(theme as 'light' | 'dark')
        }
      }

      updateResolvedTheme()

      if (theme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', updateResolvedTheme)
        return () =>
          mediaQuery.removeEventListener('change', updateResolvedTheme)
      }
    },
    [theme],
    isInitialized
  )

  useInitializedEffect(
    () => {
      // Apply theme to document
      const root = document.documentElement
      if (resolvedTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      // Save to localStorage
      localStorage.setItem('theme', theme)
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
