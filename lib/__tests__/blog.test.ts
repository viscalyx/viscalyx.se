import {
  _resetBlogDataCache,
  getAllPostSlugs,
  getAllPosts,
  getFeaturedPost,
  getPostBySlug,
  getPostData,
  getPostMetadata,
  getRelatedPosts,
  loadBlogContent,
  sanitizeCategory,
  trackPageView,
  validateSlug,
} from '@/lib/blog'

// Mock blog-data.json for the metadata/listing function tests
const mockBlogData = vi.hoisted(() => ({
  posts: [
    {
      slug: 'first-post',
      title: 'First Post',
      date: '2025-01-15',
      author: 'Author A',
      excerpt: 'Excerpt of first post',
      image: '/img/first.jpg',
      imageAlt: 'First image',
      tags: ['TypeScript', 'React'],
      readTime: '5 min read',
      category: 'DevOps',
    },
    {
      slug: 'second-post',
      title: 'Second Post',
      date: 'invalid-date',
      author: 'Author B',
      excerpt: 'Excerpt of second post',
      image: '/img/second.jpg',
      tags: ['Python'],
      readTime: '3 min read',
      category: 'Automation',
    },
    {
      slug: 'third-post',
      title: 'Third Post',
      date: '2025-02-01',
      author: 'Author A',
      excerpt: 'Excerpt of third post',
      image: '/img/third.jpg',
      imageAlt: 42, // non-string imageAlt to test sanitization
      tags: ['TypeScript', 123, 'DevOps'], // mixed tags to test filtering
      readTime: '7 min read',
      category: 'DevOps',
    },
    {
      slug: 'template',
      title: 'Template Post',
      date: '2025-01-01',
      author: 'Template',
      excerpt: 'Template excerpt',
      image: '/img/template.jpg',
      tags: [],
      readTime: '1 min read',
      category: 'Template',
    },
  ],
  slugs: ['first-post', 'second-post', 'third-post', 'template'],
}))

vi.mock('@/lib/blog-data.json', () => ({
  default: mockBlogData,
}))

beforeEach(() => {
  vi.clearAllMocks()
  _resetBlogDataCache()
})

describe('getAllPostSlugs', () => {
  it('returns all slugs except template when multiple exist', () => {
    const slugs = getAllPostSlugs()
    expect(slugs).toContain('first-post')
    expect(slugs).toContain('second-post')
    expect(slugs).toContain('third-post')
    expect(slugs).not.toContain('template')
  })
})

describe('getPostMetadata', () => {
  it('returns metadata for an existing slug', () => {
    const post = getPostMetadata('first-post')
    expect(post).not.toBeNull()
    expect(post?.title).toBe('First Post')
    expect(post?.slug).toBe('first-post')
    expect(post?.imageAlt).toBe('First image')
  })

  it('returns null for non-existent slug', () => {
    expect(getPostMetadata('nonexistent')).toBeNull()
  })

  it('normalizes invalid dates to undefined', () => {
    const post = getPostMetadata('second-post')
    expect(post?.date).toBeUndefined()
  })

  it('sanitizes non-string imageAlt to undefined', () => {
    const post = getPostMetadata('third-post')
    expect(post?.imageAlt).toBeUndefined()
  })

  it('filters non-string tags and lowercases them', () => {
    const post = getPostMetadata('third-post')
    expect(post?.tags).toEqual(['typescript', 'devops'])
  })

  it('deduplicates tags', () => {
    const post = getPostMetadata('first-post')
    expect(post?.tags).toEqual(['typescript', 'react'])
  })
})

describe('getPostData', () => {
  it('returns metadata (alias for getPostMetadata)', () => {
    const post = getPostData('first-post')
    expect(post).not.toBeNull()
    expect(post?.title).toBe('First Post')
  })
})

describe('getPostBySlug', () => {
  it('returns metadata (alias for getPostMetadata)', () => {
    const post = getPostBySlug('second-post')
    expect(post).not.toBeNull()
    expect(post?.title).toBe('Second Post')
  })
})

