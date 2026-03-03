'use client'

import { useCallback, useEffect, useRef } from 'react'
import { consentEvents } from '@/lib/consent-events'
import { hasConsent } from '@/lib/cookie-consent'

interface BlogAnalyticsData {
  category: string
  slug: string
  title: string
}

interface UseAnalyticsOptions {
  progressThreshold?: number // Send analytics when user reaches this % of content
  trackReadProgress?: boolean
  trackTimeSpent?: boolean
}

interface UseBlogAnalyticsReturn {
  trackEvent: (readProgress?: number, timeSpent?: number) => Promise<void>
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
 * Helper function to check if two objects are deeply equal using JSON serialization
 * This is safe for simple objects without functions, circular references, or undefined values
 */
function isDataEqual(a: BlogAnalyticsData, b: BlogAnalyticsData): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
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
  options: UseAnalyticsOptions = {},
): UseBlogAnalyticsReturn {
  const {
    trackReadProgress = true,
    trackTimeSpent = true,
    progressThreshold = 50, // Track when user reads 50% of content
  } = options
  const coercedProgressThreshold = Number(progressThreshold)
  const normalizedProgressThreshold = Math.max(
    0,
    Math.min(
      100,
      Number.isFinite(coercedProgressThreshold) ? coercedProgressThreshold : 0,
    ),
  )

  const startTime = useRef<number | null>(null)
  const hasTrackedProgress = useRef<boolean>(false)
  const maxScrollProgress = useRef<number>(0)

  // Store data in ref for use in callbacks
  const dataRef = useRef<BlogAnalyticsData>(data)

  // Initialize startTime on mount and sync dataRef
  useEffect(() => {
    startTime.current = Date.now()
  }, [])

  // Update dataRef when data changes
  useEffect(() => {
    if (!isDataEqual(dataRef.current, data)) {
      dataRef.current = data
    }
  }, [data])

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
    [], // No dependencies - uses stable dataRef.current
  )

  useEffect(() => {
    // Setup consent cache invalidation listener
    const cleanupConsentListener = setupConsentCacheInvalidation()

    if (!trackReadProgress && !trackTimeSpent) {
      return cleanupConsentListener
    }

    let throttleTimer: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (!trackReadProgress || !getCachedAnalyticsConsent()) return

      if (throttleTimer) return

      throttleTimer = setTimeout(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop
        const documentHeight =
          document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress =
          documentHeight > 0
            ? Math.min((scrollTop / documentHeight) * 100, 100)
            : 0

        // Track the maximum scroll progress
        maxScrollProgress.current = Math.max(
          maxScrollProgress.current,
          scrollProgress,
        )

        // Track when user reaches the progress threshold
        if (
          !hasTrackedProgress.current &&
          scrollProgress >= normalizedProgressThreshold
        ) {
          hasTrackedProgress.current = true
          const timeSpent =
            trackTimeSpent && startTime.current
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
      const timeSpent =
        trackTimeSpent && startTime.current
          ? Math.round((Date.now() - startTime.current) / 1000)
          : undefined

      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/blog-read',
          new Blob(
            [
              JSON.stringify({
                slug: dataRef.current.slug,
                category: dataRef.current.category,
                title: dataRef.current.title,
                readProgress: maxScrollProgress.current,
                timeSpent,
              }),
            ],
            { type: 'application/json' },
          ),
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
    normalizedProgressThreshold,
    trackEvent, // Include trackEvent but it's now stable (no deps) so won't cause re-renders
  ])

  return {
    trackEvent,
  }
}
