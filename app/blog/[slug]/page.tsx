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
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TableOfContents from '@/components/TableOfContents'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: { slug: string }
}

interface TocItem {
  id: string
  text: string
  level: number
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
      const text = match[2].replace(/<[^>]*>/g, '').trim() // Remove any HTML tags
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
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
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
      const cleanText = text.replace(/<[^>]*>/g, '').trim()
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

const BlogPost = async ({ params }: BlogPostPageProps) => {
  // Await params in Next.js 15+
  const { slug } = await params

  // Get the blog post from markdown
  const post = await getPostBySlug(slug)

  if (!post) {
    // If markdown post not found, use fallback data for existing slugs
    const fallbackPost = getFallbackPost(slug)
    if (!fallbackPost) {
      notFound()
    }
    return <BlogPostContent post={fallbackPost} relatedPosts={[]} />
  }

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.slug, post.category)

  return <BlogPostContent post={post} relatedPosts={relatedPosts} />
}

// Fallback data for existing blog posts that don't have markdown files yet
function getFallbackPost(slug: string) {
  const fallbackPosts: { [key: string]: any } = {
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
  post: any
  relatedPosts: any[]
}

const BlogPostContent = ({ post, relatedPosts }: BlogPostContentProps) => {
  // Extract table of contents and add IDs to headings
  const tableOfContents = extractTableOfContents(post.content)
  const contentWithIds = addHeadingIds(post.content)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary-50">
        <div className="container-custom">
          <div>
            <Link
              href="/blog"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>

            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
                {post.title}
              </h1>

              <div className="flex items-center text-secondary-600 mb-8">
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
                <span className="text-secondary-600">Share:</span>
                <button className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow">
                  <Share2 className="w-4 h-4 text-secondary-600" />
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
            {/* Main Content */}{' '}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none prose-headings:text-secondary-900 prose-p:text-secondary-700 prose-a:text-primary-600 prose-code:text-primary-600 prose-pre:bg-secondary-50 prose-headings:scroll-mt-24">
                <div
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                  className="markdown-content"
                />
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-secondary-200">
                {' '}
                <div className="flex items-center flex-wrap gap-3">
                  <Tag className="w-4 h-4 text-secondary-500" />
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-8 bg-secondary-50 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    JL
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                      Johan Ljunggren
                    </h3>
                    <p className="text-secondary-600 mb-4">
                      Founder and Lead Consultant at Viscalyx. Johan is a
                      passionate automation expert with over 8 years of
                      experience in DevOps, PowerShell DSC, and open-source
                      development. He's an active contributor to the PowerShell
                      DSC Community and helps organizations worldwide streamline
                      their infrastructure management.
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        GitHub
                      </a>
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {' '}
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Table of Contents
                  </h3>
                  <TableOfContents items={tableOfContents} />
                </div>
              )}
              {/* Related Posts */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">
                  Related Articles
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
                        <h4 className="text-sm font-medium text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
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
      </section>

      <Footer />
    </div>
  )
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

export default BlogPost
