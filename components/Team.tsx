'use client'

import { motion, Variants } from 'framer-motion'
import { ArrowRight, Camera, MapPin } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getTeamMembers } from '@/lib/team'

const Team = () => {
  const t = useTranslations('team')
  const locale = useLocale()
  const router = useRouter()

  const handleCardClick = (memberId: string) => {
    router.push(`/${locale}/team/${memberId}`)
  }

  const teamMembers = getTeamMembers(t)

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
      id="team"
      className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-primary-900/20"
    >
      <div className="container-custom section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
              {t('badge')}
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('description')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map(member => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={cardVariants}
                onClick={() => handleCardClick(member.id)}
                className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-200 dark:border-secondary-700 h-full cursor-pointer"
              >
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    {!member.image ? (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-4 ring-primary-100 dark:ring-primary-900/50">
                        <Camera className="h-12 w-12 text-white" />
                      </div>
                    ) : (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/50"
                      />
                    )}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-600/20 to-transparent group-hover:from-primary-600/30 transition-all duration-300" />
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
                        key={specialty}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col items-center space-y-3 mb-6">
                  {Array.from(
                    { length: Math.ceil(member.socialLinks.length / 5) },
                    (_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex justify-center space-x-4"
                      >
                        {member.socialLinks
                          .slice(rowIndex * 5, (rowIndex + 1) * 5)
                          .map(social => (
                            <motion.a
                              key={social.name}
                              href={social.href}
                              target={
                                social.href.startsWith('mailto:')
                                  ? '_self'
                                  : '_blank'
                              }
                              rel={
                                social.href.startsWith('mailto:')
                                  ? undefined
                                  : 'noopener noreferrer'
                              }
                              onClick={e => e.stopPropagation()}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              aria-label={social.name}
                            >
                              <social.icon className="h-5 w-5" />
                            </motion.a>
                          ))}
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('joinTeam.title')}
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              {t('joinTeam.description')}
            </p>
            <motion.a
              href="https://github.com/viscalyx"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              {t('joinTeam.button')}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
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
