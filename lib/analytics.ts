'use client'

import { useCallback, useEffect, useRef } from 'react'
import { consentEvents } from './consent-events'
import { hasConsent } from './cookie-consent'

interface BlogAnalyticsData {
  slug: string
  category: string
  title: string
}

interface UseAnalyticsOptions {
  trackReadProgress?: boolean
  trackTimeSpent?: boolean
  progressThreshold?: number // Send analytics when user reaches this % of content
}

// Cache for consent status to avoid repeated localStorage reads
let cachedAnalyticsConsent: boolean | null = null
let consentCacheTimestamp: number = 0
const CONSENT_CACHE_DURATION = 30000 // Cache for 30 seconds - balanced between performance and responsiveness

/**
 * Get cached analytics consent status or fetch fresh if cache is stale
 */
function getCachedAnalyticsConsent(): boolean {
  const now = Date.now()

  // If cache is fresh, return cached value
  if (
    cachedAnalyticsConsent !== null &&
    now - consentCacheTimestamp < CONSENT_CACHE_DURATION
  ) {
    return cachedAnalyticsConsent
  }

  // Cache is stale or doesn't exist, fetch fresh consent
  const currentConsent = hasConsent('analytics')
  cachedAnalyticsConsent = currentConsent
  consentCacheTimestamp = now

  return currentConsent
}

/**
 * Invalidate the consent cache (call when consent settings change)
 */
export function invalidateConsentCache(): void {
  cachedAnalyticsConsent = null
  consentCacheTimestamp = 0
}

/**
 * Setup consent change listeners to invalidate cache
 */
function setupConsentCacheInvalidation(): () => void {
  if (typeof window === 'undefined') return () => {}

  // Listen for consent events (more reliable than storage events)
  const unsubscribeConsentChange = consentEvents.on('consent-changed', () => {
    invalidateConsentCache()
  })

  const unsubscribeConsentReset = consentEvents.on('consent-reset', () => {
    invalidateConsentCache()
  })

  // Also listen for storage events as fallback (for cross-tab synchronization)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'cookie-consent') {
      invalidateConsentCache()
    }
  }

  window.addEventListener('storage', handleStorageChange)

  return () => {
    unsubscribeConsentChange()
    unsubscribeConsentReset()
    window.removeEventListener('storage', handleStorageChange)
  }
}

export function useBlogAnalytics(
  data: BlogAnalyticsData,
  options: UseAnalyticsOptions = {}
) {
  const {
    trackReadProgress = true,
    trackTimeSpent = true,
    progressThreshold = 50, // Track when user reads 50% of content
  } = options

  const startTime = useRef<number>(Date.now())
  const hasTrackedProgress = useRef<boolean>(false)
  const maxScrollProgress = useRef<number>(0)

  // Use ref to store data and only update when values actually change
  const dataRef = useRef<BlogAnalyticsData>(data)

  // Update dataRef only when values actually change
  if (
    dataRef.current.slug !== data.slug ||
    dataRef.current.category !== data.category ||
    dataRef.current.title !== data.title
  ) {
    dataRef.current = data
  }

  const trackEvent = useCallback(
    async (readProgress?: number, timeSpent?: number) => {
      // Only track if user has consented to analytics cookies
      if (!getCachedAnalyticsConsent()) {
        return
      }

      try {
        await fetch('/api/analytics/blog-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug: dataRef.current.slug,
            category: dataRef.current.category,
            title: dataRef.current.title,
            readProgress,
            timeSpent,
          }),
        })
      } catch (error) {
        console.warn('Failed to track blog analytics:', error)
      }
    },
    [] // No dependencies - uses stable dataRef.current
  )

  useEffect(() => {
    if (!trackReadProgress && !trackTimeSpent) return

    // Setup consent cache invalidation listener
    const cleanupConsentListener = setupConsentCacheInvalidation()

    let throttleTimer: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (!trackReadProgress || !getCachedAnalyticsConsent()) return

      if (throttleTimer) return

      throttleTimer = setTimeout(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop
        const documentHeight =
          document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = Math.min((scrollTop / documentHeight) * 100, 100)

        // Track the maximum scroll progress
        maxScrollProgress.current = Math.max(
          maxScrollProgress.current,
          scrollProgress
        )

        // Track when user reaches the progress threshold
        if (
          !hasTrackedProgress.current &&
          scrollProgress >= progressThreshold
        ) {
          hasTrackedProgress.current = true
          const timeSpent = trackTimeSpent
            ? Math.round((Date.now() - startTime.current) / 1000)
            : undefined

          trackEvent(scrollProgress, timeSpent)
        }

        throttleTimer = null
      }, 100) // Throttle to run at most every 100ms
    }

    const handleBeforeUnload = () => {
      // Only track if user has consented to analytics cookies
      if (!getCachedAnalyticsConsent()) {
        return
      }

      // Track final analytics on page unload
      const timeSpent = trackTimeSpent
        ? Math.round((Date.now() - startTime.current) / 1000)
        : undefined

      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/blog-read',
          JSON.stringify({
            slug: dataRef.current.slug,
            category: dataRef.current.category,
            title: dataRef.current.title,
            readProgress: maxScrollProgress.current,
            timeSpent,
          })
        )
      }
    }

    const timeoutId = setTimeout(() => {
      if (trackTimeSpent && getCachedAnalyticsConsent()) {
        trackEvent(0, 0) // Initial page view
      }
    }, 1000)

    if (trackReadProgress) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    if (trackTimeSpent) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      clearTimeout(timeoutId)
      if (throttleTimer) {
        clearTimeout(throttleTimer)
      }
      if (trackReadProgress) {
        window.removeEventListener('scroll', handleScroll)
      }
      if (trackTimeSpent) {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
      cleanupConsentListener()
    }
  }, [
    trackReadProgress,
    trackTimeSpent,
    progressThreshold,
    trackEvent, // Include trackEvent but it's now stable (no deps) so won't cause re-renders
  ])

  return {
    trackEvent,
    maxScrollProgress: maxScrollProgress.current,
  }
}
