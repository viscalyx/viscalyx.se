'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Camera, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { getTeamMembers, socialIconTranslationKeyMap } from '@/lib/team'

const Team = () => {
  const t = useTranslations('team')
  const locale = useLocale()
  const router = useRouter()

  const handleCardClick = (memberId: string) => {
    router.push(`/${locale}/team/${memberId}`)
  }

  const teamMembers = getTeamMembers(t)

  const getViewProfileAriaLabel = (name: string) => {
    const translated = t('viewProfile', { name })
    return translated === 'viewProfile'
      ? `View profile for ${name}`
      : translated
  }

  const getSocialLinkAriaLabel = (socialName: string) => {
    const socialKey =
      socialIconTranslationKeyMap[
        socialName as keyof typeof socialIconTranslationKeyMap
      ]
    const translated = t(`socialLinks.${socialKey}`)
    return translated === `socialLinks.${socialKey}` ? socialName : translated
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.04, 0.62, 0.23, 0.98], // Custom easeOut curve
      },
    },
  }

  const cardVariants: Variants = {
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.42, 0, 0.58, 1], // Custom easeInOut curve
      },
    },
  }

  return (
    <section
      className="py-20 bg-linear-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-primary-900/20"
      id="team"
    >
      <div className="container-custom section-padding">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
              {t('badge')}
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6"
            variants={itemVariants}
          >
            {t('title')}
          </motion.h2>

          <motion.p
            className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {teamMembers.map(member => {
            const socialLinkRows = []
            for (let start = 0; start < member.socialLinks.length; start += 5) {
              socialLinkRows.push(member.socialLinks.slice(start, start + 5))
            }

            return (
              <motion.div
                className="group"
                key={member.id}
                variants={itemVariants}
                whileHover="hover"
              >
                <motion.div
                  aria-label={getViewProfileAriaLabel(member.name)}
                  className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-200 dark:border-secondary-700 h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-secondary-900"
                  onClick={() => handleCardClick(member.id)}
                  onKeyDown={event => {
                    const target = event.target as HTMLElement | null
                    if (
                      target &&
                      target !== event.currentTarget &&
                      target.closest(
                        'a, button, [role="link"], [role="button"]',
                      )
                    ) {
                      return
                    }

                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleCardClick(member.id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  variants={cardVariants}
                >
                  {/* Profile Image */}
                  <div className="relative mb-6">
                    <div className="relative w-32 h-32 mx-auto">
                      {!member.image ? (
                        <div className="w-full h-full rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-4 ring-primary-100 dark:ring-primary-900/50">
                          <Camera className="h-12 w-12 text-white" />
                        </div>
                      ) : (
                        <Image
                          alt={member.name}
                          className="rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/50"
                          fill
                          sizes="128px"
                          src={member.image}
                        />
                      )}
                      <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary-600/20 to-transparent group-hover:from-primary-600/30 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                      {member.role}
                    </p>
                    <div className="flex items-center justify-center text-secondary-500 dark:text-secondary-400 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {member.location}
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-300 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3">
                      {t('specialties')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map(specialty => (
                        <span
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium"
                          key={specialty}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-col items-center space-y-3 mb-6">
                    {socialLinkRows.map(row => (
                      <div
                        className="flex justify-center space-x-4"
                        key={row.map(social => social.name).join('|')}
                      >
                        {row.map(social => (
                          <motion.a
                            aria-label={getSocialLinkAriaLabel(social.name)}
                            className="min-h-[44px] min-w-[44px] p-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center"
                            href={social.href}
                            key={social.name}
                            onClick={e => e.stopPropagation()}
                            rel={
                              social.href.startsWith('mailto:')
                                ? undefined
                                : 'noopener noreferrer'
                            }
                            target={
                              social.href.startsWith('mailto:')
                                ? '_self'
                                : '_blank'
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <social.icon
                              className="h-5 w-5"
                              title={t(
                                `socialLinks.${socialIconTranslationKeyMap[social.name]}`,
                              )}
                            />
                          </motion.a>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          variants={itemVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          <div className="bg-linear-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('joinTeam.title')}
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              {t('joinTeam.description')}
            </p>
            <motion.a
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              href="https://github.com/viscalyx"
              rel="noopener noreferrer"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('joinTeam.button')}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                className="ml-2"
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Team
