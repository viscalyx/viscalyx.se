'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import {
  BlueskyIcon,
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MastodonIcon,
  XIcon,
} from '@/components/SocialIcons'
import { motion, Variants } from 'framer-motion'
import { ArrowLeft, Mail, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

type TeamMember = {
  id: string
  name: string
  role: string
  image?: string
  bio: string
  location: string
  specialties: string[]
  socialLinks: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

type Props = {
  params: Promise<{ locale: string; memberId: string }>
}

export default function TeamMemberPage({ params }: Props) {
  const [memberId, setMemberId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('teamMember')
  const tGlobal = useTranslations('team')

  useEffect(() => {
    params.then(({ memberId: id }) => {
      setMemberId(id)
      setIsLoading(false)
    })
  }, [params])

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-secondary-600 dark:text-secondary-300">
            Loading...
          </p>
        </div>
      </motion.main>
    )
  }

  if (!memberId) {
    notFound()
  }

  // Get team member data
  const getTeamMemberData = (id: string): TeamMember | null => {
    const teamMembers: Record<string, TeamMember> = {
      johlju: {
        id: 'johlju',
        name: 'Johan Ljunggren',
        role: tGlobal('members.johlju.role'),
        image: '/johlju-profile.jpg',
        bio: tGlobal('members.johlju.bio'),
        location: 'Sweden',
        specialties: tGlobal.raw('members.johlju.specialties') as string[],
        socialLinks: [
          {
            name: 'Email',
            href: 'mailto:johan.ljunggren@viscalyx.se',
            icon: Mail,
          },
          {
            name: 'LinkedIn',
            href: 'https://linkedin.com/in/johlju',
            icon: LinkedInIcon,
          },
          {
            name: 'Bluesky',
            href: 'https://bsky.app/profile/johlju.bsky.social',
            icon: BlueskyIcon,
          },
          {
            name: 'Mastodon',
            href: 'https://mastodon.social/@johlju',
            icon: MastodonIcon,
          },
          {
            name: 'X',
            href: 'https://twitter.com/johlju',
            icon: XIcon,
          },
          {
            name: 'Discord',
            href: 'https://discord.gg/dsccommunity',
            icon: DiscordIcon,
          },
          {
            name: 'GitHub',
            href: 'https://github.com/johlju',
            icon: GitHubIcon,
          },
        ],
      },
      testsson: {
        id: 'testsson',
        name: 'Test Testsson',
        role: tGlobal('members.sonja.role'),
        image: undefined, // No image available
        bio: tGlobal('members.sonja.bio'),
        location: 'Sweden',
        specialties: tGlobal.raw('members.sonja.specialties') as string[],
        socialLinks: [
          {
            name: 'Instagram',
            href: 'https://instagram.com/testtestsson99934201',
            icon: InstagramIcon,
          },
        ],
      },
    }

    return teamMembers[id as keyof typeof teamMembers] || null
  }

  const member = getTeamMemberData(memberId)

  if (!member) {
    notFound()
  }

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Header />

      <div className="pt-20">
        <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-primary-900/20">
          <div className="container-custom section-padding">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                href="/team"
                className="inline-flex items-center text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToTeam')}
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
            >
              {/* Left Content */}
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Header */}
                <div>
                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4"
                  >
                    {t('aboutTitle')} {member.name}
                  </motion.h1>

                  <motion.div variants={itemVariants} className="space-y-3">
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
                  variants={itemVariants}
                  className="prose prose-lg dark:prose-invert max-w-none"
                >
                  <div className="text-secondary-600 dark:text-secondary-300 leading-relaxed mb-6 whitespace-pre-line">
                    {t(`members.${member.id}.biography`)}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-3">
                    {member.specialties.map(specialty => (
                      <span
                        key={specialty}
                        className="px-4 py-2 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium"
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
                    {member.socialLinks.map(social => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target={
                          social.href.startsWith('mailto:') ? '_self' : '_blank'
                        }
                        rel={
                          social.href.startsWith('mailto:')
                            ? undefined
                            : 'noopener noreferrer'
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-3 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        aria-label={social.name}
                      >
                        <social.icon className="h-5 w-5" />
                        <span className="font-medium">{social.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - Large Profile Image */}
              <motion.div
                variants={imageVariants}
                className="lg:sticky lg:top-24"
              >
                <div className="relative">
                  <div className="relative aspect-[4/5] w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-6xl font-bold text-white">
                          {member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent" />
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
