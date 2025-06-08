'use client'

import { motion } from 'framer-motion'
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const t = useTranslations('testimonials')

  const testimonials = [
    {
      name: t('clients.0.name'),
      role: t('clients.0.role'),
      company: t('clients.0.company'),
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
      content: t('clients.0.content'),
      rating: 5,
      project: t('clients.0.project'),
    },
    {
      name: t('clients.1.name'),
      role: t('clients.1.role'),
      company: t('clients.1.company'),
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      content: t('clients.1.content'),
      rating: 5,
      project: t('clients.1.project'),
    },
    {
      name: t('clients.2.name'),
      role: t('clients.2.role'),
      company: t('clients.2.company'),
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
      content: t('clients.2.content'),
      rating: 5,
      project: t('clients.2.project'),
    },
    {
      name: t('clients.3.name'),
      role: t('clients.3.role'),
      company: t('clients.3.company'),
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
      content: t('clients.3.content'),
      rating: 5,
      project: t('clients.3.project'),
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-800">
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

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8 md:p-12 relative"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full">
              <Quote className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-xl md:text-2xl text-secondary-700 dark:text-secondary-300 leading-relaxed mb-8 italic">
              &ldquo;{testimonials[currentIndex].content}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="bg-primary-100 dark:bg-primary-900/50 px-4 py-2 rounded-full">
                  <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                    {testimonials[currentIndex].project}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white dark:bg-secondary-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              aria-label={t('navigation.previous')}
            >
              <ArrowLeft className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </motion.button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-600 dark:bg-primary-400'
                      : 'bg-secondary-300 dark:bg-secondary-600 hover:bg-secondary-400 dark:hover:bg-secondary-500'
                  }`}
                  aria-label={`${t('navigation.goTo')} ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white dark:bg-secondary-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              aria-label={t('navigation.next')}
            >
              <ArrowRight className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            {
              number: t('stats.happyClients.value'),
              label: t('stats.happyClients.label'),
            },
            {
              number: t('stats.projectsDelivered.value'),
              label: t('stats.projectsDelivered.label'),
            },
            {
              number: t('stats.clientSatisfaction.value'),
              label: t('stats.clientSatisfaction.label'),
            },
            {
              number: t('stats.supportAvailable.value'),
              label: t('stats.supportAvailable.label'),
            },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {stat.number}
              </div>
              <div className="text-secondary-600 dark:text-secondary-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
