'use client'

import { useSectionNavigation } from '@/lib/use-section-navigation'
import { motion } from 'framer-motion'
import { Code, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Hero = () => {
  const { handleNavigation } = useSectionNavigation()
  const t = useTranslations('hero')

  // Images representing productivity, automation, and business processes
  const heroImages = [
    {
      src: '/calm-productive-engineering-culture.png',
      alt: 'A man in glasses works at a tidy desk with a raised laptop and large monitor showing code, while another coworker focuses at a side-by-side desk in the background of a bright, plant-filled office.',
    },
    {
      src: '/laptop-rising-market-chart-modern-office.png',
      alt: 'Side-angle close-up of a laptop displaying a rising financial market chart in a blurred glass office.',
    },
    {
      src: '/laptop-analytics-dashboard-glossy-table.png',
      alt: 'Open silver laptop on a glossy table displaying a web analytics dashboard with KPIs and charts.',
    },
    {
      src: '/collaborative-planning-hands-diagram-laptops.png',
      alt: 'Two people collaborate over a diagram-filled sheet of paper, one pointing with a pencil while laptops and pens surround the workspace.',
    },
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoadErrors, setImageLoadErrors] = useState<boolean[]>(
    new Array(heroImages.length).fill(false)
  )
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(heroImages.length).fill(false)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => {
      const newErrors = [...prev]
      newErrors[index] = true
      return newErrors
    })
  }

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newLoaded = [...prev]
      newLoaded[index] = true
      return newLoaded
    })
  }

  return (
    <section className="hero-section gradient-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-primary-200/30 to-primary-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-tr from-secondary-200/30 to-secondary-400/20 rounded-full blur-3xl hidden md:block"
        />
      </div>

      <div className="container-custom section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400"
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">{t('badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              {t('title')}
              <span className="text-gradient block">{t('titleHighlight')}</span>
              {t('titleEnd')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-2xl"
            >
              {t('description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={() => handleNavigation('#about')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center justify-center"
              >
                {t('buttons.learnMore')}
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-secondary-200 dark:border-secondary-700"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {t('stats.experience.value')}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400">
                  {t('stats.experience.label')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {t('stats.automation.value')}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400">
                  {t('stats.automation.label')}
                </div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-primary-600">
                  {t('stats.openSource.value')}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400">
                  {t('stats.openSource.label')}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-3/4 w-full max-w-md mx-auto">
                  {heroImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: index === currentImageIndex ? 1 : 0,
                        scale: index === currentImageIndex ? 1 : 1.05,
                      }}
                      transition={{
                        duration: 1,
                        ease: 'easeInOut',
                      }}
                      className={`absolute inset-0 ${index === currentImageIndex ? 'z-10' : 'z-0'}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className={`rounded-2xl shadow-2xl object-cover transition-opacity duration-300 ${
                          imagesLoaded[index] ? 'opacity-100' : 'opacity-0'
                        }`}
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        onError={() => handleImageError(index)}
                        onLoad={() => handleImageLoad(index)}
                      />

                      {/* Loading placeholder */}
                      {!imagesLoaded[index] && !imageLoadErrors[index] && (
                        <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                      )}

                      {/* Error fallback */}
                      {imageLoadErrors[index] && (
                        <div className="absolute inset-0 bg-linear-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <Code className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                            <p className="text-primary-700 dark:text-primary-300 font-medium">
                              {t('errorFallback')}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Image overlay for better contrast with floating elements */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-black/10 rounded-2xl z-20" />
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                  {heroImages.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Show image ${index + 1} of ${heroImages.length}`}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'bg-white shadow-lg'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 -z-10 w-3/4 h-16 hidden md:block bg-primary-500/50 dark:bg-primary-400/35 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
