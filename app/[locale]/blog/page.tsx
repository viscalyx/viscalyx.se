'use client'

import { Calendar, Clock, User } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useFormatter } from 'next-intl'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import { normalizeDate, getCurrentDateISO } from '@/lib/date-utils'

interface BlogPostMeta {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  image: string
  imageAlt?: string
  category: string
  slug: string
  tags?: string[]
}

interface BlogListApiResponse {
  allPosts: BlogPostMeta[]
  featuredPost: BlogPostMeta | null
}

const BlogPage = () => {
  const t = useTranslations('blog')
  const format = useFormatter()
  const [allPosts, setAllPosts] = useState<BlogPostMeta[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPostMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const postsPerPage = 6 // Number of posts to show initially and load more
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const data: BlogListApiResponse = await response.json()
          // Normalize missing or invalid dates to default
          const normalizedPosts = (data.allPosts || []).map(post => ({
            ...post,
            date: normalizeDate(post.date, 'No date provided'),
          }))
          setAllPosts(normalizedPosts)
          // Determine featured post
          let featured = data.featuredPost ? { ...data.featuredPost } : null
          if (!featured || !featured.date || isNaN(Date.parse(featured.date))) {
            featured = normalizedPosts[0] || null
          }
          setFeaturedPost(featured)
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
    date: getCurrentDateISO(), // Current date
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&crop=center',
    imageAlt: 'Person typing on laptop with coffee cup and notebook on desk',
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
  const allDisplayPosts = allPosts.length > 0 ? allPosts : defaultBlogPosts

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === t('categories.all') || selectedCategory === ''
      ? allDisplayPosts
      : allDisplayPosts.filter(
          (post: BlogPostMeta) => post.category === selectedCategory
        )

  const displayBlogPosts = filteredPosts.slice(0, visiblePosts)

  // Check if there are more posts to load
  const hasMorePosts = filteredPosts.length > visiblePosts

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + postsPerPage, filteredPosts.length))
  }

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setVisiblePosts(postsPerPage) // Reset visible posts when category changes
  }

  // Get unique categories from all posts
  const categories = [
    displayFeaturedPost.category,
    ...allDisplayPosts.map((post: BlogPostMeta) => post.category),
  ].filter(Boolean)
  const allCategories = [
    t('categories.all'),
    ...Array.from(new Set(categories)),
  ]

  if (loading) {
    return <LoadingScreen message={t('loadingBlogPosts')} />
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

            <Link
              href={`/blog/${displayFeaturedPost.slug}` as Route}
              className="block"
            >
              <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 transform">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={displayFeaturedPost.image}
                      alt={displayFeaturedPost.title}
                      fill
                      sizes="100vw"
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
                      {format.dateTime(new Date(displayFeaturedPost.date), {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <span className="mx-3">•</span>
                      <Clock className="w-4 h-4 mr-2" />
                      {displayFeaturedPost.readTime}
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {displayFeaturedPost.title}
                    </h3>

                    <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                      {displayFeaturedPost.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
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
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    category === selectedCategory ||
                    (selectedCategory === '' &&
                      category === t('categories.all'))
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
              <Link
                key={post.slug}
                href={`/blog/${post.slug}` as Route}
                className="block"
              >
                <article className="bg-white dark:bg-secondary-700 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer h-full hover:-translate-y-2 transform">
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
                      {post.date}
                      <span className="mx-2">•</span>
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>

                    <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-secondary-600 dark:text-secondary-400 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {hasMorePosts && (
            <div className="text-center mt-12">
              <button
                type="button"
                className="btn-primary"
                onClick={loadMorePosts}
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogPage
