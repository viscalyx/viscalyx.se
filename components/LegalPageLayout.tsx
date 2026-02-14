'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { motion } from 'framer-motion'
import { useFormatter } from 'next-intl'

import type { ReactNode } from 'react'

interface LegalPageLayoutProps {
  title: string
  subtitle: string
  lastUpdatedLabel: string
  lastUpdatedDate: Date
  children: ReactNode
}

const LegalPageLayout = ({
  title,
  subtitle,
  lastUpdatedLabel,
  lastUpdatedDate,
  children,
}: LegalPageLayoutProps) => {
  const format = useFormatter()

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-secondary-900"
    >
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg section-padding pt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
              {title}
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {subtitle}
            </p>
            <p className="text-secondary-500 dark:text-secondary-500">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
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
