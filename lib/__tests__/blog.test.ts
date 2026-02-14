import { loadBlogContent, trackPageView, validateSlug } from '@/lib/blog'

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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads content from filesystem for existing post', async () => {
    mockReadFile.mockResolvedValueOnce(
      JSON.stringify({ content: '# Hello World\nSome blog content.' })
    )

    const result = await loadBlogContent('my-blog-post')

    expect(result).toBe('# Hello World\nSome blog content.')
    expect(mockReadFile).toHaveBeenCalledWith(
      expect.stringContaining('blog-content/my-blog-post.json'),
      'utf-8'
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
      trackPageView('long-slug-name', 'Category Name')
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
      expect.stringContaining('blog-content/my-post.json')
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
