'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Star, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { GitHubIcon } from './SocialIcons'

const OpenSource = () => {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('openSource')

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
      return
    }
    // Regular page navigation or external links
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener noreferrer')
    } else {
      router.push(href)
    }
  }
  const contributions = [
    {
      name: t('projects.powershellDsc.name'),
      description: t('projects.powershellDsc.description'),
      language: t('projects.powershellDsc.language'),
      stars: '2.5k',
      link: 'https://github.com/dsccommunity',
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=center',
    },
    {
      name: t('projects.dscResourceKit.name'),
      description: t('projects.dscResourceKit.description'),
      language: t('projects.dscResourceKit.language'),
      stars: '1.8k',
      link: 'https://github.com/PowerShell/DscResources',
      image:
        'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&h=300&fit=crop&crop=center',
    },
    {
      name: t('projects.automationToolkits.name'),
      description: t('projects.automationToolkits.description'),
      language: t('projects.automationToolkits.language'),
      stars: '892',
      link: '#',
      image:
        'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop&crop=center',
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
      id="open-source"
      className="section-padding bg-secondary-50 dark:bg-secondary-900"
    >
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          aria-label="Open source projects"
        >
          {contributions.map((project, index) => (
            <li
              key={project.name}
              className="overflow-hidden rounded-xl shadow-lg"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm rounded-full p-2">
                    <GitHubIcon className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center text-secondary-500 dark:text-secondary-400 text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      {project.stars}
                    </div>
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
                      href={project.link}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        // Only handle left-click mouse events
                        if (e.button === 0) {
                          e.preventDefault()
                          handleNavigation(project.link)
                        }
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                      aria-label={`View project ${project.name}`}
                    >
                      {t('viewProject')}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
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
                href="https://github.com/viscalyx"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-primary-50 flex items-center justify-center"
              >
                <GitHubIcon className="w-5 h-5 mr-2" />
                {t('cta.followGithub')}
              </motion.a>
              <motion.a
                href="https://github.com/viscalyx"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:bg-white hover:text-primary-600 flex items-center justify-center"
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
