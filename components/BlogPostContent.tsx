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

export interface BlogPostContentProps {
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
}: BlogPostContentProps) => {
  const t = useTranslations('blog')
  const format = useFormatter()
  const locale = useLocale()

  // State for share functionality
  const [shareNotification, setShareNotification] = useState<string>('')
  const [shareTimeoutId, setShareTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  )

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
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.substring(1)
        let rafId: number
        let attempts = 0
        const maxAttempts = 100

        const scrollToElement = () => {
          const element = document.getElementById(targetId)

          if (element && attempts < maxAttempts) {
            const rect = element.getBoundingClientRect()
            const isVisible = rect.width > 0 && rect.height > 0

            if (isVisible || attempts > 20) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            } else {
              attempts++
              rafId = requestAnimationFrame(scrollToElement)
            }
          } else if (attempts < maxAttempts) {
            attempts++
            rafId = requestAnimationFrame(scrollToElement)
          }
        }

        rafId = requestAnimationFrame(scrollToElement)

        return () => {
          if (rafId) {
            cancelAnimationFrame(rafId)
          }
        }
      }
    }
  }, [])

  // Helper function to clear existing timeout and set a new one
  const setNotificationWithTimeout = useCallback(
    (message: string) => {
      if (shareTimeoutId) {
        clearTimeout(shareTimeoutId)
      }

      setShareNotification(message)
      const newTimeoutId = setTimeout(() => setShareNotification(''), 3000)
      setShareTimeoutId(newTimeoutId)
    },
    [shareTimeoutId]
  )

  // Function to handle sharing/copying URL
  const handleShare = async () => {
    const url = window.location.href

    // Always try clipboard first as it's more reliable
    try {
      await navigator.clipboard.writeText(url)
      setNotificationWithTimeout(t('post.notifications.linkCopied'))
      return
    } catch (clipboardError) {
      console.warn('Clipboard API failed:', clipboardError)
      // If clipboard fails, try native share API
      try {
        if (navigator.share && navigator.canShare) {
          const shareData = {
            title: post.title,
            text: post.excerpt
              ? t('post.notifications.shareTextWithExcerpt')
                  .replace('{excerpt}', post.excerpt)
                  .replace('{title}', post.title)
              : t('post.notifications.shareTextFallback').replace(
                  '{title}',
                  post.title
                ),
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
          setNotificationWithTimeout(t('post.notifications.linkCopied'))
        } else {
          throw new Error('execCommand failed')
        }
      } catch (fallbackError) {
        console.error('All share methods failed:', fallbackError)
        setNotificationWithTimeout(t('post.notifications.shareError'))
      }
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (shareTimeoutId) {
        clearTimeout(shareTimeoutId)
      }
    }
  }, [shareTimeoutId])

  // Handle anchor link functionality
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.classList.contains('heading-anchor')) {
        e.preventDefault()
        const href = target.getAttribute('href')
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
                  setNotificationWithTimeout(t('post.notifications.linkCopied'))
                })
                .catch(() => {
                  setNotificationWithTimeout(t('post.notifications.shareError'))
                })
            }
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
      <ReadingProgress
        target=".markdown-content"
        endTarget=".author-bio"
        readingProgressText={t('post.readingProgress')}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="container-custom">
          <div>
            <Link
              href="/blog"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              {t('post.backToBlog')}
            </Link>

            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                    : '—'}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-secondary-600 dark:text-secondary-400">
                  {t('post.share')}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="bg-white dark:bg-secondary-800 p-2 rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200 dark:border-secondary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  title={t('post.sharePost')}
                >
                  <Share2 className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                </button>
                {shareNotification && (
                  <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-md">
                    {shareNotification}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative h-96 md:h-[500px]">
        <Image
          src={post.image}
          alt={post.imageAlt || post.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-12">
            {' '}
            {/* Main Content */}{' '}
            <div className="lg:col-span-3">
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
                {' '}
                <div className="flex items-center flex-wrap gap-3">
                  <Tag className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 px-3 py-1 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-800 hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="author-bio mt-12 p-8 bg-secondary-50 dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
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
                      <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                        {teamMember ? (
                          <Link
                            href={`/${locale}/team/${teamMember.id}`}
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {teamMember.name}
                          </Link>
                        ) : (
                          post.author
                        )}
                      </h3>
                      {teamMember && (
                        <Link
                          href={`/team/${teamMember.id}` as Route}
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
              </div>
            </div>{' '}
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block">
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-secondary-100 dark:border-secondary-700">
                    <h3
                      id="toc-heading"
                      className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      {t('post.tableOfContents')}
                    </h3>
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
                <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-secondary-100 dark:border-secondary-700">
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                    {t('post.relatedArticles')}
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map(relatedPost => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}` as Route}
                        className="flex space-x-3 group"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            sizes="64px"
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
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
