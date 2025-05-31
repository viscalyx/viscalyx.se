'use client'

import sanitizeHtml from 'sanitize-html'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  BookOpen,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TableOfContents from '@/components/TableOfContents'
import ReadingProgress from '@/components/ReadingProgress'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

interface TocItem {
  id: string
  text: string
  level: number
}

interface BlogPost {
  title: string
  author: string
  date: string
  readTime: string
  image: string
  category: string
  slug: string
  tags: string[]
  content: string
}

// Function to extract headings from HTML content and create table of contents
function extractTableOfContents(htmlContent: string): TocItem[] {
  // Create a temporary DOM element to parse the HTML
  if (typeof window === 'undefined') {
    // Server-side: use a simple regex approach
    const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h[2-4]>/gi
    const headings: TocItem[] = []
    let match

    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const level = parseInt(match[1])
      const text = sanitizeHtml(match[2], { allowedTags: [], allowedAttributes: {} }).trim() // Sanitize HTML content
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .trim()

      // Ensure the id is not empty
      const finalId =
        id || `heading-${level}-${Math.random().toString(36).substr(2, 9)}`

      headings.push({ id: finalId, text, level })
    }

    return headings
  } else {
    // Client-side: use DOM parsing (for future hydration)
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const headings = Array.from(doc.querySelectorAll('h2, h3, h4'))

    return headings.map(heading => {
      const text = heading.textContent || ''
      const level = parseInt(heading.tagName.charAt(1))
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Collapse consecutive hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .trim()

      // Ensure the id is not empty
      const finalId =
        id || `heading-${level}-${Math.random().toString(36).substr(2, 9)}`

      return { id: finalId, text, level }
    })
  }
}

// Function to add IDs to headings in HTML content
function addHeadingIds(htmlContent: string): string {
  return htmlContent.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h[2-4]>/gi,
    (match, level, attributes, text) => {
      const cleanText = sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {},
      }).trim()
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .trim()

      // Ensure the id is not empty
      const finalId =
        id || `heading-${level}-${Math.random().toString(36).substr(2, 9)}`

      return `<h${level}${attributes} id="${finalId}">${text}</h${level}>`
    }
  )
}

const BlogPost = ({ params }: BlogPostPageProps) => {
  const t = useTranslations('blog')
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Await params in Next.js 15+
        const { slug } = await params

        const response = await fetch(`/api/blog/${slug}`)

        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
          setRelatedPosts(data.relatedPosts || [])
        } else if (response.status === 404) {
          // If markdown post not found, use fallback data for existing slugs
          const fallbackPost = getFallbackPost(slug)
          if (!fallbackPost) {
            notFound()
          }
          setPost(fallbackPost)
          setRelatedPosts([])
        } else {
          console.error('Failed to fetch blog post')
          notFound()
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">
            Loading blog post...
          </p>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return <BlogPostContent post={post} relatedPosts={relatedPosts} t={t} />
}

// Fallback data for existing blog posts that don't have markdown files yet
function getFallbackPost(slug: string): BlogPost | null {
  const fallbackPosts: { [key: string]: BlogPost } = {
    template: {
      title: 'Blog Post Template',
      content: `<h1>Blog Post Template</h1>
<p>This is a template for creating new blog posts. It demonstrates the structure and formatting that will be used throughout the blog.</p>

<h2>Getting Started</h2>
<p>When creating a new blog post, start with a compelling introduction that hooks your readers and gives them a preview of what they'll learn.</p>

<h3>Writing Tips</h3>
<ul>
<li>Keep paragraphs short and scannable</li>
<li>Use headings to break up content</li>
<li>Include relevant examples</li>
</ul>

<h2>Content Structure</h2>
<p>A well-structured blog post typically follows this pattern:</p>

<h3>Introduction</h3>
<p>Set the stage and explain what readers will gain from the article.</p>

<h3>Main Content</h3>
<p>Break your main content into logical sections with clear headings.</p>

<h4>Subsections</h4>
<p>Use subsections when you need to dive deeper into specific topics.</p>

<h2>Best Practices</h2>
<p>Here are some best practices to follow when writing blog posts:</p>

<h3>SEO Considerations</h3>
<p>Make sure your content is optimized for search engines while remaining valuable to readers.</p>

<h3>Engagement</h3>
<p>Encourage reader interaction through questions and calls-to-action.</p>

<h2>Conclusion</h2>
<p>Wrap up your post with a strong conclusion that reinforces your main points and provides next steps for readers.</p>`,
      author: 'Johan Ljunggren',
      date: '2025-01-01',
      readTime: '5 min read',
      image:
        'https://images.unsplash.com/photo-1593505681742-8cbb6f44de25?w=1200&h=600&fit=crop&crop=center',
      category: 'Template',
      tags: ['Template', 'Guide', 'Writing'],
      slug: 'template',
    },
  }

  return fallbackPosts[slug] || null
}

interface BlogPostContentProps {
  post: BlogPost
  relatedPosts: BlogPost[]
  t: (key: string) => string
}

const BlogPostContent = ({ post, relatedPosts, t }: BlogPostContentProps) => {
  // Extract table of contents and add IDs to headings
  const tableOfContents = extractTableOfContents(post.content)
  const contentWithIds = addHeadingIds(post.content)

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <Header />
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
                  {new Date(post.date).toLocaleDateString()}
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
                <button className="bg-white dark:bg-secondary-800 p-2 rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200 dark:border-secondary-700">
                  <Share2 className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative h-96 md:h-[500px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
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
                      <div className="flex items-center">
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
                      <TableOfContents items={tableOfContents} />
                    </div>
                  </details>
                </div>
              )}

              <div className="prose prose-lg max-w-none prose-headings:text-secondary-900 dark:prose-headings:text-secondary-100 prose-p:text-secondary-700 dark:prose-p:text-secondary-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-pre:bg-secondary-50 dark:prose-pre:bg-secondary-800 prose-headings:scroll-mt-24">
                <div
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                  className="markdown-content"
                />
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
                  <div className="w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    JL
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                      {t('post.authorBio.name')}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                      {t('post.authorBio.description')}
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href="#"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {t('post.socialLinks.linkedin')}
                      </a>
                      <a
                        href="#"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {t('post.socialLinks.github')}
                      </a>
                      <a
                        href="#"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {t('post.socialLinks.twitter')}
                      </a>
                    </div>
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
                    <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      {t('post.tableOfContents')}
                    </h3>
                    <div className="max-h-80 overflow-y-auto">
                      <TableOfContents items={tableOfContents} />
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
                        href={`/blog/${relatedPost.slug}`}
                        className="flex space-x-3 group"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
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

      <Footer />
    </div>
  )
}

export default BlogPost
