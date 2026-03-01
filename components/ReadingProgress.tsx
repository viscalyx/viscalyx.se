'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

interface ComponentProps {
  endTarget?: string // CSS selector for the element where reading should be considered complete (e.g., author bio)
  target?: string // CSS selector for the content area to track
}

function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0
  }
  return Math.min(Math.max(progress, 0), 100)
}

const ReadingProgress = ({ target = '.prose', endTarget }: ComponentProps) => {
  const t = useTranslations('readingProgress')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Cache DOM refs to avoid querying on every scroll event
  const targetRef = useRef<Element | null>(null)
  const endTargetRef = useRef<Element | null>(null)
  const rafId = useRef<number>(0)
  // Track invalid selectors to avoid re-querying on every scroll tick
  const targetSelectorInvalidRef = useRef(false)
  const endTargetSelectorInvalidRef = useRef(false)

  useEffect(() => {
    // Reset invalid-selector flags when selectors change
    targetSelectorInvalidRef.current = false
    endTargetSelectorInvalidRef.current = false

    // Query DOM elements once on mount / when selectors change
    try {
      targetRef.current = document.querySelector(target)
    } catch {
      targetRef.current = null
      targetSelectorInvalidRef.current = true
    }
    try {
      endTargetRef.current = endTarget
        ? document.querySelector(endTarget)
        : null
    } catch {
      endTargetRef.current = null
      endTargetSelectorInvalidRef.current = true
    }

    const updateScrollProgress = () => {
      // Lazily re-query refs that haven't been found yet (handles lazy rendering)
      if (
        !targetSelectorInvalidRef.current &&
        (!targetRef.current || !targetRef.current.isConnected)
      ) {
        try {
          targetRef.current = document.querySelector(target)
        } catch {
          targetRef.current = null
          targetSelectorInvalidRef.current = true
        }
      }
      if (
        endTarget &&
        !endTargetSelectorInvalidRef.current &&
        (!endTargetRef.current || !endTargetRef.current.isConnected)
      ) {
        try {
          endTargetRef.current = document.querySelector(endTarget)
        } catch {
          endTargetRef.current = null
          endTargetSelectorInvalidRef.current = true
        }
      }

      const targetElement = targetRef.current

      if (!targetElement) {
        // Fallback to full page scroll
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight
        const progress =
          totalHeight > 0
            ? Math.min((window.scrollY / totalHeight) * 100, 100)
            : 0
        setScrollProgress(clampProgress(progress))
        setIsVisible(window.scrollY > 100)
        return
      }

      // Calculate progress based on the target element
      const targetRect = targetElement.getBoundingClientRect()
      const elementTop = targetRect.top + window.scrollY
      const elementHeight =
        targetElement instanceof HTMLElement
          ? targetElement.offsetHeight
          : targetRect.height
      const windowHeight = window.innerHeight
      const maxScrollableY = Math.max(
        document.documentElement.scrollHeight - windowHeight,
        0,
      )

      // Start tracking when the element comes into view
      const startPoint = elementTop - windowHeight

      // If endTarget is specified, use it to determine where 100% should be reached
      let endPoint = elementTop + elementHeight
      const endElement = endTargetRef.current
      if (endElement) {
        endPoint = endElement.getBoundingClientRect().top + window.scrollY
      }
      if (maxScrollableY > 0) {
        endPoint = Math.min(endPoint, maxScrollableY)
      }

      // Guard against invalid geometry that can force the bar to remain full.
      if (!Number.isFinite(endPoint) || endPoint < startPoint) {
        endPoint = startPoint + Math.max(elementHeight, windowHeight, 1)
      }

      const currentScroll = window.scrollY
      const isAtPageBottom =
        maxScrollableY > 0 && currentScroll >= maxScrollableY - 1

      if (isAtPageBottom) {
        setScrollProgress(100)
        setIsVisible(true)
        return
      }

      if (currentScroll < startPoint) {
        setScrollProgress(0)
        setIsVisible(false)
      } else if (currentScroll >= endPoint) {
        setScrollProgress(100)
        setIsVisible(true)
      } else {
        const range = endPoint - startPoint
        const progress =
          Math.abs(range) < 0.0001
            ? 0
            : ((currentScroll - startPoint) / range) * 100
        setScrollProgress(clampProgress(progress))
        setIsVisible(true)
      }
    }

    const handleScroll = () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(updateScrollProgress)
    }

    // Update on mount
    updateScrollProgress()

    // Add scroll listener with RAF throttle
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [target, endTarget])

  return (
    <div
      aria-label={t('ariaLabel')}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(clampProgress(scrollProgress))}
      className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 z-50 origin-left will-change-transform transition-transform duration-100 ease-linear"
      role="progressbar"
      style={{
        transform: `scaleX(${isVisible ? scrollProgress / 100 : 0})`,
      }}
    />
  )
}

export default ReadingProgress