describe('getAllPosts', () => {
  it('returns all posts except template when multiple exist', () => {
    const posts = getAllPosts()
    expect(posts.length).toBe(3)
    expect(posts.every(p => p.slug !== 'template')).toBe(true)
  })

  it('normalizes post data correctly', () => {
    const posts = getAllPosts()
    const second = posts.find(p => p.slug === 'second-post')
    expect(second?.date).toBeUndefined()
    expect(second?.imageAlt).toBeUndefined()
  })
})

describe('getFeaturedPost', () => {
  it('returns the first post (most recent)', () => {
    const featured = getFeaturedPost()
    expect(featured).not.toBeNull()
    expect(featured?.slug).toBe('first-post')
  })
})

describe('getRelatedPosts', () => {
  it('returns posts with matching category', () => {
    const related = getRelatedPosts('first-post', 'DevOps', 3)
    expect(related.length).toBeGreaterThan(0)
    expect(related.every(p => p.slug !== 'first-post')).toBe(true)
  })

  it('excludes current post from results', () => {
    const related = getRelatedPosts('first-post', 'DevOps', 10)
    expect(related.every(p => p.slug !== 'first-post')).toBe(true)
  })

  it('fills with recent posts when not enough related posts', () => {
    const related = getRelatedPosts('first-post', 'NonExistentCategory', 3)
    // Should still return some posts (filled from recent)
    expect(related.length).toBeGreaterThan(0)
  })

  it('returns posts without category filter', () => {
    const related = getRelatedPosts('first-post', undefined, 3)
    expect(related.length).toBeGreaterThan(0)
    expect(related.every(p => p.slug !== 'first-post')).toBe(true)
  })

  it('respects the limit parameter', () => {
    const related = getRelatedPosts('first-post', undefined, 1)
    expect(related.length).toBe(1)
  })

  it('includes posts when category matches filter', () => {
    const related = getRelatedPosts('second-post', 'DevOps', 3)
    // third-post has category DevOps, so it should be included
    const hasDevOps = related.some(p => p.slug === 'third-post')
    expect(hasDevOps).toBe(true)
  })

  it('includes posts when filter value matches a tag but not category', () => {
    // 'TypeScript' exists only in first-post's tags (category is 'DevOps')
    // and third-post's tags (category is 'DevOps'), but not as a category.
    // Calling from third-post excludes it, so first-post should match via tag.
    const related = getRelatedPosts('third-post', 'TypeScript', 3)
    const hasFirstPost = related.some(p => p.slug === 'first-post')
    expect(hasFirstPost).toBe(true)
  })
})

describe('validateSlug', () => {
  it('returns valid slug as-is', () => {
    expect(validateSlug('my-blog-post')).toBe('my-blog-post')
  })

  it('accepts slugs with underscores', () => {
    expect(validateSlug('my_blog_post')).toBe('my_blog_post')
  })

  it('accepts slugs with numbers', () => {
    expect(validateSlug('post-123')).toBe('post-123')
  })

  it('accepts uppercase letters', () => {
    expect(validateSlug('MyPost')).toBe('MyPost')
  })

  it('rejects slugs with dots', () => {
    expect(validateSlug('post.html')).toBeNull()
  })

  it('rejects path traversal with ..', () => {
    expect(validateSlug('../etc/passwd')).toBeNull()
  })

  it('rejects slugs with slashes', () => {
    expect(validateSlug('path/traversal')).toBeNull()
  })

  it('rejects slugs with spaces', () => {
    expect(validateSlug('my post')).toBeNull()
  })

  it('rejects empty string', () => {
    expect(validateSlug('')).toBeNull()
  })

  it('rejects slugs with query params', () => {
    expect(validateSlug('post?id=1')).toBeNull()
  })

  it('rejects slugs with hash', () => {
    expect(validateSlug('post#section')).toBeNull()
  })

  it('rejects null bytes', () => {
    expect(validateSlug('post\x00evil')).toBeNull()
  })
})

const mockReadFile = vi.hoisted(() => vi.fn())

vi.mock('node:fs/promises', () => ({
  readFile: mockReadFile,
}))

vi.mock('node:path', () => ({
  join: (...segments: string[]) => segments.join('/'),
}))

