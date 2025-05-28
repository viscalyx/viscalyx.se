'use client'

import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface BlogPostMeta {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  image: string
  category: string
  slug: string
  tags?: string[]
}

const BlogPage = () => {
  const t = useTranslations('blog')
  const [allPosts, setAllPosts] = useState<BlogPostMeta[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPostMeta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const data = await response.json()
          setAllPosts(data.allPosts || [])
          setFeaturedPost(data.featuredPost)
        } else {
          console.error('Failed to fetch blog posts')
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  /**
   * Default Featured Post Template
   *
   * This serves as a fallback when no markdown posts are available in content/blog/.
   *
   * To customize this default post:
   * 1. Update the properties below with your preferred content
   * 2. Use a high-quality image URL (recommended: 800x400px)
   * 3. Choose an appropriate category that matches your content
   * 4. Ensure the slug is URL-friendly (lowercase, hyphens instead of spaces)
   *
   * Note: This will only be shown when no actual blog posts exist.
   * Once you add markdown files to content/blog/, the most recent post
   * will automatically become the featured post.
   */
  const defaultFeaturedPost = {
    title: t('fallback.featuredPost.title'),
    excerpt: t('fallback.featuredPost.excerpt'),
    author: t('fallback.featuredPost.author'),
    date: new Date().toISOString().split('T')[0], // Current date
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&crop=center',
    category: t('fallback.featuredPost.category'),
    slug: 'welcome-to-my-blog',
  }

  /**
   * Default Blog Posts Template
   *
   * This array serves as fallback content when no markdown posts exist.
   * Currently empty to show a clean blog grid when starting development.
   *
   * To add default posts for demo/development purposes:
   * 1. Uncomment and fill in the example structure below
   * 2. Add as many posts as needed for your design/demo
   * 3. Use high-quality images (recommended: 400x300px for grid posts)
   *
   * Example structure:
   * {
   *   title: "Your Blog Post Title",
   *   excerpt: "Brief description of the blog post content...",
   *   author: "Author Name",
   *   date: "2024-12-10",
   *   readTime: "6 min read",
   *   image: "https://images.unsplash.com/photo-example",
   *   tags: ["tag1", "tag2"],
   *   category: "Category Name",
   *   slug: "blog-post-slug"
   * }
   */
  const defaultBlogPosts: BlogPostMeta[] = []

  // Use markdown posts if available, otherwise fall back to default posts
  const displayFeaturedPost = featuredPost || defaultFeaturedPost
  const displayBlogPosts =
    allPosts.length > 0 ? allPosts.slice(1) : defaultBlogPosts

  // Get unique categories from all posts
  const categories = [
    displayFeaturedPost.category,
    ...displayBlogPosts.map((post: BlogPostMeta) => post.category),
  ].filter(Boolean)
  const allCategories = [
    t('categories.all'),
    ...Array.from(new Set(categories)),
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">
            Loading blog posts...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg section-padding pt-32">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
              {t('hero.title')}{' '}
              <span className="text-gradient">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding bg-white dark:bg-secondary-900">
        <div className="container-custom">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-8">
              {t('featuredPost.title')}
            </h2>

            <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <Image
                    src={displayFeaturedPost.image}
                    alt={displayFeaturedPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {displayFeaturedPost.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center text-secondary-500 dark:text-secondary-400 text-sm mb-4">
                    <User className="w-4 h-4 mr-2" />
                    {displayFeaturedPost.author}
                    <span className="mx-3">•</span>
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(displayFeaturedPost.date).toLocaleDateString()}
                    <span className="mx-3">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    {displayFeaturedPost.readTime}
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {displayFeaturedPost.title}
                  </h3>

                  <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                    {displayFeaturedPost.excerpt}
                  </p>

                  <Link
                    href={`/blog/${displayFeaturedPost.slug}`}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group"
                  >
                    {t('post.readFullArticle')}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-secondary-50 dark:bg-secondary-800">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {allCategories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    category === t('categories.all')
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-white dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayBlogPosts.map((post: BlogPostMeta) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-secondary-700 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-secondary-500 dark:text-secondary-400 text-xs mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </div>

                  <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium group"
                  >
                    {t('post.readMore')}
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-primary">{t('loadMore')}</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogPage
