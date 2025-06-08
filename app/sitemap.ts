import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { getStaticPageDates } from '@/lib/file-dates'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://viscalyx.com'

  // Get all blog posts
  const posts = getAllPosts()

  // Get actual last modified dates for static pages
  const staticPageDates = getStaticPageDates()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: staticPageDates.home,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: staticPageDates.blog,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: staticPageDates.caseStudies,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
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

  // Dynamic blog pages (filter out posts without valid dates)
  const blogPages = posts.map(post => {
    // Normalize missing or invalid dates to default
    const dateStr =
      post.date && !isNaN(Date.parse(post.date)) ? post.date : '1970-01-01'
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(dateStr),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  /**
   * Fallback blog posts that don't have markdown files yet
   * These are placeholder entries for blog posts that are planned or referenced
   * but haven't been created as actual markdown files. They are filtered out
   * if a corresponding post with the same slug already exists in the posts array.
   */
  const fallbackBlogPages = [
    {
      url: `${baseUrl}/blog/future-infrastructure-automation-2025`,
      lastModified: new Date('2024-12-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/powershell-dsc-best-practices`,
      lastModified: new Date('2024-12-10'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/resilient-cicd-azure-devops`,
      lastModified: new Date('2024-12-05'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ].filter(fallback => !posts.some(post => fallback.url.includes(post.slug)))

  return [...staticPages, ...blogPages, ...fallbackBlogPages]
}
