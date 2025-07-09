'use client'

import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import OpenSource from '@/components/OpenSource'
import ScrollToTop from '@/components/ScrollToTop'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Header />
      <Hero />
      <About />
      <OpenSource />
      <Contact />
      <Footer />
      <ScrollToTop />
    </motion.main>
  )
}
