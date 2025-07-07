'use client'

import { motion, useInView } from 'framer-motion'
import {
  Cloud,
  Code,
  Database,
  Layers,
  Settings,
  Shield,
  Terminal,
  TrendingUp,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRef } from 'react'

const Expertise = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const t = useTranslations('expertise')

  const technologies = [
    {
      name: t('technologies.powershell'),
      level: 95,
      icon: Terminal,
      color: 'bg-[#3b82f6]', // viz-1
    },
    {
      name: t('technologies.powershellDsc'),
      level: 92,
      icon: Settings,
      color: 'bg-[#6366f1]', // viz-2
    },
    {
      name: t('technologies.azureDevOps'),
      level: 88,
      icon: Cloud,
      color: 'bg-[#0ea5e9]', // viz-3
    },
    {
      name: t('technologies.docker'),
      level: 85,
      icon: Layers,
      color: 'bg-[#06b6d4]', // viz-4
    },
    {
      name: t('technologies.gitGithub'),
      level: 90,
      icon: Code,
      color: 'bg-[#4b5563]', // viz-8
    },
    {
      name: t('technologies.sqlServer'),
      level: 82,
      icon: Database,
      color: 'bg-[#ef4444]', // viz-5
    },
    {
      name: t('technologies.security'),
      level: 86,
      icon: Shield,
      color: 'bg-[#22c55e]', // viz-6
    },
    {
      name: t('technologies.performance'),
      level: 89,
      icon: TrendingUp,
      color: 'bg-[#a855f7]', // viz-7
    },
  ]

  const certifications: string[] = t.raw('certificationsList')

  return (
    <section
      id="expertise"
      className="section-padding bg-white dark:bg-secondary-900"
      ref={ref}
    >
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
            {t('subtitle')}
            <span className="text-gradient block">
              {t('subtitleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Technologies & Skills */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-8">
                {t('title')}
              </h3>
              <div className="space-y-6">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${tech.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <tech.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {tech.name}
                        </span>
                      </div>
                      <span className="text-secondary-600 dark:text-secondary-400 font-medium">
                        {tech.level}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${tech.level}%` } : {}}
                        transition={{
                          delay: index * 0.1 + 0.5,
                          duration: 1,
                          ease: 'easeOut',
                        }}
                        className={`h-2 rounded-full ${tech.color} relative`}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-800/50 rounded-2xl p-6"
            >
              <h4 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                {t('certifications.title')}
              </h4>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full" />
                    <span className="text-secondary-700 dark:text-secondary-300">
                      {cert}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual & Experience */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Main Image */}
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 2, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                  alt={t('imageAlt')}
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
                />
              </motion.div>

              {/* Floating Experience Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700 z-20"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {t('stats.experience.value')}
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('stats.experience.label')}
                  </div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                    {t('stats.experience.sublabel')}
                  </div>
                </div>
              </motion.div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-2xl blur-3xl transform scale-110 -z-10" />
            </div>

            {/* Experience Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {t('stats.projects.value')}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t('stats.projects.label')}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 }}
                className="bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {t('stats.satisfaction.value')}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t('stats.satisfaction.label')}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 }}
                className="bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {t('stats.uptime.value')}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t('stats.uptime.label')}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 }}
                className="bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {t('stats.openSource.value')}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t('stats.openSource.label')}
                </div>
              </motion.div>
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-r from-primary-600 to-secondary-700 text-white rounded-2xl p-6"
            >
              <blockquote className="text-lg font-medium leading-relaxed">
                &ldquo;{t('quote.text')}&rdquo;
              </blockquote>
              <div className="mt-4 text-primary-100">— {t('quote.author')}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Expertise
