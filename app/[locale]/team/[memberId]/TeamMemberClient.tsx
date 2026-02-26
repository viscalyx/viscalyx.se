'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { type SerializableTeamMember, socialIconMap } from '@/lib/team'

interface TeamMemberClientProps {
  member: SerializableTeamMember
}

const TeamMemberClient = ({ member }: TeamMemberClientProps) => {
  const t = useTranslations('teamMember')
  const locale = useLocale()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
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

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98], // Custom easeOut curve
      },
    },
  }

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="min-h-screen"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      <div className="pt-20">
        <section className="py-20 bg-linear-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-primary-900/20">
          <div className="container-custom section-padding">
            {/* Back Button */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                className="inline-flex items-center text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                href={`/${locale}/team` as Route}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToTeam')}
              </Link>
            </motion.div>

            <motion.div
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
              initial="hidden"
              variants={containerVariants}
            >
              {/* Left Content */}
              <motion.div className="space-y-8" variants={itemVariants}>
                {/* Header */}
                <div>
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4"
                    variants={itemVariants}
                  >
                    {t('aboutTitle')} {member.name}
                  </motion.h1>

                  <motion.div className="space-y-3" variants={itemVariants}>
                    <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold">
                      {member.role}
                    </p>
                    <div className="flex items-center text-secondary-500 dark:text-secondary-400">
                      <MapPin className="h-5 w-5 mr-2" />
                      {member.location}
                    </div>
                  </motion.div>
                </div>

                {/* Biography */}
                <motion.div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  variants={itemVariants}
                >
                  <div className="text-secondary-600 dark:text-secondary-300 leading-relaxed mb-6 whitespace-pre-line">
                    {t(`members.${member.id}.biography`)}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-3">
                    {member.specialties.map(specialty => (
                      <span
                        className="px-4 py-2 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium"
                        key={specialty}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                    {t('connectTitle')}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {member.socialLinks.map(social => {
                      const IconComponent = socialIconMap[social.name]
                      return (
                        <motion.a
                          aria-label={social.name}
                          className="flex items-center space-x-2 px-4 py-3 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          href={social.href}
                          key={social.name}
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
                          <IconComponent className="h-5 w-5" />
                          <span className="font-medium">{social.name}</span>
                        </motion.a>
                      )
                    })}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - Large Profile Image */}
              <motion.div
                className="lg:sticky lg:top-24"
                variants={imageVariants}
              >
                <div className="relative">
                  <div className="relative aspect-4/5 w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl">
                    {member.image ? (
                      <Image
                        alt={member.name}
                        className="object-cover"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        src={member.image}
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-6xl font-bold text-white">
                          {member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-primary-900/20 to-transparent" />
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 dark:bg-primary-800 rounded-full opacity-60 blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-200 dark:bg-secondary-800 rounded-full opacity-40 blur-3xl" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
      <ScrollToTop />
    </motion.main>
  )
}

export default TeamMemberClient