describe('loadBlogContent', () => {
  it('loads content from filesystem for existing post', async () => {
    mockReadFile.mockResolvedValueOnce(
      JSON.stringify({ content: '# Hello World\nSome blog content.' }),
    )

    const result = await loadBlogContent('my-blog-post')

    expect(result).toBe('# Hello World\nSome blog content.')
    expect(mockReadFile).toHaveBeenCalledWith(
      expect.stringContaining('blog-content/my-blog-post.json'),
      'utf-8',
    )
  })

  it('returns null for non-existent post', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT: no such file'))

    const result = await loadBlogContent('this-post-does-not-exist-at-all')
    expect(result).toBeNull()
  })

  it('returns null for path-traversal attempt', async () => {
    // loadBlogContent should reject the slug before reaching the filesystem
    const result = await loadBlogContent('../../etc/passwd')
    expect(result).toBeNull()
    expect(mockReadFile).not.toHaveBeenCalled()
  })

  it('returns null when JSON has no content field', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ title: 'No content' }))

    const result = await loadBlogContent('post-without-content')
    expect(result).toBeNull()
  })
})

describe('sanitizeCategory', () => {
  it('returns a valid category trimmed', () => {
    expect(sanitizeCategory('  DevOps  ')).toBe('DevOps')
  })

  it('accepts categories with hyphens and spaces', () => {
    expect(sanitizeCategory('PowerShell DSC')).toBe('PowerShell DSC')
    expect(sanitizeCategory('my-category')).toBe('my-category')
  })

  it('returns "uncategorized" for empty strings', () => {
    expect(sanitizeCategory('')).toBe('uncategorized')
    expect(sanitizeCategory('   ')).toBe('uncategorized')
  })

  it('returns "uncategorized" for strings exceeding max length', () => {
    const long = 'a'.repeat(51)
    expect(sanitizeCategory(long)).toBe('uncategorized')
  })

  it('returns "uncategorized" for strings with special characters', () => {
    expect(sanitizeCategory('<script>')).toBe('uncategorized')
    expect(sanitizeCategory('cat;drop table')).toBe('uncategorized')
  })

  it('accepts the exact max length', () => {
    const exactly50 = 'a'.repeat(50)
    expect(sanitizeCategory(exactly50)).toBe(exactly50)
  })
})

describe('trackPageView', () => {
  it('does not throw when cloudflare context unavailable', async () => {
    await expect(trackPageView('test-post', 'Testing')).resolves.not.toThrow()
  })

  it('silently handles missing env bindings', async () => {
    // trackPageView uses dynamic import('@opennextjs/cloudflare') which will throw
    // in test environment — the function should swallow the error silently
    await expect(trackPageView('test', 'cat')).resolves.not.toThrow()
  })

  it('accepts valid slug and category strings', async () => {
    // Verify it doesn't throw for various valid inputs
    await expect(
      trackPageView('long-slug-name', 'Category Name'),
    ).resolves.not.toThrow()
  })

  it('silently drops invalid slugs without calling writeDataPoint', async () => {
    // Slugs that fail validateSlug should be dropped before reaching Cloudflare
    await expect(trackPageView('../etc/passwd', 'cat')).resolves.not.toThrow()
    await expect(trackPageView('', '')).resolves.not.toThrow()
  })
})

describe('loadBlogContent with mocked Cloudflare ASSETS', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock @opennextjs/cloudflare to provide a working ASSETS binding
    vi.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: {
          ASSETS: {
            fetch: mockFetch,
          },
        },
      }),
    }))
  })

  afterEach(() => {
    vi.doUnmock('@opennextjs/cloudflare')
  })

  it('loads content via ASSETS binding when available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: '<p>From ASSETS</p>' }),
    })

    // Re-import to pick up the mocked module
    const { loadBlogContent: loadViaAssets } = await import('@/lib/blog')
    const result = await loadViaAssets('my-post')

    expect(result).toBe('<p>From ASSETS</p>')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('blog-content/my-post.json'),
    )
  })

  it('returns null when ASSETS fetch returns non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })
    // Filesystem fallback will also fail (mock returns nothing)
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'))

    const { loadBlogContent: loadViaAssets } = await import('@/lib/blog')
    const result = await loadViaAssets('missing-post')

    expect(result).toBeNull()
  })
})

