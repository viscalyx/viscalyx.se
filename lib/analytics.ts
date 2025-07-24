'use client'

import { useEffect, useRef, useCallback } from 'react'
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

  const trackEvent = useCallback(
    async (readProgress?: number, timeSpent?: number) => {
      // Only track if user has consented to analytics cookies
      if (!hasConsent('analytics')) {
        return
      }

      try {
        await fetch('/api/analytics/blog-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug: data.slug,
            category: data.category,
            title: data.title,
            readProgress,
            timeSpent,
          }),
        })
      } catch (error) {
        console.warn('Failed to track blog analytics:', error)
      }
    },
    [data.slug, data.category, data.title]
  )

  useEffect(() => {
    if (!trackReadProgress && !trackTimeSpent) return

    let throttleTimer: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (!trackReadProgress || !hasConsent('analytics')) return

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
      if (!hasConsent('analytics')) {
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
            slug: data.slug,
            category: data.category,
            title: data.title,
            readProgress: maxScrollProgress.current,
            timeSpent,
          })
        )
      }
    }

    const timeoutId = setTimeout(() => {
      if (trackTimeSpent && hasConsent('analytics')) {
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
    }
  }, [
    data.slug,
    data.category,
    data.title,
    trackReadProgress,
    trackTimeSpent,
    progressThreshold,
    trackEvent,
  ])

  return {
    trackEvent,
    maxScrollProgress: maxScrollProgress.current,
  }
}
