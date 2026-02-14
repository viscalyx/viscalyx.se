'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Users, Lightbulb, Award } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const t = useTranslations('about')

  const values = [
    {
      icon: Target,
      title: t('values.precision.title'),
      description: t('values.precision.description'),
    },
    {
      icon: Users,
      title: t('values.clientCentric.title'),
      description: t('values.clientCentric.description'),
    },
    {
      icon: Lightbulb,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
    },
    {
      icon: Award,
      title: t('values.openSource.title'),
      description: t('values.openSource.description'),
    },
  ]

  return (
    <section
      id="about"
      className="section-padding bg-white dark:bg-secondary-900"
      ref={ref}
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-primary-600 dark:text-primary-400 font-semibold text-lg"
              >
                {t('badge')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mt-2"
              >
                {t('title')}
                <span className="text-gradient block">
                  {t('titleHighlight')}
                </span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              {t('description1')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              {t('description2')}
            </motion.p>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <value.icon className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                      {value.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <Image
                  src="/team-huddle-open-office-wide.png"
                  alt={t('visualAlt')}
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
                />
              </motion.div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700 z-20"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {t('stats.taskReduction.value')}
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {t('stats.taskReduction.label')}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-secondary-200 dark:bg-secondary-600" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {t('stats.automation.value')}
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {t('stats.automation.label')}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Background Element */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 dark:from-primary-900/20 to-secondary-100/30 dark:to-secondary-800/20 rounded-2xl blur-3xl transform scale-110 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
