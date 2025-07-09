'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import OpenSource from '@/components/OpenSource'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

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
      <Services />
      <Testimonials />
      <OpenSource />
      <Contact />
      <Footer />
      <ScrollToTop />
    </motion.main>
  )
}
