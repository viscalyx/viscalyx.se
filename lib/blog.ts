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

// Type guard to validate if object is a valid BlogPost
function isBlogPost(obj: any): obj is BlogPost {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.excerpt === 'string' &&
    typeof obj.image === 'string' &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: any) => typeof tag === 'string') &&
    typeof obj.readTime === 'string' &&
    (obj.category === undefined || typeof obj.category === 'string') &&
    typeof obj.content === 'string'
  )
}

// Type guard to validate if the imported JSON has the expected BlogData structure
function isBlogData(obj: any): obj is BlogData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj.posts) &&
    obj.posts.every(isBlogPost) &&
    Array.isArray(obj.slugs) &&
    obj.slugs.every((slug: any) => typeof slug === 'string')
  )
}

// Validate the imported blog data
function getValidatedBlogData(): BlogData {
  if (!isBlogData(blogData)) {
    throw new Error(
      'Invalid blog data structure: Expected object with "posts" array of BlogPost objects and "slugs" array of strings'
    )
  }
  return blogData
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
