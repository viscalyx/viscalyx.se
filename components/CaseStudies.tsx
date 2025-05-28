'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Clock, Users, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const CaseStudies = () => {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('caseStudies')

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

  const caseStudies = [
    {
      title: t('cases.0.title'),
      client: t('cases.0.client'),
      industry: t('cases.0.industry'),
      challenge: t('cases.0.challenge'),
      solution: t('cases.0.solution'),
      results: [
        t('cases.0.results.0'),
        t('cases.0.results.1'),
        t('cases.0.results.2'),
        t('cases.0.results.3'),
      ],
      technologies: [
        t('cases.0.technologies.0'),
        t('cases.0.technologies.1'),
        t('cases.0.technologies.2'),
        t('cases.0.technologies.3'),
      ],
      duration: t('cases.0.duration'),
      teamSize: t('cases.0.teamSize'),
    },
    {
      title: t('cases.1.title'),
      client: t('cases.1.client'),
      industry: t('cases.1.industry'),
      challenge: t('cases.1.challenge'),
      solution: t('cases.1.solution'),
      results: [
        t('cases.1.results.0'),
        t('cases.1.results.1'),
        t('cases.1.results.2'),
        t('cases.1.results.3'),
      ],
      technologies: [
        t('cases.1.technologies.0'),
        t('cases.1.technologies.1'),
        t('cases.1.technologies.2'),
        t('cases.1.technologies.3'),
      ],
      duration: t('cases.1.duration'),
      teamSize: t('cases.1.teamSize'),
    },
    {
      title: t('cases.2.title'),
      client: t('cases.2.client'),
      industry: t('cases.2.industry'),
      challenge: t('cases.2.challenge'),
      solution: t('cases.2.solution'),
      results: [
        t('cases.2.results.0'),
        t('cases.2.results.1'),
        t('cases.2.results.2'),
        t('cases.2.results.3'),
      ],
      technologies: [
        t('cases.2.technologies.0'),
        t('cases.2.technologies.1'),
        t('cases.2.technologies.2'),
        t('cases.2.technologies.3'),
      ],
      duration: t('cases.2.duration'),
      teamSize: t('cases.2.teamSize'),
    },
  ]

  const images = [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center',
  ]

  return (
    <section className="section-padding bg-white dark:bg-secondary-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
            {t('title')}{' '}
            <span className="text-gradient">{t('titleHighlight')}</span>
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        <div className="space-y-20">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
              >
                <div className="relative h-96 rounded-2xl overflow-hidden group">
                  <Image
                    src={images[index]}
                    alt={study.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Floating Stats */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm rounded-lg p-3 text-center">
                        <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {study.duration}
                        </div>
                      </div>
                      <div className="bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm rounded-lg p-3 text-center">
                        <Users className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {study.teamSize}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="mb-4">
                  <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                    {study.industry}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                  {study.title}
                </h3>

                <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-6">
                  <strong>{t('clientLabel')}</strong> {study.client}
                </p>

                {/* Challenge & Solution */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      {t('challengeTitle')}
                    </h4>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {study.challenge}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      {t('solutionTitle')}
                    </h4>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                    {t('keyResultsTitle')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {study.results.map((result, resultIndex) => (
                      <motion.div
                        key={resultIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: resultIndex * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-secondary-700 dark:text-secondary-300 text-sm">
                          {result}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                    {t('technologiesTitle')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map(tech => (
                      <span
                        key={tech}
                        className="bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('cta.title')}
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => handleNavigation('#contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-primary-50"
              >
                {t('cta.startProject')}
              </motion.button>
              <motion.button
                onClick={() => handleNavigation('/case-studies')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-600"
              >
                {t('cta.viewAll')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CaseStudies
