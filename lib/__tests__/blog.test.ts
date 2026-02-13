import { loadBlogContent, trackPageView, validateSlug } from '../blog'

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

describe('loadBlogContent', () => {
  it('loads content from filesystem for existing post', async () => {
    // Uses a real blog content file from public/blog-content/
    const result = await loadBlogContent('automating-power-bi-rs-with-dsc-v3')

    expect(result).not.toBeNull()
    expect(typeof result).toBe('string')
    expect(result!.length).toBeGreaterThan(0)
  })

  it('returns null for non-existent post', async () => {
    const result = await loadBlogContent('this-post-does-not-exist-at-all')
    expect(result).toBeNull()
  })

  it('returns null for path-traversal attempt', async () => {
    // Even if someone bypasses validateSlug, loadBlogContent should fail safely
    const result = await loadBlogContent('../../etc/passwd')
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
