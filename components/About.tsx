'use client'

import { motion, useInView } from 'framer-motion'
import { Award, Lightbulb, Target, Users } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

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
      className="section-padding bg-white dark:bg-secondary-900 relative overflow-hidden"
      id="about"
      ref={ref}
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.span
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-primary-600 dark:text-primary-400 font-semibold text-lg"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
              >
                {t('badge')}
              </motion.span>
              <motion.h2
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mt-2"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
              >
                {t('title')}
                <span className="text-gradient block">
                  {t('titleHighlight')}
                </span>
              </motion.h2>
            </div>

            <motion.p
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
            >
              {t('description1')}
            </motion.p>

            <motion.p
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
            >
              {t('description2')}
            </motion.p>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-8">
              {values.map((value, index) => (
                <motion.div
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  key={value.title}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="shrink-0">
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
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                className="relative z-10"
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Image
                  alt={t('visualAlt')}
                  className="rounded-2xl shadow-xl"
                  height={400}
                  src="/team-huddle-open-office-wide.png"
                  width={600}
                />
              </motion.div>

              {/* Floating Stats */}
              <motion.div
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                className="absolute -bottom-8 left-1/2 w-fit max-w-[calc(100%-2rem)] -translate-x-1/2 bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700 z-20 lg:w-auto lg:max-w-none lg:translate-x-0 lg:-left-8"
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {t('stats.taskReduction.value')}
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {t('stats.taskReduction.label')}
                    </div>
                  </div>
                  <div className="w-px self-stretch bg-secondary-200 dark:bg-secondary-600" />
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
              <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-primary-100/30 dark:from-primary-900/20 to-secondary-100/30 dark:to-secondary-800/20 rounded-2xl blur-3xl transform scale-110" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
