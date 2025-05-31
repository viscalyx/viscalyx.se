import { NextResponse } from 'next/server'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = getPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const relatedPosts = await getRelatedPosts(post.slug, post.category)

    return NextResponse.json({
      post,
      relatedPosts,
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}
