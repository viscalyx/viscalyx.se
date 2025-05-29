'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Code } from 'lucide-react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

const Hero = () => {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('hero')

  // Images representing productivity, automation, and business processes
  const heroImages = [
    {
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=800&fit=crop&crop=faces&auto=format&q=80',
      alt: 'Team collaboration and productivity',
    },
    {
      src: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=800&fit=crop&crop=center&auto=format&q=80',
      alt: 'Business automation and technology',
    },
    {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop&crop=center&auto=format&q=80',
      alt: 'Data analysis and business intelligence',
    },
    {
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=800&fit=crop&crop=center&auto=format&q=80',
      alt: 'Professional workflow and processes',
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

  const handleNavigation = (href: string) => {
    // Check if it's a section link (starts with #)
    if (href.startsWith('#')) {
      // If we're not on the home page, navigate to home first
      if (pathname !== '/') {
        router.push(`/${href}`)
      } else {
        // We're already on home page, just scroll to section
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      // Regular page navigation
      router.push(href)
    }
  }

  return (
    <section className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
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
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-primary-400/20 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary-200/30 to-secondary-400/20 rounded-full blur-3xl"
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
                onClick={() => handleNavigation('#contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center justify-center group"
              >
                {t('buttons.startProject')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => handleNavigation('#services')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center justify-center"
              >
                {t('buttons.exploreServices')}
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
            className="relative"
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
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] w-full max-w-md mx-auto">
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
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                      )}

                      {/* Error fallback */}
                      {imageLoadErrors[index] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <Code className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                            <p className="text-primary-700 dark:text-primary-300 font-medium">
                              {image.alt}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Image overlay for better contrast with floating elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 rounded-2xl z-20" />
                </div>

                {/* Floating Elements */}
                {/* <motion.div
                  animate={{
                    rotate: [0, 360],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute -top-6 -right-6 bg-primary-600 p-4 rounded-2xl shadow-lg z-30"
                >
                  <Code className="h-8 w-8 text-white" />
                </motion.div> */}

                {/* <motion.div
                  animate={{
                    rotate: [360, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                    y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute -bottom-6 -left-6 bg-secondary-800 p-4 rounded-2xl shadow-lg z-30"
                >
                  <Zap className="h-8 w-8 text-white" />
                </motion.div> */}

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                  {heroImages.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-2xl blur-3xl transform scale-110" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
