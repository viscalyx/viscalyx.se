// Type declarations for blog-data.json
// This file ensures TypeScript can properly type the imported JSON module

import { BlogPost } from './blog'

interface BlogDataStructure {
  posts: BlogPost[]
  slugs: string[]
  lastBuilt?: string
}

declare const blogData: BlogDataStructure
export default blogData
