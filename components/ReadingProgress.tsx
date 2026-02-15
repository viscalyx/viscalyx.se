'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ReadingProgressProps {
  target?: string // CSS selector for the content area to track
  endTarget?: string // CSS selector for the element where reading should be considered complete (e.g., author bio)
}

const ReadingProgress = ({
  target = '.prose',
  endTarget,
}: ReadingProgressProps) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Cache DOM refs to avoid querying on every scroll event
  const targetRef = useRef<Element | null>(null)
  const endTargetRef = useRef<Element | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    // Query DOM elements once on mount / when selectors change
    targetRef.current = document.querySelector(target)
    endTargetRef.current = endTarget ? document.querySelector(endTarget) : null

    const updateScrollProgress = () => {
      // Lazily re-query refs that haven't been found yet (handles lazy rendering)
      if (!targetRef.current) {
        targetRef.current = document.querySelector(target)
      }
      if (!endTargetRef.current && endTarget) {
        endTargetRef.current = document.querySelector(endTarget)
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
        setScrollProgress(progress)
        setIsVisible(window.scrollY > 100)
        return
      }

      // Calculate progress based on the target element
      const elementTop =
        targetElement.getBoundingClientRect().top + window.scrollY
      const elementHeight = (targetElement as HTMLElement).offsetHeight
      const windowHeight = window.innerHeight

      // Start tracking when the element comes into view
      const startPoint = elementTop - windowHeight

      // If endTarget is specified, use it to determine where 100% should be reached
      let endPoint = elementTop + elementHeight
      const endElement = endTargetRef.current
      if (endElement) {
        endPoint =
          endElement.getBoundingClientRect().top + window.scrollY - windowHeight
      }

      const currentScroll = window.scrollY

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
        setScrollProgress(Math.min(Math.max(progress, 0), 100))
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
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isVisible ? scrollProgress / 100 : 0 }}
      transition={{ duration: 0.1 }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 z-50 origin-left"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}

export default ReadingProgress
