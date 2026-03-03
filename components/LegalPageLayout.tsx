'use client'

import { motion } from 'framer-motion'
import { useFormatter } from 'next-intl'
import type { ReactNode } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'

interface ComponentProps {
  children: ReactNode
  lastUpdatedDate: Date
  lastUpdatedLabel: string
  subtitle: string
  title: string
}

const LegalPageLayout = ({
  title,
  subtitle,
  lastUpdatedLabel,
  lastUpdatedDate,
  children,
}: ComponentProps) => {
  const format = useFormatter()

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-secondary-900"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg section-padding pt-32">
        <div className="container-custom">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
              {title}
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {subtitle}
            </p>
            <p className="text-secondary-500 dark:text-secondary-300">
              {lastUpdatedLabel}:{' '}
              {format.dateTime(lastUpdatedDate, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white dark:bg-secondary-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg dark:prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </motion.main>
  )
}

export default LegalPageLayout
