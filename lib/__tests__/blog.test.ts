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
  it('does not throw when cloudflare context unavailable', () => {
    expect(() => trackPageView('test-post', 'Testing')).not.toThrow()
  })

  it('silently handles missing env bindings', () => {
    // trackPageView uses require('@opennextjs/cloudflare') which will throw
    // in test environment — the function should swallow the error silently
    expect(() => trackPageView('test', 'cat')).not.toThrow()
  })

  it('accepts any slug and category strings', () => {
    // Verify it doesn't throw for various inputs
    expect(() => trackPageView('', '')).not.toThrow()
    expect(() => trackPageView('long-slug-name', 'Category Name')).not.toThrow()
  })
})
