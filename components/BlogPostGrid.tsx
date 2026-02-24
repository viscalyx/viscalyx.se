'use client'

import { Calendar, Clock } from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { BlogPostMetadata } from '@/lib/blog'

interface BlogPostGridProps {
  allPosts: BlogPostMetadata[]
  featuredPostCategory?: string
  categoriesAllLabel: string
  loadMoreLabel: string
}

export const POSTS_PER_PAGE = 6

const BlogPostGrid = ({
  allPosts,
  featuredPostCategory,
  categoriesAllLabel,
  loadMoreLabel,
}: BlogPostGridProps) => {
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Build unique categories from all posts + featured post category
  const postCategories = allPosts
    .map(post => post.category)
    .filter(Boolean) as string[]
  const uniqueCategories = Array.from(
    new Set(
      [featuredPostCategory, ...postCategories].filter(Boolean) as string[]
    )
  )
  const allCategories = [categoriesAllLabel, ...uniqueCategories]

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === categoriesAllLabel || selectedCategory === ''
      ? allPosts
      : allPosts.filter(post => post.category === selectedCategory)

  const displayBlogPosts = filteredPosts.slice(0, visiblePosts)
  const hasMorePosts = filteredPosts.length > visiblePosts

  const loadMorePosts = () => {
    setVisiblePosts(prev =>
      Math.min(prev + POSTS_PER_PAGE, filteredPosts.length)
    )
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setVisiblePosts(POSTS_PER_PAGE)
  }

  return (
    <section className="section-padding bg-secondary-50 dark:bg-secondary-800">
      <div className="container-custom">
        {/* Category Filter */}
        <div className="mb-12">
          <div
            className="flex flex-wrap gap-3 justify-center"
            data-testid="category-filter"
          >
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  category === selectedCategory ||
                  (selectedCategory === '' && category === categoriesAllLabel)
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
          {displayBlogPosts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}` as Route}
              className="block"
            >
              <article className="bg-white dark:bg-secondary-700 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer h-full hover:-translate-y-2 transform">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    {post.category && (
                      <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                    )}
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
              {loadMoreLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogPostGrid
