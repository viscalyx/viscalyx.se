'use client'

import { motion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BarChart,
  Camera,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Cloud,
  Code,
  Database,
  Download,
  ExternalLink,
  Eye,
  GitBranch,
  Globe,
  Heart,
  Info,
  Layers,
  Lightbulb,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  MousePointer,
  Palette,
  Phone,
  Quote,
  Search,
  Send,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Square,
  Star,
  Sun,
  Target,
  TrendingUp,
  Type,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

// Import custom icon components
import {
  BlueskyIcon,
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MastodonIcon,
  SlackIcon,
  StackOverflowIcon,
  XIcon,
  YouTubeIcon,
} from '../SocialIcons'

import {
  AlertIcon,
  CautionIcon,
  CheckmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  ImportantIcon,
  NoteIcon,
  TipIcon,
  WarningIcon,
} from '../BlogIcons'

// Interface for icon objects
interface IconItem {
  name: string
  component: React.ComponentType<{ className?: string }>
  usage: string
}

const IconsShowcase: React.FC = () => {
  const t = useTranslations('brandProfile')

  // Define the guideline items with translation keys
  const customIconsGuidelines = [
    t('icons.usageGuidelines.customIcons.items.0'),
    t('icons.usageGuidelines.customIcons.items.1'),
    t('icons.usageGuidelines.customIcons.items.2'),
    t('icons.usageGuidelines.customIcons.items.3'),
    t('icons.usageGuidelines.customIcons.items.4'),
  ]

  const lucideIconsGuidelines = [
    t('icons.usageGuidelines.lucideIcons.items.0'),
    t('icons.usageGuidelines.lucideIcons.items.1'),
    t('icons.usageGuidelines.lucideIcons.items.2'),
    t('icons.usageGuidelines.lucideIcons.items.3'),
    t('icons.usageGuidelines.lucideIcons.items.4'),
  ]

  // Custom Social Icons
  const socialIcons = [
    {
      name: 'GitHub',
      component: GitHubIcon,
      usage: t('icons.socialIconsUsage.github'),
    },
    {
      name: 'LinkedIn',
      component: LinkedInIcon,
      usage: t('icons.socialIconsUsage.linkedin'),
    },
    {
      name: 'X (Twitter)',
      component: XIcon,
      usage: t('icons.socialIconsUsage.twitter'),
    },
    {
      name: 'Bluesky',
      component: BlueskyIcon,
      usage: t('icons.socialIconsUsage.bluesky'),
    },
    {
      name: 'Mastodon',
      component: MastodonIcon,
      usage: t('icons.socialIconsUsage.mastodon'),
    },
    {
      name: 'Stack Overflow',
      component: StackOverflowIcon,
      usage: t('icons.socialIconsUsage.stackoverflow'),
    },
    {
      name: 'YouTube',
      component: YouTubeIcon,
      usage: t('icons.socialIconsUsage.youtube'),
    },
    {
      name: 'Discord',
      component: DiscordIcon,
      usage: t('icons.socialIconsUsage.discord'),
    },
    {
      name: 'Instagram',
      component: InstagramIcon,
      usage: t('icons.socialIconsUsage.instagram'),
    },
    {
      name: 'Slack',
      component: SlackIcon,
      usage: t('icons.socialIconsUsage.slack'),
    },
  ]

  // Custom Blog Icons
  const blogIcons = [
    {
      name: 'Copy',
      component: CopyIcon,
      usage: t('icons.blogIconsUsage.copy'),
    },
    {
      name: 'Checkmark',
      component: CheckmarkIcon,
      usage: t('icons.blogIconsUsage.checkmark'),
    },
    {
      name: 'Chevron Up',
      component: ChevronUpIcon,
      usage: t('icons.blogIconsUsage.chevronUp'),
    },
    {
      name: 'Chevron Down',
      component: ChevronDownIcon,
      usage: t('icons.blogIconsUsage.chevronDown'),
    },
    {
      name: 'Note',
      component: NoteIcon,
      usage: t('icons.blogIconsUsage.note'),
    },
    {
      name: 'Tip',
      component: TipIcon,
      usage: t('icons.blogIconsUsage.tip'),
    },
    {
      name: 'Important',
      component: ImportantIcon,
      usage: t('icons.blogIconsUsage.important'),
    },
    {
      name: 'Warning',
      component: WarningIcon,
      usage: t('icons.blogIconsUsage.warning'),
    },
    {
      name: 'Caution',
      component: CautionIcon,
      usage: t('icons.blogIconsUsage.caution'),
    },
  ]

  // Lucide React Icons grouped by usage
  const lucideIcons = {
    'Navigation & UI': [
      {
        name: 'Menu',
        component: Menu,
        usage: t('icons.lucideIconsUsage.menu'),
      },
      { name: 'X', component: X, usage: t('icons.lucideIconsUsage.x') },
      {
        name: 'Settings',
        component: Settings,
        usage: t('icons.lucideIconsUsage.settings'),
      },
      {
        name: 'Globe',
        component: Globe,
        usage: t('icons.lucideIconsUsage.globe'),
      },
      {
        name: 'ArrowUp',
        component: ArrowUp,
        usage: t('icons.lucideIconsUsage.arrowUp'),
      },
      {
        name: 'ArrowLeft',
        component: ArrowLeft,
        usage: t('icons.lucideIconsUsage.arrowLeft'),
      },
      {
        name: 'ArrowRight',
        component: ArrowRight,
        usage: t('icons.lucideIconsUsage.arrowRight'),
      },
    ],
    'Theme & Display': [
      { name: 'Sun', component: Sun, usage: t('icons.lucideIconsUsage.sun') },
      {
        name: 'Moon',
        component: Moon,
        usage: t('icons.lucideIconsUsage.moon'),
      },
      {
        name: 'Monitor',
        component: Monitor,
        usage: t('icons.lucideIconsUsage.monitor'),
      },
      { name: 'Eye', component: Eye, usage: t('icons.lucideIconsUsage.eye') },
      {
        name: 'Palette',
        component: Palette,
        usage: t('icons.lucideIconsUsage.palette'),
      },
    ],
    'Status & Feedback': [
      {
        name: 'Loader2',
        component: Loader2,
        usage: t('icons.lucideIconsUsage.loader2'),
      },
      {
        name: 'CheckCircle',
        component: CheckCircle,
        usage: t('icons.lucideIconsUsage.checkCircle'),
      },
      {
        name: 'AlertCircle',
        component: AlertCircle,
        usage: t('icons.lucideIconsUsage.alertCircle'),
      },
      {
        name: 'AlertTriangle',
        component: AlertTriangle,
        usage: t('icons.lucideIconsUsage.alertTriangle'),
      },
      {
        name: 'Info',
        component: Info,
        usage: t('icons.lucideIconsUsage.info'),
      },
      {
        name: 'Check',
        component: Check,
        usage: t('icons.lucideIconsUsage.check'),
      },
    ],
    'Business & Features': [
      {
        name: 'Target',
        component: Target,
        usage: t('icons.lucideIconsUsage.target'),
      },
      {
        name: 'Users',
        component: Users,
        usage: t('icons.lucideIconsUsage.users'),
      },
      {
        name: 'Lightbulb',
        component: Lightbulb,
        usage: t('icons.lucideIconsUsage.lightbulb'),
      },
      {
        name: 'Award',
        component: Award,
        usage: t('icons.lucideIconsUsage.award'),
      },
      {
        name: 'TrendingUp',
        component: TrendingUp,
        usage: t('icons.lucideIconsUsage.trendingUp'),
      },
      {
        name: 'Star',
        component: Star,
        usage: t('icons.lucideIconsUsage.star'),
      },
    ],
    'Technical & Development': [
      {
        name: 'Code',
        component: Code,
        usage: t('icons.lucideIconsUsage.code'),
      },
      {
        name: 'Database',
        component: Database,
        usage: t('icons.lucideIconsUsage.database'),
      },
      {
        name: 'Smartphone',
        component: Smartphone,
        usage: t('icons.lucideIconsUsage.smartphone'),
      },
      {
        name: 'Search',
        component: Search,
        usage: t('icons.lucideIconsUsage.search'),
      },
      {
        name: 'BarChart',
        component: BarChart,
        usage: t('icons.lucideIconsUsage.barChart'),
      },
      {
        name: 'Shield',
        component: Shield,
        usage: t('icons.lucideIconsUsage.shield'),
      },
      { name: 'Zap', component: Zap, usage: t('icons.lucideIconsUsage.zap') },
      {
        name: 'Layers',
        component: Layers,
        usage: t('icons.lucideIconsUsage.layers'),
      },
      {
        name: 'GitBranch',
        component: GitBranch,
        usage: t('icons.lucideIconsUsage.gitBranch'),
      },
      {
        name: 'Cloud',
        component: Cloud,
        usage: t('icons.lucideIconsUsage.cloud'),
      },
    ],
    'Communication & Contact': [
      {
        name: 'Mail',
        component: Mail,
        usage: t('icons.lucideIconsUsage.mail'),
      },
      {
        name: 'Phone',
        component: Phone,
        usage: t('icons.lucideIconsUsage.phone'),
      },
      {
        name: 'MapPin',
        component: MapPin,
        usage: t('icons.lucideIconsUsage.mapPin'),
      },
      {
        name: 'Send',
        component: Send,
        usage: t('icons.lucideIconsUsage.send'),
      },
      {
        name: 'MessageSquare',
        component: MessageSquare,
        usage: t('icons.lucideIconsUsage.messageSquare'),
      },
    ],
    'Content & Media': [
      {
        name: 'Quote',
        component: Quote,
        usage: t('icons.lucideIconsUsage.quote'),
      },
      {
        name: 'Camera',
        component: Camera,
        usage: t('icons.lucideIconsUsage.camera'),
      },
      {
        name: 'ExternalLink',
        component: ExternalLink,
        usage: t('icons.lucideIconsUsage.externalLink'),
      },
      {
        name: 'Download',
        component: Download,
        usage: t('icons.lucideIconsUsage.download'),
      },
      {
        name: 'Clock',
        component: Clock,
        usage: t('icons.lucideIconsUsage.clock'),
      },
    ],
    'Design & Layout': [
      {
        name: 'Sparkles',
        component: Sparkles,
        usage: t('icons.lucideIconsUsage.sparkles'),
      },
      {
        name: 'Square',
        component: Square,
        usage: t('icons.lucideIconsUsage.square'),
      },
      {
        name: 'Circle',
        component: Circle,
        usage: t('icons.lucideIconsUsage.circle'),
      },
      {
        name: 'Type',
        component: Type,
        usage: t('icons.lucideIconsUsage.type'),
      },
      {
        name: 'MousePointer',
        component: MousePointer,
        usage: t('icons.lucideIconsUsage.mousePointer'),
      },
    ],
    'Special & Decorative': [
      {
        name: 'Heart',
        component: Heart,
        usage: t('icons.lucideIconsUsage.heart'),
      },
    ],
  }

  const renderIconGrid = (
    icons: IconItem[],
    title: string,
    description: string
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {icons.map((icon, index) => {
          const IconComponent = icon.component
          return (
            <motion.div
              key={`${title}-${icon.name}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {icon.name}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {icon.usage}
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('icons.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('icons.description')}
        </p>
      </motion.div>

      {/* Custom Social Icons */}
      {renderIconGrid(
        socialIcons,
        t('icons.categories.customSocialIcons.title'),
        t('icons.categories.customSocialIcons.description')
      )}

      {/* Custom Blog Icons */}
      {renderIconGrid(
        blogIcons,
        t('icons.categories.customBlogIcons.title'),
        t('icons.categories.customBlogIcons.description')
      )}

      {/* Lucide React Icons */}
      {Object.entries(lucideIcons).map(([category, icons]) => (
        <div key={category}>
          {renderIconGrid(
            icons,
            `${t('icons.categories.lucideIcons.title')} - ${category}`,
            t('icons.categories.lucideIcons.description', {
              category: category.toLowerCase(),
            })
          )}
        </div>
      ))}

      {/* Alert Icon Dynamic Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('icons.categories.dynamicAlertIcons.title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('icons.categories.dynamicAlertIcons.description')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['note', 'tip', 'important', 'warning', 'caution'].map(
            (type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <AlertIcon
                      type={
                        type as
                          | 'note'
                          | 'tip'
                          | 'important'
                          | 'warning'
                          | 'caution'
                      }
                      className="w-5 h-5 text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {type}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t(`icons.alertTypes.${type}`)}
                </p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* Usage Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('icons.usageGuidelines.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('icons.usageGuidelines.customIcons.title')}
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {customIconsGuidelines.map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('icons.usageGuidelines.lucideIcons.title')}
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {lucideIconsGuidelines.map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Implementation Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('icons.implementationExamples.title')}
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t('icons.implementationExamples.customSocialIcons.title')}
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800 dark:text-gray-200">
                {`import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

<GitHubIcon className="w-5 h-5 text-gray-600 hover:text-gray-900" />
<LinkedInIcon className="w-5 h-5 text-blue-600 hover:text-blue-700" />`}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t('icons.implementationExamples.blogAlertIcons.title')}
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800 dark:text-gray-200">
                {`import { AlertIcon } from '@/components/BlogIcons'

<AlertIcon type="warning" className="w-5 h-5 text-orange-500" />
<AlertIcon type="tip" className="w-5 h-5 text-blue-500" />`}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t('icons.implementationExamples.lucideReactIcons.title')}
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800 dark:text-gray-200">
                {`import { Mail, Phone, MapPin } from 'lucide-react'

<Mail className="w-5 h-5 text-primary-600" />
<Phone className="w-5 h-5 text-secondary-600" />
<MapPin className="w-5 h-5 text-accent-600" />`}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default IconsShowcase
