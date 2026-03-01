import '@/app/blog-content.css'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import BlogPostContent from '@/components/BlogPostContent'
import BlogPostMarkdownContent from '@/components/BlogPostMarkdownContent'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  loadBlogContent,
  trackPageView,
  validateSlug,
} from '@/lib/blog'
import { SITE_URL } from '@/lib/constants'
import {
  addHeadingIds,
  extractTableOfContentsServer,
} from '@/lib/slug-utils-server'
import { getAuthorInitials, getSerializableTeamMemberByName } from '@/lib/team'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params

  const validatedSlug = validateSlug(slug)
  if (!validatedSlug) {
    return {}
  }

  const post = getPostBySlug(validatedSlug)

  if (!post) {
    return {}
  }

  const title = post.title
  const description = post.excerpt

  // Ensure OG image is always an absolute URL
  const ogImageUrl = post.image.startsWith('http')
    ? post.image
    : `${SITE_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      languages: {
        en: `${SITE_URL}/en/blog/${validatedSlug}`,
        sv: `${SITE_URL}/sv/blog/${validatedSlug}`,
      },
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params

  // Validate slug to prevent path traversal attacks
  const validatedSlug = validateSlug(slug)
  if (!validatedSlug) {
    notFound()
  }

  // Load post metadata
  const postMetadata = getPostBySlug(validatedSlug)
  if (!postMetadata) {
    notFound()
  }

  // Load post content from static files
  const content = await loadBlogContent(validatedSlug)
  if (!content) {
    notFound()
  }

  // Get translations for heading accessibility labels
  const t = await getTranslations({ locale, namespace: 'blog' })
  const tTeam = await getTranslations({ locale, namespace: 'team' })

  // Process content server-side: add heading IDs and extract ToC
  const contentWithIds = await addHeadingIds(content, { locale }, t)
  const tableOfContents = extractTableOfContentsServer(contentWithIds)

  // Get team member data in serializable format (no React components)
  const teamMember = getSerializableTeamMemberByName(postMetadata.author, tTeam)
  const authorInitials = getAuthorInitials(postMetadata.author)

  // Get related posts
  const relatedPosts = getRelatedPosts(validatedSlug, postMetadata.category)

  // Track basic page view (no PII — equivalent to server access logs)
  // Fire-and-forget: don't block page render on analytics
  void trackPageView(validatedSlug, postMetadata.category || 'uncategorized')

  // Normalize date for the client component
  const normalizedDate: string | null =
    postMetadata.date && !Number.isNaN(Date.parse(postMetadata.date))
      ? postMetadata.date
      : null

  // Build post data for the client component
  const post = {
    title: postMetadata.title,
    author: postMetadata.author,
    date: normalizedDate,
    readTime: postMetadata.readTime,
    image: postMetadata.image,
    imageAlt: postMetadata.imageAlt,
    category: postMetadata.category || 'uncategorized',
    slug: postMetadata.slug,
    tags: postMetadata.tags,
    excerpt: postMetadata.excerpt,
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <Header />

      <BlogPostContent
        authorInitials={authorInitials}
        post={post}
        relatedPosts={relatedPosts.map(rp => ({
          slug: rp.slug,
          title: rp.title,
          image: rp.image,
        }))}
        tableOfContents={tableOfContents}
        teamMember={teamMember}
      >
        <BlogPostMarkdownContent contentWithIds={contentWithIds} />
      </BlogPostContent>

      <Footer />
    </div>
  )
}
