'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Team from '@/components/Team'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function TeamPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Header />
      <div className="pt-20">
        <Team />
      </div>
      <Footer />
      <ScrollToTop />
    </motion.main>
  )
}
