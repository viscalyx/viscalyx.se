'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Cog,
  Server,
  GitBranch,
  Shield,
  Zap,
  Database,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('services')

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

  const services = [
    {
      icon: Cog,
      title: t('items.taskAutomation.title'),
      description: t('items.taskAutomation.description'),
      features: [
        t('items.taskAutomation.features.0'),
        t('items.taskAutomation.features.1'),
        t('items.taskAutomation.features.2'),
        t('items.taskAutomation.features.3'),
      ],
      color: 'primary',
    },
    {
      icon: Server,
      title: t('items.devOpsSolutions.title'),
      description: t('items.devOpsSolutions.description'),
      features: [
        t('items.devOpsSolutions.features.0'),
        t('items.devOpsSolutions.features.1'),
        t('items.devOpsSolutions.features.2'),
        t('items.devOpsSolutions.features.3'),
      ],
      color: 'secondary',
    },
    {
      icon: GitBranch,
      title: t('items.powershellDsc.title'),
      description: t('items.powershellDsc.description'),
      features: [
        t('items.powershellDsc.features.0'),
        t('items.powershellDsc.features.1'),
        t('items.powershellDsc.features.2'),
        t('items.powershellDsc.features.3'),
      ],
      color: 'primary',
    },
    {
      icon: Shield,
      title: t('items.securityAutomation.title'),
      description: t('items.securityAutomation.description'),
      features: [
        t('items.securityAutomation.features.0'),
        t('items.securityAutomation.features.1'),
        t('items.securityAutomation.features.2'),
        t('items.securityAutomation.features.3'),
      ],
      color: 'secondary',
    },
    {
      icon: Database,
      title: t('items.dataManagement.title'),
      description: t('items.dataManagement.description'),
      features: [
        t('items.dataManagement.features.0'),
        t('items.dataManagement.features.1'),
        t('items.dataManagement.features.2'),
        t('items.dataManagement.features.3'),
      ],
      color: 'primary',
    },
    {
      icon: Zap,
      title: t('items.performanceOptimization.title'),
      description: t('items.performanceOptimization.description'),
      features: [
        t('items.performanceOptimization.features.0'),
        t('items.performanceOptimization.features.1'),
        t('items.performanceOptimization.features.2'),
        t('items.performanceOptimization.features.3'),
      ],
      color: 'secondary',
    },
  ]

  return (
    <section id="services" className="section-padding gradient-bg" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mt-2 mb-6">
            {t('title')}
            <span className="text-gradient block">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-secondary-100 dark:border-secondary-700"
            >
              {/* Icon */}
              <div
                className={`inline-flex p-4 rounded-2xl mb-6 ${
                  service.color === 'primary'
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white'
                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 group-hover:bg-secondary-600 group-hover:text-white'
                } transition-all duration-300`}
              >
                <service.icon className="h-8 w-8" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-4 group-hover:text-primary-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      delay: index * 0.1 + featureIndex * 0.05 + 0.5,
                    }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span className="text-secondary-700 dark:text-secondary-300 text-sm">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-secondary-50 dark:bg-secondary-700 hover:bg-primary-600 text-secondary-700 dark:text-secondary-200 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group/btn"
              >
                {t('learnMore')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg border border-secondary-100 dark:border-secondary-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              {t('bottomCta.title')}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-2xl mx-auto">
              {t('bottomCta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => handleNavigation('#contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center justify-center"
              >
                {t('bottomCta.consultation')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
