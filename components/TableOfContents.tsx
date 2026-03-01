'use client'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TocItem } from '@/lib/slug-utils-client'
import { ChevronDownIcon, ChevronUpIcon } from './BlogIcons'

interface TableOfContentsProps {
  headingId?: string // ID of the heading element that labels this table of contents
  items: TocItem[]
  maxHeight?: 'sm' | 'lg' // sm for mobile (max-h-64), lg for desktop (max-h-80)
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
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const itemsSignature = items
    .map(item => `${item.id}:${item.level}:${item.text}`)
    .join('|')

  const heightClass = maxHeight === 'sm' ? 'max-h-64' : 'max-h-80'

  useEffect(() => {
    const observedHeadings = new Set<Element>()
    const headingMap = new Map<string, HTMLElement>()
    let observer: IntersectionObserver | null = null
    let mutationObserver: MutationObserver | null = null
    let rafId: number | null = null

    const setActiveFromScrollPosition = () => {
      const headingsByPosition = items
        .map(item => document.getElementById(item.id))
        .filter(
          (heading): heading is HTMLElement => heading instanceof HTMLElement,
        )
        .map(heading => ({
          id: heading.id,
          top: heading.getBoundingClientRect().top,
        }))
        .sort((headingA, headingB) => headingA.top - headingB.top)

      if (headingsByPosition.length === 0) {
        return
      }

      // Compensate for sticky header height so "current section" feels accurate.
      const topOffset = 140
      const firstHeadingBelowOffsetIndex = headingsByPosition.findIndex(
        heading => heading.top > topOffset,
      )

      const currentHeadingId =
        firstHeadingBelowOffsetIndex === -1
          ? headingsByPosition.at(-1)?.id
          : firstHeadingBelowOffsetIndex === 0
            ? headingsByPosition[0]?.id
            : headingsByPosition[firstHeadingBelowOffsetIndex - 1]?.id

      if (!currentHeadingId) {
        return
      }

      setActiveId(previousId =>
        previousId !== currentHeadingId ? currentHeadingId : previousId,
      )
    }

    const queueScrollPositionUpdate = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        setActiveFromScrollPosition()
      })
    }

    const observeAvailableHeadings = () => {
      items.forEach(item => {
        const element = document.getElementById(item.id)
        if (!element) return

        const previousElement = headingMap.get(item.id)
        if (previousElement && previousElement !== element) {
          observer?.unobserve(previousElement)
          observedHeadings.delete(previousElement)
        }
        headingMap.set(item.id, element)

        if (observer && !observedHeadings.has(element)) {
          observer.observe(element)
          observedHeadings.add(element)
        }
      })
    }

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            setActiveFromScrollPosition()
          }
        },
        {
          rootMargin: '-100px 0px -60% 0px', // Adjust based on header height and content visibility
          threshold: 0.1,
        },
      )
    }

    observeAvailableHeadings()
    queueScrollPositionUpdate()

    if (typeof MutationObserver !== 'undefined' && document.body) {
      mutationObserver = new MutationObserver(() => {
        observeAvailableHeadings()
        queueScrollPositionUpdate()
      })
      const observeTarget = document.querySelector('main') ?? document.body
      mutationObserver.observe(observeTarget, {
        childList: true,
        subtree: true,
      })
    }

    window.addEventListener('scroll', queueScrollPositionUpdate, {
      passive: true,
    })
    window.addEventListener('resize', queueScrollPositionUpdate)

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', queueScrollPositionUpdate)
      window.removeEventListener('resize', queueScrollPositionUpdate)
      mutationObserver?.disconnect()
      observer?.disconnect()
    }
  }, [items])

  // Auto-scroll ToC to show active item
  useEffect(() => {
    if (activeId && scrollContainerRef.current) {
      const escapedId = CSS.escape(activeId)
      const activeButton = scrollContainerRef.current.querySelector(
        `button[data-id="${escapedId}"]`,
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
        prev !== canScrollUpValue ? canScrollUpValue : prev,
      )
      setCanScrollDown(prev =>
        prev !== canScrollDownValue ? canScrollDownValue : prev,
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
  }, [checkScrollIndicators])

  useEffect(() => {
    // Force indicator refresh when ToC content changes even without a resize event.
    void itemsSignature
    checkScrollIndicators()
  }, [checkScrollIndicators, itemsSignature])

  const handleTocKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const lineHeight = 40
    const pageHeight = scrollContainer.clientHeight - lineHeight

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        scrollContainer.scrollBy({ top: lineHeight, behavior: 'smooth' })
        break
      case 'ArrowUp':
        event.preventDefault()
        scrollContainer.scrollBy({ top: -lineHeight, behavior: 'smooth' })
        break
      case 'PageDown':
        event.preventDefault()
        scrollContainer.scrollBy({ top: pageHeight, behavior: 'smooth' })
        break
      case 'PageUp':
        event.preventDefault()
        scrollContainer.scrollBy({ top: -pageHeight, behavior: 'smooth' })
        break
      case 'Home':
        event.preventDefault()
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
        break
      case 'End':
        event.preventDefault()
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        })
        break
      default:
        break
    }
  }

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
      <section
        aria-label={t('tableOfContents')}
        className={`toc-scrollable ${heightClass} overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-800`}
        onKeyDown={handleTocKeyDown}
        ref={scrollContainerRef}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Required so keyboard users can focus and scroll this overflow region.
        tabIndex={0}
      >
        <ul className="space-y-1">
          {items.map(item => (
            <li
              className={`${
                item.level === 3 ? 'ml-4' : item.level === 4 ? 'ml-8' : ''
              }`}
              key={item.id}
            >
              <button
                aria-current={activeId === item.id ? 'location' : undefined}
                className={`text-left w-full min-h-[44px] min-w-[44px] transition-all duration-200 block py-2 px-3 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/30 ${
                  activeId === item.id
                    ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/30 border-l-2 border-primary-600 dark:border-primary-400'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
                data-id={item.id}
                onClick={() => handleClick(item.id)}
                type="button"
              >
                <span className="text-sm leading-relaxed">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

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
