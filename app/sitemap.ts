import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://viscalyx.com'

  // Get all blog posts
  const posts = await getAllPosts()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic blog pages
  const blogPages = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

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
