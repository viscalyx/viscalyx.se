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

// Since we have a .d.ts file for blog-data.json, TypeScript knows the structure
// We only need minimal validation to ensure runtime safety
function validateBlogData(data: typeof blogData): BlogData {
  // Basic runtime validation to catch any JSON corruption or build issues
  if (!data || typeof data !== 'object') {
    throw new Error('Blog data is not an object')
  }

  if (!Array.isArray(data.posts)) {
    throw new Error('Blog data posts is not an array')
  }

  if (!Array.isArray(data.slugs)) {
    throw new Error('Blog data slugs is not an array')
  }

  return {
    posts: data.posts,
    slugs: data.slugs,
  }
}

// Validate the imported blog data
function getValidatedBlogData(): BlogData {
  return validateBlogData(blogData)
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
export function getAllPosts() {
  const validatedData = getValidatedBlogData()
  return validatedData.posts.map(post => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...metadata } = post
    return metadata
  })
}

// Get featured post (most recent)
export function getFeaturedPost(): BlogPostMetadata | null {
  const posts = getAllPosts()
  return posts.length > 0 ? posts[0] : null
}

// Get related posts by tags or category
export function getRelatedPosts(
  currentSlug: string,
  category?: string,
  limit: number = 3
): BlogPostMetadata[] {
  const allPosts = getAllPosts()

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
