import { BlogPostGrid } from 'viscalyx-site'
import blogData from '../../lib/blog-data.json'

// The blog index passes every post; the featured post (most recent) sets the first category tab.
// lib/blog.ts getAllPosts: every post except the template.
const posts = blogData.posts.filter(post => post.slug !== 'template')

export const Default = () => (
  <BlogPostGrid
    allPosts={posts}
    categoriesAllLabel="All"
    featuredPostCategory={posts[0]?.category}
    loadMoreLabel="Load More Articles"
  />
)

export const FewPosts = () => (
  <BlogPostGrid
    allPosts={posts.filter(
      post => post.category === 'DSC' || post.category === 'PowerShell DSC',
    )}
    categoriesAllLabel="All"
    featuredPostCategory="DSC"
    loadMoreLabel="Load More Articles"
  />
)

export const DarkMode = () => (
  <div className="dark">
    <BlogPostGrid
      allPosts={posts.slice(0, 3)}
      categoriesAllLabel="All"
      featuredPostCategory={posts[0]?.category}
      loadMoreLabel="Load More Articles"
    />
  </div>
)
