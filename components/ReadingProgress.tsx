'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ReadingProgressProps {
  target?: string // CSS selector for the content area to track
  endTarget?: string // CSS selector for the element where reading should be considered complete (e.g., author bio)
  readingProgressText?: string // Localized text for the tooltip
}

const ReadingProgress = ({
  target = '.prose',
  endTarget,
  readingProgressText = 'Reading Progress',
}: ReadingProgressProps) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showOnLeft, setShowOnLeft] = useState(true)

  // Cache DOM refs to avoid querying on every scroll event
  const targetRef = useRef<Element | null>(null)
  const endTargetRef = useRef<Element | null>(null)
  const sidebarRef = useRef<Element | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    // Query DOM elements once on mount / when selectors change
    targetRef.current = document.querySelector(target)
    endTargetRef.current = endTarget
      ? document.querySelector(endTarget)
      : null
    sidebarRef.current = document.querySelector('.lg\\:col-span-1')

    const updateScrollProgress = () => {
      const targetElement = targetRef.current

      // Check if sidebar is visible (on large screens and has content)
      const sidebar = sidebarRef.current
      const isLargeScreen = window.innerWidth >= 1024 // lg breakpoint
      const sidebarVisible =
        sidebar && isLargeScreen && getComputedStyle(sidebar).display !== 'none'

      // Only show on left if sidebar is visible, otherwise show on right
      setShowOnLeft(!!sidebarVisible)

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
          endElement.getBoundingClientRect().top +
          window.scrollY -
          windowHeight
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
          range === 0
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
    <>
      {/* Top Progress Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isVisible ? scrollProgress / 100 : 0 }}
        transition={{ duration: 0.1 }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 z-50 origin-left"
        style={{ transformOrigin: 'left' }}
      />

      {/* Circular Progress Indicator (Dynamic positioning) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-8 z-40 transition-all duration-300 ${
          showOnLeft ? 'left-8' : 'right-8'
        }`}
      >
        <div className="relative w-14 h-14 group cursor-pointer">
          {/* Background Circle */}
          <svg className="w-14 h-14 transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
              className="text-primary-600 dark:text-primary-400 transition-all duration-300"
              style={{
                strokeLinecap: 'round',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          </svg>

          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {Math.round(scrollProgress)}%
            </span>
          </div>

          {/* Background Circle for Better Visibility */}
          <div className="absolute inset-0 -z-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700" />

          {/* Tooltip */}
          <div
            className={`absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
              showOnLeft ? 'left-0' : 'right-0'
            }`}
          >
            <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              {readingProgressText}
              <div
                className={`absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100 ${
                  showOnLeft ? 'left-4' : 'right-4'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default ReadingProgress
