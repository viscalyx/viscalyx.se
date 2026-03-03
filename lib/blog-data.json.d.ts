// Type declarations for blog-data.json
// This file ensures TypeScript can properly type the imported JSON module
// Note: blog-data.json now contains only metadata (no content)
// Content is stored separately in public/blog-content/[slug].json

import type { BlogPostMetadata } from './blog'

interface BlogDataStructure {
  lastBuilt?: string
  posts: BlogPostMetadata[]
  slugs: string[]
}

declare const blogData: BlogDataStructure
export default blogData
