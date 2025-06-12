'use client'

import { motion } from 'framer-motion'
import {
  Building,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const CaseStudiesPage = () => {
  const t = useTranslations('caseStudyDetails')
  const tListing = useTranslations('caseStudiesListing')

  const caseStudies = [
    {
      slug: 'enterprise-automation-platform',
      title: t('cases.enterprise-automation-platform.title'),
      client: t('cases.enterprise-automation-platform.client'),
      industry: t('cases.enterprise-automation-platform.industry'),
      challenge: t('cases.enterprise-automation-platform.challenge'),
      solution: t('cases.enterprise-automation-platform.solution'),
      technologies: t.raw(
        'cases.enterprise-automation-platform.technologies'
      ) as string[],
      duration: t('cases.enterprise-automation-platform.duration'),
      image:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center',
      results: (
        t.raw('cases.enterprise-automation-platform.results') as Array<{
          metric: string
          description: string
        }>
      ).map(result => `${result.metric} ${result.description}`),
      teamSize: '8 people', // This could be added to translations if needed
    },
    {
      slug: 'devops-transformation',
      title: t('cases.devops-transformation.title'),
      client: t('cases.devops-transformation.client'),
      industry: t('cases.devops-transformation.industry'),
      challenge: t('cases.devops-transformation.challenge'),
      solution: t('cases.devops-transformation.solution'),
      technologies: t.raw(
        'cases.devops-transformation.technologies'
      ) as string[],
      duration: t('cases.devops-transformation.duration'),
      image:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center',
      results: (
        t.raw('cases.devops-transformation.results') as Array<{
          metric: string
          description: string
        }>
      ).map(result => `${result.metric} ${result.description}`),
      teamSize: '5 people', // This could be added to translations if needed
    },
    {
      slug: 'cloud-migration',
      title: t('cases.cloud-migration.title'),
      client: t('cases.cloud-migration.client'),
      industry: t('cases.cloud-migration.industry'),
      challenge: t('cases.cloud-migration.challenge'),
      solution: t('cases.cloud-migration.solution'),
      technologies: t.raw('cases.cloud-migration.technologies') as string[],
      duration: t('cases.cloud-migration.duration'),
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
      results: (
        t.raw('cases.cloud-migration.results') as Array<{
          metric: string
          description: string
        }>
      ).map(result => `${result.metric} ${result.description}`),
      teamSize: '12 people', // This could be added to translations if needed
    },
    {
      slug: 'security-automation',
      title: t('cases.security-automation.title'),
      client: t('cases.security-automation.client'),
      industry: t('cases.security-automation.industry'),
      challenge: t('cases.security-automation.challenge'),
      solution: t('cases.security-automation.solution'),
      technologies: t.raw('cases.security-automation.technologies') as string[],
      duration: t('cases.security-automation.duration'),
      image:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&crop=center',
      results: (
        t.raw('cases.security-automation.results') as Array<{
          metric: string
          description: string
        }>
      ).map(result => `${result.metric} ${result.description}`),
      teamSize: '6 people', // This could be added to translations if needed
    },
    {
      slug: 'data-analytics-pipeline',
      title: t('cases.data-analytics-pipeline.title'),
      client: t('cases.data-analytics-pipeline.client'),
      industry: t('cases.data-analytics-pipeline.industry'),
      challenge: t('cases.data-analytics-pipeline.challenge'),
      solution: t('cases.data-analytics-pipeline.solution'),
      technologies: t.raw(
        'cases.data-analytics-pipeline.technologies'
      ) as string[],
      duration: t('cases.data-analytics-pipeline.duration'),
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
      results: (
        t.raw('cases.data-analytics-pipeline.results') as Array<{
          metric: string
          description: string
        }>
      ).map(result => `${result.metric} ${result.description}`),
      teamSize: '10 people', // This could be added to translations if needed
    },
    {
      slug: 'infrastructure-optimization',
      title: t('cases.infrastructure-optimization.title'),
      client: t('cases.infrastructure-optimization.client'),
      industry: t('cases.infrastructure-optimization.industry'),
      challenge: t('cases.infrastructure-optimization.challenge'),
      solution: t('cases.infrastructure-optimization.solution'),
      technologies: t.raw(
        'cases.infrastructure-optimization.technologies'
      ) as string[],
      duration: t('cases.infrastructure-optimization.duration'),
      image:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center',
      results: (
        t.raw('cases.infrastructure-optimization.results') as Array<{
          metric: string
          description: string
        }>
      ).map(result => `${result.metric} ${result.description}`),
      teamSize: '4 people', // This could be added to translations if needed
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg section-padding pt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
              {tListing('hero.title')}{' '}
              <span className="text-gradient">
                {tListing('hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {tListing('hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="section-padding bg-white dark:bg-secondary-900">
        <div className="container-custom">
          <div className="grid gap-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="relative h-96 rounded-2xl overflow-hidden group">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Floating Stats */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm rounded-lg p-3 text-center">
                          <Building className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                          <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100">
                            {study.industry}
                          </div>
                        </div>
                        <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm rounded-lg p-3 text-center">
                          <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                          <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100">
                            {study.duration}
                          </div>
                        </div>
                        <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm rounded-lg p-3 text-center">
                          <Users className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                          <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100">
                            {study.teamSize}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                    {study.title}
                  </h2>

                  <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-6">
                    {study.client}
                  </p>

                  {/* Challenge & Solution */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        {tListing('content.challenge')}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                        {study.challenge}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        {tListing('content.solution')}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  {/* Key Results */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                      {tListing('content.keyResults')}
                    </h3>
                    <div className="grid gap-2">
                      {study.results.slice(0, 3).map((result, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-secondary-700 dark:text-secondary-300 text-sm">
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      {tListing('content.technologies')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.slice(0, 4).map(tech => (
                        <span
                          key={tech}
                          className="bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group"
                  >
                    {tListing('content.readFullCase')}
                    <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary-50 dark:bg-secondary-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {tListing('cta.title')}
              </h2>
              <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                {tListing('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-primary-50"
                >
                  {tListing('cta.startProject')}
                </motion.a>
                <motion.a
                  href="/blog"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-600"
                >
                  {tListing('cta.learnMore')}
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CaseStudiesPage
