import blogData from './blog-data.json'

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

interface BlogData {
  posts: BlogPost[]
  slugs: string[]
}

// Type representing the raw structure we expect from JSON before validation
// We use unknown for the top-level since JSON imports are not strongly typed
type RawBlogData = {
  posts: unknown
  slugs: unknown
}

// Type guard to validate if object is a valid BlogPost
function isBlogPost(obj: unknown): obj is BlogPost {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const post = obj as Record<string, unknown>
  return (
    typeof post.slug === 'string' &&
    typeof post.title === 'string' &&
    typeof post.date === 'string' &&
    typeof post.author === 'string' &&
    typeof post.excerpt === 'string' &&
    typeof post.image === 'string' &&
    Array.isArray(post.tags) &&
    post.tags.every(tag => typeof tag === 'string') &&
    typeof post.readTime === 'string' &&
    (post.category === undefined || typeof post.category === 'string') &&
    typeof post.content === 'string'
  )
}

// Type guard to validate if the imported JSON has the expected BlogData structure
function isBlogData(obj: RawBlogData): obj is BlogData {
  return (
    Array.isArray(obj.posts) &&
    obj.posts.every(post => isBlogPost(post)) &&
    Array.isArray(obj.slugs) &&
    obj.slugs.every(slug => typeof slug === 'string')
  )
}

// Validate the imported blog data
function getValidatedBlogData(): BlogData {
  if (!isBlogData(blogData as RawBlogData)) {
    throw new Error(
      'Invalid blog data structure: Expected object with "posts" array of BlogPost objects and "slugs" array of strings'
    )
  }
  return blogData as BlogData
}

// Get all blog post slugs for static generation
export function getAllPostSlugs(): string[] {
  const validatedData = getValidatedBlogData()
  return validatedData.slugs
}

// Get blog post data by slug
export function getPostData(slug: string): BlogPost | null {
  const validatedData = getValidatedBlogData()
  const post = validatedData.posts.find(p => p.slug === slug)
  return post || null
}

// Alias for getPostData for consistency
export function getPostBySlug(slug: string): BlogPost | null {
  return getPostData(slug)
}

// Get all blog posts metadata (for listing pages)
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const validatedData = getValidatedBlogData()
  return validatedData.posts.map(post => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...metadata } = post
    return metadata
  })
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
