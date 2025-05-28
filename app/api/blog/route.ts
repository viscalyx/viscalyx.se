import { NextResponse } from 'next/server'
import { getAllPosts, getFeaturedPost } from '@/lib/blog'

export async function GET() {
  try {
    const [allPosts, featuredPost] = await Promise.all([
      getAllPosts(),
      getFeaturedPost(),
    ])

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
