import BlogPostGrid from '@/components/BlogPostGrid'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getAllPosts, getFeaturedPost } from '@/lib/blog'
import { SITE_URL } from '@/lib/constants'
import { getCurrentDateISO } from '@/lib/date-utils'
import { Calendar, Clock, User } from 'lucide-react'
import { Route } from 'next'
import { getFormatter, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  const title = `${t('hero.title')} ${t('hero.titleHighlight')}`
  const description = t('hero.description')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      images: [
        {
          url: `${SITE_URL}/og-blog-${locale}.png`,
          width: 1200,
          height: 630,
          alt: t('og.imageAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const format = await getFormatter({ locale })

  const allPosts = getAllPosts()
  const featuredPost = getFeaturedPost()

  // Fallback featured post when no markdown posts exist
  const defaultFeaturedPost = {
    title: t('fallback.featuredPost.title'),
    excerpt: t('fallback.featuredPost.excerpt'),
    author: t('fallback.featuredPost.author'),
    date: getCurrentDateISO(),
    readTime: t('fallback.featuredPost.readTime'),
    image: '/default-featured-post.png',
    imageAlt: t('fallback.featuredPost.imageAlt'),
    category: t('fallback.featuredPost.category'),
    slug: 'welcome-to-my-blog',
  }

  const displayFeaturedPost = featuredPost
    ? {
        ...featuredPost,
        date: featuredPost.date ?? getCurrentDateISO(),
        category: featuredPost.category ?? t('fallback.featuredPost.category'),
      }
    : defaultFeaturedPost

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
              href={`/${locale}/blog/${displayFeaturedPost.slug}` as Route}
              className="block"
            >
              <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 transform">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={displayFeaturedPost.image}
                      alt={
                        displayFeaturedPost.imageAlt ||
                        displayFeaturedPost.title
                      }
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
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

      {/* Blog Posts Grid (client island) */}
      <BlogPostGrid
        allPosts={allPosts}
        featuredPostCategory={displayFeaturedPost.category}
        categoriesAllLabel={t('categories.all')}
        loadMoreLabel={t('loadMore')}
      />

      <Footer />
    </div>
  )
}
