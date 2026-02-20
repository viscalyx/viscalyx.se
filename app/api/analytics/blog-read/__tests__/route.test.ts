import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '../route'

const mockWriteDataPoint = vi.fn()
const mockGetCloudflareContext = vi.fn()

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => mockGetCloudflareContext(),
}))

describe('blog-read analytics route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ANALYTICS_HASH_SECRET = 'test-secret'
    mockGetCloudflareContext.mockReturnValue({
      env: { viscalyx_se: { writeDataPoint: mockWriteDataPoint } },
    })
  })

  const createRequest = (body: Record<string, unknown>, headers?: HeadersInit) =>
    new Request('https://viscalyx.org/api/analytics/blog-read', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://viscalyx.org',
        ...headers,
      },
      body: JSON.stringify(body),
    })

  it('rejects requests from invalid origin', async () => {
    const req = createRequest(
      { slug: 'a', category: 'b', title: 'c' },
      { origin: 'https://attacker.example' }
    )
    const res = await POST(req)

    expect(res.status).toBe(403)
    expect(await res.json()).toEqual({ error: 'Forbidden' })
  })

  it('rejects malformed origin header values', async () => {
    const req = createRequest(
      { slug: 'a', category: 'b', title: 'c' },
      { origin: 'not-a-url' }
    )
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('accepts referer validation when origin header is absent', async () => {
    const req = createRequest(
      { slug: 'slug', category: 'cat', title: 'title' },
      {
        origin: '',
        referer: 'https://viscalyx.org/en/blog',
      }
    )

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
  })

  it('rejects malformed referer values when origin is absent', async () => {
    const req = createRequest(
      { slug: 'slug', category: 'cat', title: 'title' },
      {
        origin: '',
        referer: 'not-a-url',
      }
    )

    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('rejects requests without origin and referer headers', async () => {
    const req = createRequest(
      { slug: 'slug', category: 'cat', title: 'title' },
      { origin: '' }
    )
    req.headers.delete('referer')
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('returns 400 when required fields are missing', async () => {
    const req = createRequest({ slug: 'slug-only' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      error: 'Missing required fields: slug, category, and title',
    })
  })

  it('writes analytics datapoint for valid payload', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
      readProgress: 50,
      timeSpent: 22,
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockWriteDataPoint).toHaveBeenCalledTimes(1)
    expect(mockWriteDataPoint.mock.calls[0][0].blobs[0]).toBe('my-post')
  })

  it('hashes client IP and stores hashed visitor identifier', async () => {
    const req = createRequest(
      { slug: 'my-post', category: 'automation', title: 'My Post' },
      { 'cf-connecting-ip': '203.0.113.10' }
    )

    await POST(req)

    const hashed = mockWriteDataPoint.mock.calls[0][0].blobs[6]
    expect(hashed).toMatch(/^[a-f0-9]{64}$/)
  })

  it('falls back to anonymous identifier when no client IP exists', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
    })

    await POST(req)

    expect(mockWriteDataPoint.mock.calls[0][0].blobs[6]).toBe('anonymous')
  })

  it('continues when IP hashing fails', async () => {
    delete process.env.ANALYTICS_HASH_SECRET
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const req = createRequest(
      { slug: 'my-post', category: 'automation', title: 'My Post' },
      { 'cf-connecting-ip': '203.0.113.2' }
    )

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to hash client IP:',
      expect.any(Error)
    )
  })

  it('continues when Cloudflare context retrieval fails', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockGetCloudflareContext.mockImplementation(() => {
      throw new Error('context failed')
    })
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to get Cloudflare context for analytics:',
      expect.any(Error)
    )
  })

  it('returns 500 when request parsing throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const req = {
      headers: new Headers({ origin: 'https://viscalyx.org' }),
      json: async () => {
        throw new Error('bad body')
      },
    } as unknown as Request

    const res = await POST(req)

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Failed to track blog read' })
    expect(errorSpy).toHaveBeenCalledWith(
      'Error tracking blog read:',
      expect.any(Error)
    )
  })
})
