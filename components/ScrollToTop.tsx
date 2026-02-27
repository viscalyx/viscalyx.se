'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

const ScrollToTop = () => {
  const t = useTranslations('scrollToTop')
  const [isVisible, setIsVisible] = useState(false)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const toggleVisibility = () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 300)
      })
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          animate={{ opacity: 1, scale: 1 }}
          aria-label={t('ariaLabel')}
          className="fixed bottom-24 right-8 z-50 bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-900"
          exit={{ opacity: 0, scale: 0 }}
          initial={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
