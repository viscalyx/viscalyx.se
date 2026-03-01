'use client'

import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import Team from '@/components/Team'

const TeamPageClient = () => {
  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="min-h-screen"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
