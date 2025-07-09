'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const updateScrollProgress = () => {
      const targetElement = document.querySelector(target)

      // Check if sidebar is visible (on large screens and has content)
      const sidebar = document.querySelector('.lg\\:col-span-1')
      const isLargeScreen = window.innerWidth >= 1024 // lg breakpoint
      const sidebarVisible =
        sidebar && isLargeScreen && getComputedStyle(sidebar).display !== 'none'

      // Only show on left if sidebar is visible, otherwise show on right
      setShowOnLeft(!!sidebarVisible)

      if (!targetElement) {
        // Fallback to full page scroll
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight
        const progress = Math.min((window.scrollY / totalHeight) * 100, 100)
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
      if (endTarget) {
        const endElement = document.querySelector(endTarget)
        if (endElement) {
          // Set 100% to be reached when we scroll to the beginning of the endTarget element
          // This means 100% is at the end of content, just before the author bio
          endPoint =
            endElement.getBoundingClientRect().top +
            window.scrollY -
            windowHeight
        }
      }

      const currentScroll = window.scrollY

      if (currentScroll < startPoint) {
        setScrollProgress(0)
        setIsVisible(false)
      } else if (currentScroll >= endPoint) {
        setScrollProgress(100)
        setIsVisible(true)
      } else {
        const progress =
          ((currentScroll - startPoint) / (endPoint - startPoint)) * 100
        setScrollProgress(Math.min(Math.max(progress, 0), 100))
        setIsVisible(true)
      }
    }

    // Update on mount
    updateScrollProgress()

    // Add scroll listener
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
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
              className="text-secondary-200 dark:text-secondary-700"
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
            <span className="text-xs font-bold text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {Math.round(scrollProgress)}%
            </span>
          </div>

          {/* Background Circle for Better Visibility */}
          <div className="absolute inset-0 -z-10 bg-white dark:bg-secondary-800 rounded-full shadow-lg border border-secondary-200 dark:border-secondary-700" />

          {/* Tooltip */}
          <div
            className={`absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
              showOnLeft ? 'left-0' : 'right-0'
            }`}
          >
            <div className="bg-secondary-900 dark:bg-secondary-100 text-white dark:text-secondary-900 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              {readingProgressText}
              <div
                className={`absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-secondary-900 dark:border-t-secondary-100 ${
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
