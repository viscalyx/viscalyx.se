import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  image: string
  tags: string[]
  readTime: string
  category?: string
  content: string
}

export interface BlogPostMetadata {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  image: string
  tags: string[]
  readTime: string
  category?: string
}

// Get all blog post slugs for static generation
export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''))
  } catch {
    console.warn('Blog directory not found, returning empty array')
    return []
  }
}

// Get blog post data by slug
export async function getPostData(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Process markdown content to HTML
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content)

    const contentHtml = processedContent.toString()

    // Extract category from tags if not explicitly set
    const category = data.category || (data.tags && data.tags[0]) || 'General'

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Unknown Author',
      excerpt: data.excerpt || '',
      image:
        data.image ||
        'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop&crop=center',
      tags: data.tags || [],
      readTime: data.readTime || '5 min read',
      category,
      content: contentHtml,
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

// Alias for getPostData for consistency
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getPostData(slug)
}

// Get all blog posts metadata (for listing pages)
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const slugs = getAllPostSlugs()
  const posts: BlogPostMetadata[] = []

  for (const slug of slugs) {
    const post = await getPostData(slug)
    if (post) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...metadata } = post
      posts.push(metadata)
    }
  }

  // Sort posts by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// Get featured post (most recent)
export async function getFeaturedPost(): Promise<BlogPostMetadata | null> {
  const posts = await getAllPosts()
  return posts.length > 0 ? posts[0] : null
}

// Get related posts by tags or category
export async function getRelatedPosts(
  currentSlug: string,
  category?: string,
  limit: number = 3
): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts()

  let relatedPosts = allPosts.filter(post => post.slug !== currentSlug)

  // If category is provided, find posts with matching category or tags
  if (category) {
    relatedPosts = relatedPosts.filter(
      post => post.category === category || post.tags.includes(category)
    )
  }

  relatedPosts = relatedPosts.slice(0, limit)

  // If we don't have enough related posts, fill with recent posts
  if (relatedPosts.length < limit) {
    const additionalPosts = allPosts
      .filter(post => post.slug !== currentSlug)
      .filter(post => !relatedPosts.some(related => related.slug === post.slug))
      .slice(0, limit - relatedPosts.length)

    relatedPosts.push(...additionalPosts)
  }

  return relatedPosts
}
