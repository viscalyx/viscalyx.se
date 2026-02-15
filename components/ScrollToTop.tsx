'use client'

import { motion } from 'framer-motion'
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
    <>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={t('ariaLabel')}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </>
  )
}

export default ScrollToTop
