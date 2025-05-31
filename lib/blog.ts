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

// Get all blog post slugs for static generation
export function getAllPostSlugs(): string[] {
  return blogData.slugs || []
}

// Get blog post data by slug
export async function getPostData(slug: string): Promise<BlogPost | null> {
  const post = blogData.posts.find(p => p.slug === slug)
  return post || null
}

// Alias for getPostData for consistency
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getPostData(slug)
}

// Get all blog posts metadata (for listing pages)
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  return blogData.posts.map(post => {
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
