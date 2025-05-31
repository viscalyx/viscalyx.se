import { NextResponse } from 'next/server'
import { getAllPosts, getFeaturedPost } from '@/lib/blog'

export async function GET() {
  try {
    const allPosts = getAllPosts()
    const featuredPost = getFeaturedPost()

    return NextResponse.json({
      allPosts,
      featuredPost,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