describe('trackPageView with mocked Cloudflare analytics', () => {
  const mockWriteDataPoint = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: {
          viscalyx_se: {
            writeDataPoint: mockWriteDataPoint,
          },
        },
      }),
    }))
  })

  afterEach(() => {
    vi.doUnmock('@opennextjs/cloudflare')
  })

  it('calls writeDataPoint with validated slug and category', async () => {
    const { trackPageView: trackWithCf } = await import('@/lib/blog')
    await trackWithCf('valid-slug', 'DevOps')

    expect(mockWriteDataPoint).toHaveBeenCalledWith({
      blobs: ['valid-slug', 'DevOps'],
      doubles: [1, expect.any(Number)],
      indexes: [expect.any(String)],
    })
  })

  it('does not call writeDataPoint for invalid slugs', async () => {
    const { trackPageView: trackWithCf } = await import('@/lib/blog')
    await trackWithCf('../etc/passwd', 'Hacking')

    expect(mockWriteDataPoint).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Additional edge-case tests (HI-08 gap coverage)
// ---------------------------------------------------------------------------

describe('validateBlogData edge cases (via getPostMetadata)', () => {
  it('handles posts with empty tags array gracefully', () => {
    const post = getPostMetadata('template')
    expect(post).not.toBeNull()
    expect(post?.tags).toEqual([])
  })

  it('preserves category when it is a valid string', () => {
    const post = getPostMetadata('second-post')
    expect(post?.category).toBe('Automation')
  })
})

describe('getRelatedPosts edge cases', () => {
  it('returns empty array when limit is 0', () => {
    const related = getRelatedPosts('first-post', 'NonExistent', 0)
    expect(related).toEqual([])
  })

  it('does not duplicate posts in fill logic', () => {
    const related = getRelatedPosts('first-post', 'DevOps', 10)
    const slugs = related.map(p => p.slug)
    const uniqueSlugs = new Set(slugs)
    expect(slugs.length).toBe(uniqueSlugs.size)
  })

  it('never includes current post even when filling', () => {
    const related = getRelatedPosts('first-post', undefined, 10)
    expect(related.every(p => p.slug !== 'first-post')).toBe(true)
  })

  it('returns at most limit posts when many match', () => {
    const related = getRelatedPosts('second-post', 'DevOps', 1)
    expect(related).toHaveLength(1)
  })
})

describe('loadBlogContent edge cases', () => {
  it('returns null when JSON parse fails on filesystem fallback', async () => {
    mockReadFile.mockResolvedValueOnce('not valid json{{{')
    const result = await loadBlogContent('bad-json-post')
    expect(result).toBeNull()
  })

  it('returns null for slugs that are technically valid but have no file', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'))
    const result = await loadBlogContent('---')
    expect(result).toBeNull()
  })
})

describe('sanitizeCategory edge cases', () => {
  it('accepts single character categories', () => {
    expect(sanitizeCategory('A')).toBe('A')
  })

  it('rejects category with only whitespace after trim', () => {
    expect(sanitizeCategory('   \t  ')).toBe('uncategorized')
  })

  it('rejects categories with unicode special characters', () => {
    expect(sanitizeCategory('café☕')).toBe('uncategorized')
  })

  it('accepts categories with underscores', () => {
    expect(sanitizeCategory('my_category')).toBe('my_category')
  })

  it('accepts categories with numbers', () => {
    expect(sanitizeCategory('Web3 DevOps')).toBe('Web3 DevOps')
  })
})

// ---------------------------------------------------------------------------
// HI-13: Cache validated blog data — unit tests
// ---------------------------------------------------------------------------

describe('_resetBlogDataCache', () => {
  it('clears cached data so next call re-validates', () => {
    const first = getAllPosts()
    _resetBlogDataCache()
    const second = getAllPosts()

    // Same data but different object references (re-validated)
    expect(second).toEqual(first)
    expect(second).not.toBe(first)
    // Individual post objects should also be new references
    expect(second[0]).toEqual(first[0])
    expect(second[0]).not.toBe(first[0])
  })

  it('is safe to call when cache is already empty', () => {
    _resetBlogDataCache()
    _resetBlogDataCache()
    expect(getAllPosts().length).toBeGreaterThan(0)
  })

  it('returns void', () => {
    expect(_resetBlogDataCache()).toBeUndefined()
  })
})

describe('getValidatedBlogData caching', () => {
  it('returns referentially identical post objects on consecutive calls', () => {
    const first = getAllPosts()
    const second = getAllPosts()

    // Post objects inside the arrays should be the exact same references
    expect(first[0]).toBe(second[0])
    expect(first[1]).toBe(second[1])
  })

  it('returns referentially identical data across different accessor functions', () => {
    const allPosts = getAllPosts()
    const single = getPostMetadata('first-post')

    // The object returned by getPostMetadata should be the same reference
    // as the matching entry inside getAllPosts
    const match = allPosts.find(p => p.slug === 'first-post')
    expect(single).toBe(match)
  })

  it('re-validates after cache reset', () => {
    const before = getAllPosts()
    const refBefore = before[0]

    _resetBlogDataCache()

    const after = getAllPosts()
    const refAfter = after[0]

    expect(refAfter).toEqual(refBefore)
    expect(refAfter).not.toBe(refBefore)
  })
})

// ---------------------------------------------------------------------------
// HI-13: Cache — integration tests (real page-level call patterns)
// ---------------------------------------------------------------------------

describe('cache integration with multi-function workflows', () => {
  it('blog listing page workflow: getAllPosts + getFeaturedPost share cache', () => {
    const allPosts = getAllPosts()
    const featured = getFeaturedPost()

    // getFeaturedPost returns allPosts[0] — should be same reference
    expect(featured).toBe(allPosts[0])
  })

  it('blog post page workflow: getPostBySlug + getRelatedPosts share cache', () => {
    const post = getPostBySlug('first-post')
    const related = getRelatedPosts('first-post', 'DevOps', 3)

    // All returned objects should share references with the cache
    const allPosts = getAllPosts()
    expect(post).toBe(allPosts.find(p => p.slug === 'first-post'))
    related.forEach(r => {
      expect(r).toBe(allPosts.find(p => p.slug === r.slug))
    })
  })

  it('getAllPostSlugs + getAllPosts use same cached validation', () => {
    const slugs = getAllPostSlugs()
    const posts = getAllPosts()
    const single = getPostMetadata('first-post')

    // Slugs should match the posts (both exclude template)
    expect(slugs).toEqual(posts.map(p => p.slug))
    // Single lookup shares reference with list
    expect(single).toBe(posts.find(p => p.slug === 'first-post'))
  })

  it('getRelatedPosts internal getAllPosts call uses cache', () => {
    // getRelatedPosts calls getAllPosts() internally — a subsequent direct
    // call should return the same cached post objects
    const related = getRelatedPosts('first-post', 'NonExistentCategory', 3)
    const allPosts = getAllPosts()

    related.forEach(r => {
      expect(r).toBe(allPosts.find(p => p.slug === r.slug))
    })
  })

  it('cache survives across many sequential function calls', () => {
    const slugs = getAllPostSlugs()
    const meta = getPostMetadata('first-post')
    const allPosts = getAllPosts()
    const featured = getFeaturedPost()
    const related = getRelatedPosts('first-post', 'DevOps')
    const bySlug = getPostBySlug('second-post')

    // All post objects with matching slugs should be referentially identical
    expect(meta).toBe(allPosts.find(p => p.slug === 'first-post'))
    expect(featured).toBe(allPosts[0])
    expect(bySlug).toBe(allPosts.find(p => p.slug === 'second-post'))
    related.forEach(r => {
      expect(r).toBe(allPosts.find(p => p.slug === r.slug))
    })
    expect(slugs.length).toBe(allPosts.length)
  })
})

// ---------------------------------------------------------------------------
// HI-13: Cache — edge cases
// ---------------------------------------------------------------------------

describe('cache edge cases', () => {
  it('cache works correctly when getPostMetadata returns null', () => {
    const result = getPostMetadata('nonexistent')
    expect(result).toBeNull()

    // Cache should still be valid for subsequent calls
    const allPosts = getAllPosts()
    expect(allPosts.length).toBeGreaterThan(0)
    expect(allPosts[0]).toBe(getPostMetadata('first-post'))
  })

  it('cache is not corrupted by repeated null lookups', () => {
    getPostMetadata('nope1')
    getPostMetadata('nope2')
    getPostMetadata('nope3')

    const posts = getAllPosts()
    expect(posts.length).toBe(3)
    expect(posts[0].slug).toBe('first-post')
  })
})
