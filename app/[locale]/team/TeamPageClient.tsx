'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import Team from '@/components/Team'

const TeamPageClient = () => {
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

export default TeamPageClient
