'use client'

import AlertIconInjector from '@/components/AlertIconInjector'
import CodeBlockEnhancer from '@/components/CodeBlockEnhancer'
import ImageEnhancer from '@/components/ImageEnhancer'
import MermaidRenderer from '@/components/MermaidRenderer'
import ReadingProgress from '@/components/ReadingProgress'
import ScrollToTop from '@/components/ScrollToTop'
import TableOfContents from '@/components/TableOfContents'
import { useBlogAnalytics } from '@/lib/analytics'
import { socialIconMap } from '@/lib/team'

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Share2,
  Tag,
  User,
} from 'lucide-react'

import { Route } from 'next'
import { useFormatter, useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { TocItem } from '@/lib/slug-utils'
import type { SerializableTeamMember, SocialIconName } from '@/lib/team'

interface BlogPostData {
  title: string
  author: string
  date: string | null
  readTime: string
  image: string
  imageAlt?: string
  category: string
  slug: string
  tags: string[]
  excerpt: string
}

interface RelatedPost {
  slug: string
  title: string
  image: string
}

export interface ComponentProps {
  post: BlogPostData
  contentWithIds: string
  relatedPosts: RelatedPost[]
  tableOfContents: TocItem[]
  teamMember: SerializableTeamMember | null
  authorInitials: string
}

const BlogPostContent = ({
  post,
  contentWithIds,
  relatedPosts,
  tableOfContents,
  teamMember,
  authorInitials,
}: ComponentProps) => {
  const t = useTranslations('blog')
  const format = useFormatter()
  const locale = useLocale()

  // State for share functionality
  const [shareNotification, setShareNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const shareTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ref for the content container to scope event listeners
  const contentRef = useRef<HTMLDivElement>(null)

  // Track blog analytics
  useBlogAnalytics({
    slug: post.slug,
    category: post.category,
    title: post.title,
  })

  // Handle hash fragment navigation on page load
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const targetId = hash.substring(1)
      let rafId: number
      let attempts = 0
      const maxAttempts = 100
      let timedOut = false

      // Cap polling with a timeout to handle cases where rAF is throttled
      // (e.g., background tabs where rAF slows to ~1 fps)
      const timeoutId = setTimeout(() => {
        timedOut = true
        cancelAnimationFrame(rafId)
      }, 5000)

      const scrollToElement = () => {
        if (timedOut) return
        const element = document.getElementById(targetId)

        if (element) {
          const rect = element.getBoundingClientRect()
          const isVisible = rect.width > 0 && rect.height > 0

          if (isVisible || attempts > 20) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
            clearTimeout(timeoutId)
          } else if (attempts < maxAttempts) {
            attempts++
            rafId = requestAnimationFrame(scrollToElement)
          } else {
            clearTimeout(timeoutId)
          }
        } else if (attempts < maxAttempts) {
          attempts++
          rafId = requestAnimationFrame(scrollToElement)
        } else {
          clearTimeout(timeoutId)
        }
      }

      rafId = requestAnimationFrame(scrollToElement)

      return () => {
        clearTimeout(timeoutId)
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
      }
    }
  }, [])

  // Helper function to clear existing timeout and set a new one
  const setNotificationWithTimeout = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current)
      }

      setShareNotification({ message, type })
      shareTimeoutRef.current = setTimeout(
        () => setShareNotification(null),
        3000
      )
    },
    []
  )

  // Function to handle sharing/copying URL
  const handleShare = async () => {
    setIsSharing(true)
    try {
      const url = window.location.href

      // Always try clipboard first as it's more reliable
      try {
        await navigator.clipboard.writeText(url)
        setNotificationWithTimeout(
          t('post.notifications.linkCopied'),
          'success'
        )
        return
      } catch (clipboardError) {
        console.warn('Clipboard API failed:', clipboardError)
        // If clipboard fails, try native share API
        try {
          if (navigator.share && navigator.canShare) {
            const shareData = {
              title: post.title,
              text: post.excerpt
                ? t('post.notifications.shareTextWithExcerpt', {
                    excerpt: post.excerpt,
                    title: post.title,
                  })
                : t('post.notifications.shareTextFallback', {
                    title: post.title,
                  }),
              url: url,
            }

            if (navigator.canShare(shareData)) {
              await navigator.share(shareData)
              return
            }
          }
        } catch (shareError) {
          console.warn('Native share failed:', shareError)
        }

        // Final fallback - try to create a temporary input for manual copy
        try {
          const textArea = document.createElement('textarea')
          textArea.value = url
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)

          if (successful) {
            setNotificationWithTimeout(
              t('post.notifications.linkCopied'),
              'success'
            )
          } else {
            throw new Error('execCommand failed')
          }
        } catch (fallbackError) {
          console.error('All share methods failed:', fallbackError)
          setNotificationWithTimeout(
            t('post.notifications.shareError'),
            'error'
          )
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current)
      }
    }
  }, [])

  // Handle anchor link functionality
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const clicked = e.target as HTMLElement
      const anchor = clicked.closest<HTMLAnchorElement>('a.heading-anchor')
      if (!anchor) return

      e.preventDefault()
      const href = anchor.getAttribute('href')
      if (href) {
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          window.history.pushState(null, '', href)

          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })

          // Copy link to clipboard
          const fullUrl = window.location.href
          if (navigator.clipboard) {
            navigator.clipboard
              .writeText(fullUrl)
              .then(() => {
                setNotificationWithTimeout(
                  t('post.notifications.linkCopied'),
                  'success'
                )
              })
              .catch(() => {
                setNotificationWithTimeout(
                  t('post.notifications.shareError'),
                  'error'
                )
              })
          }
        }
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('click', handleAnchorClick)
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('click', handleAnchorClick)
      }
    }
  }, [t, setNotificationWithTimeout])

  return (
    <>
      <ReadingProgress target=".markdown-content" endTarget=".author-bio" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="container-custom">
          <div className="pl-3">
            <Link
              href={`/${locale}/blog` as Route}
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              {t('post.backToBlog')}
            </Link>

            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="bg-primary-600 dark:bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                {post.title}
              </h1>

              <div className="flex items-center text-secondary-600 dark:text-secondary-400 mb-8">
                <div className="flex items-center mr-6">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center mr-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date
                    ? format.dateTime(new Date(post.date), {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : t('post.dateFallback')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-secondary-600 dark:text-secondary-400">
                  {isSharing ? t('post.sharing') : t('post.share')}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isSharing}
                  aria-busy={isSharing}
                  className="bg-white dark:bg-secondary-800 p-2 rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200 dark:border-secondary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  title={t('post.sharePost')}
                  aria-label={t('post.sharePost')}
                >
                  <Share2 className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                </button>
                {shareNotification && (
                  <div
                    className={`text-sm px-3 py-1 rounded-md ${
                      shareNotification.type === 'error'
                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    {shareNotification.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative h-96 md:h-125">
        <Image
          src={post.image}
          alt={post.imageAlt || post.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-12 min-w-0">
            {/* Main Content */}
            <div className="lg:col-span-3 min-w-0">
              {/* Mobile Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="lg:hidden bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 mb-8 border border-secondary-100 dark:border-secondary-700">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-lg font-bold text-secondary-900 dark:text-secondary-100">
                      <div
                        id="toc-heading-mobile"
                        className="flex items-center"
                      >
                        <BookOpen className="w-5 h-5 mr-2" />
                        {t('post.tableOfContents')}
                      </div>
                      <svg
                        className="w-5 h-5 transition-transform group-open:rotate-180 text-secondary-600 dark:text-secondary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="mt-4">
                      <TableOfContents
                        items={tableOfContents}
                        maxHeight="sm"
                        headingId="toc-heading-mobile"
                      />
                    </div>
                  </details>
                </div>
              )}

              <div
                className="blog-content prose prose-lg max-w-none"
                ref={contentRef}
              >
                <AlertIconInjector contentKey={post.slug}>
                  {/* Note: contentWithIds is sanitized at build time; runtime sanitization not required */}
                  <div
                    dangerouslySetInnerHTML={{ __html: contentWithIds }}
                    className="markdown-content"
                  />
                  <CodeBlockEnhancer contentLoaded={true} />
                  <MermaidRenderer contentLoaded={true} />
                  <ImageEnhancer contentRef={contentRef} />
                </AlertIconInjector>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center flex-wrap gap-3">
                  <Tag className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <section
                aria-label="Author biography"
                data-testid="author-bio"
                className="author-bio mt-12 p-8 bg-secondary-50 dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">
                    {teamMember?.image ? (
                      <Image
                        src={teamMember.image}
                        alt={teamMember.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center rounded-full">
                        {authorInitials}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                        {teamMember ? (
                          <Link
                            href={`/${locale}/team/${teamMember.id}` as Route}
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {teamMember.name}
                          </Link>
                        ) : (
                          post.author
                        )}
                      </h2>
                      {teamMember && (
                        <Link
                          href={`/${locale}/team/${teamMember.id}` as Route}
                          className="inline-flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                        >
                          <span className="font-medium text-sm underline decoration-1 underline-offset-2">
                            {t('post.authorBio.viewProfile')}
                          </span>
                          <svg
                            className="w-3 h-3 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                    {teamMember && (
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                        {teamMember.role}
                      </p>
                    )}
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                      {teamMember?.bio || ''}
                    </p>
                    {teamMember && teamMember.socialLinks.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {teamMember.socialLinks.map(social => {
                          const IconComponent =
                            socialIconMap[social.name as SocialIconName]
                          if (!IconComponent) return null
                          return (
                            <a
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
                              className="flex items-center justify-center w-10 h-10 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              aria-label={social.name}
                              title={social.name}
                            >
                              <IconComponent className="h-4 w-4" />
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block">
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-secondary-100 dark:border-secondary-700">
                    <h2
                      id="toc-heading"
                      className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      {t('post.tableOfContents')}
                    </h2>
                    <div>
                      <TableOfContents
                        items={tableOfContents}
                        maxHeight="lg"
                        headingId="toc-heading"
                      />
                    </div>
                  </div>
                )}

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-secondary-100 dark:border-secondary-700">
                    <h2 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                      {t('post.relatedArticles')}
                    </h2>
                    <div className="space-y-4">
                      {relatedPosts.map(relatedPost => (
                        <Link
                          key={relatedPost.slug}
                          href={`/${locale}/blog/${relatedPost.slug}` as Route}
                          className="flex space-x-3 group"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}

export default BlogPostContent
