import { getAllPosts } from '@/lib/blog'
import { SITE_URL } from '@/lib/constants'
import { normalizeDate } from '@/lib/date-utils'
import { getStaticPageDates } from '@/lib/file-dates'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  // Get all blog posts
  const posts = getAllPosts()

  // Get actual last modified dates for static pages
  const staticPageDates = getStaticPageDates()

  // Static pages — consistent locale prefixes for all paths
  const staticPages = [
    ...['en', 'sv'].map(locale => ({
      url: `${baseUrl}/${locale}`,
      lastModified: staticPageDates.home,
      changeFrequency: 'monthly' as const,
      priority: 1,
    })),
    ...['en', 'sv'].map(locale => ({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: staticPageDates.blog,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...['en', 'sv'].map(locale => ({
      url: `${baseUrl}/${locale}/privacy`,
      lastModified: staticPageDates.privacy,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
    ...['en', 'sv'].map(locale => ({
      url: `${baseUrl}/${locale}/terms`,
      lastModified: staticPageDates.terms,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]

  // Dynamic blog pages with locale prefixes
  const blogPages = posts.flatMap(post => {
    const dateStr = normalizeDate(post.date)
    return ['en', 'sv'].map(locale => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(dateStr),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  })

  return [...staticPages, ...blogPages]
}
