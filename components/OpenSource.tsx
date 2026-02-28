'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Users } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { GitHubIcon } from '@/components/SocialIcons'
import { useSectionNavigation } from '@/lib/use-section-navigation'

const OpenSource = () => {
  const { handleNavigation } = useSectionNavigation({
    handleExternalLinks: true,
  })
  const t = useTranslations('openSource')

  const contributions = [
    {
      name: t('projects.powershellDsc.name'),
      description: t('projects.powershellDsc.description'),
      language: t('projects.powershellDsc.language'),
      link: 'https://github.com/dsccommunity',
      image: '/macbook-typescript-two-pane-editor.png',
    },
    {
      name: t('projects.dscResourceKit.name'),
      description: t('projects.dscResourceKit.description'),
      language: t('projects.dscResourceKit.language'),
      link: 'https://github.com/PowerShell/DscResources',
      image: '/macro-syntax-highlighted-source-code-pixels.png',
    },
    {
      name: t('projects.automationToolkits.name'),
      description: t('projects.automationToolkits.description'),
      language: t('projects.automationToolkits.language'),
      link: 'https://github.com/gaelcolas/Sampler',
      image: '/laptop-rising-market-chart-modern-office.png',
    },
  ]

  const stats = [
    { label: t('stats.projects.label'), value: t('stats.projects.value') },
    { label: t('stats.stars.label'), value: t('stats.stars.value') },
    { label: t('stats.members.label'), value: t('stats.members.value') },
    { label: t('stats.years.label'), value: t('stats.years.value') },
  ]

  return (
    <section
      className="section-padding bg-secondary-50 dark:bg-secondary-900"
      id="open-source"
    >
      <div className="container-custom">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
            {t('title')}{' '}
            <span className="text-gradient">{t('titleHighlight')}</span>
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              key={stat.label}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {stat.value}
              </div>
              <div className="text-secondary-600 dark:text-secondary-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects */}
        <ul
          aria-label="Open source projects"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {contributions.map((project, index) => (
            <li
              className="overflow-hidden rounded-xl shadow-lg"
              key={project.name}
            >
              <motion.div
                className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden card-hover group"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    alt={project.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm rounded-full p-2">
                    <GitHubIcon className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.name}
                    </h3>
                  </div>

                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary-500 dark:bg-primary-400 rounded-full" />
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {project.language}
                      </span>
                    </div>

                    <motion.a
                      aria-label={t('accessibility.viewProject', {
                        name: project.name,
                      })}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                      href={project.link}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        // Only handle left-click mouse events
                        if (e.button === 0) {
                          e.preventDefault()
                          handleNavigation(project.link)
                        }
                      }}
                      rel="noopener noreferrer"
                      target="_blank"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('viewProject')}
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('cta.title')}
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                aria-label={t('accessibility.followGithub')}
                className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-primary-50 flex items-center justify-center"
                href="https://github.com/viscalyx"
                rel="noopener noreferrer"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GitHubIcon className="w-5 h-5 mr-2" />
                {t('cta.followGithub')}
              </motion.a>
              <motion.a
                aria-label={t('accessibility.collaborate')}
                className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-600 flex items-center justify-center"
                href="https://dsccommunity.org/"
                rel="noopener noreferrer"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-5 h-5 mr-2" />
                {t('cta.collaborate')}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OpenSource
