'use client'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TocItem } from '@/lib/slug-utils'
import { ChevronDownIcon, ChevronUpIcon } from './BlogIcons'

interface TableOfContentsProps {
  items: TocItem[]
  maxHeight?: 'sm' | 'lg' // sm for mobile (max-h-64), lg for desktop (max-h-80)
  headingId?: string // ID of the heading element that labels this table of contents
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  maxHeight = 'lg',
  headingId,
}) => {
  const t = useTranslations('blog.post')
  const [activeId, setActiveId] = useState<string>('')
  const [canScrollUp, setCanScrollUp] = useState<boolean>(false)
  const [canScrollDown, setCanScrollDown] = useState<boolean>(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const heightClass = maxHeight === 'sm' ? 'max-h-64' : 'max-h-80'

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -60% 0px', // Adjust based on header height and content visibility
        threshold: 0.1,
      }
    )

    // Observe all headings
    items.forEach(item => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [items])

  // Auto-scroll ToC to show active item
  useEffect(() => {
    if (activeId && scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(
        `button[data-id="${activeId}"]`
      ) as HTMLElement

      if (activeButton) {
        const container = scrollContainerRef.current
        const containerRect = container.getBoundingClientRect()
        const buttonRect = activeButton.getBoundingClientRect()

        // Check if the active button is outside the visible area
        const isAboveView = buttonRect.top < containerRect.top
        const isBelowView = buttonRect.bottom > containerRect.bottom

        if (isAboveView || isBelowView) {
          // Scroll to center the active item in the ToC container
          const buttonOffsetTop = activeButton.offsetTop
          const containerHeight = container.clientHeight
          const buttonHeight = activeButton.offsetHeight

          // Calculate scroll position to center the active item
          const scrollToPosition =
            buttonOffsetTop - containerHeight / 2 + buttonHeight / 2

          container.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth',
          })
        }
      }
    }
  }, [activeId])

  // Check scroll indicators
  const checkScrollIndicators = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current

      const canScrollUpValue = scrollTop > 0
      const canScrollDownValue = scrollTop < scrollHeight - clientHeight - 1

      // Only update state if values have changed to prevent unnecessary re-renders
      setCanScrollUp(prev =>
        prev !== canScrollUpValue ? canScrollUpValue : prev
      )
      setCanScrollDown(prev =>
        prev !== canScrollDownValue ? canScrollDownValue : prev
      )
    }
  }, [])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      // Check initially
      checkScrollIndicators()

      // Add scroll listener
      scrollContainer.addEventListener('scroll', checkScrollIndicators)

      // Check on resize (only if ResizeObserver is supported)
      let resizeObserver: ResizeObserver | null = null
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(checkScrollIndicators)
        resizeObserver.observe(scrollContainer)
      }

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollIndicators)
        if (resizeObserver) {
          resizeObserver.disconnect()
        }
      }
    }
  }, [items, checkScrollIndicators])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Update URL hash in the address bar
      window.history.pushState(null, '', `#${id}`)

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <nav
      className="relative"
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('tableOfContents') })}
    >
      {/* Top scroll indicator */}
      {canScrollUp && (
        <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-white dark:from-secondary-800 to-transparent pointer-events-none z-10 flex items-start justify-center">
          <ChevronUpIcon className="w-4 h-4 text-secondary-400 dark:text-secondary-500 mt-0.5 scroll-indicator" />
        </div>
      )}

      {/* Scrollable content */}
      <div
        ref={scrollContainerRef}
        className={`toc-scrollable ${heightClass} overflow-y-auto`}
        tabIndex={0}
        role="region"
        aria-label={t('tableOfContents')}
      >
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li
              key={index}
              className={`${
                item.level === 3 ? 'ml-4' : item.level === 4 ? 'ml-8' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => handleClick(item.id)}
                data-id={item.id}
                className={`text-left w-full transition-all duration-200 block py-2 px-3 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/30 ${
                  activeId === item.id
                    ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/30 border-l-2 border-primary-600 dark:border-primary-400'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
                aria-current={activeId === item.id ? 'location' : undefined}
              >
                <span className="text-sm leading-relaxed">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom scroll indicator */}
      {canScrollDown && (
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white dark:from-secondary-800 to-transparent pointer-events-none z-10 flex items-end justify-center">
          <ChevronDownIcon className="w-4 h-4 text-secondary-400 dark:text-secondary-500 mb-0.5 scroll-indicator" />
        </div>
      )}
    </nav>
  )
}

export default TableOfContents
