import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/analytics/blog-read/route'

const mockWriteDataPoint = vi.fn()
const mockGetCloudflareContext = vi.fn()

/** Index of the hashed-IP blob in the writeDataPoint blobs array (blob7). */
const BLOB_INDEX_HASHED_IP = 6

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => mockGetCloudflareContext(),
}))

/** Snapshot of process.env before the test suite runs. */
const originalEnv = { ...process.env }

describe('blog-read analytics route', () => {
  afterAll(() => {
    if (originalEnv.ANALYTICS_HASH_SECRET === undefined) {
      delete process.env.ANALYTICS_HASH_SECRET
    } else {
      process.env.ANALYTICS_HASH_SECRET = originalEnv.ANALYTICS_HASH_SECRET
    }
    if (originalEnv.STORE_HASHED_IP === undefined) {
      delete process.env.STORE_HASHED_IP
    } else {
      process.env.STORE_HASHED_IP = originalEnv.STORE_HASHED_IP
    }
  })

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    process.env.ANALYTICS_HASH_SECRET = 'test-secret'
    delete process.env.STORE_HASHED_IP
    mockGetCloudflareContext.mockReturnValue({
      env: { viscalyx_se: { writeDataPoint: mockWriteDataPoint } },
    })
  })

  const createRequest = (body: unknown, headers?: HeadersInit) =>
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
      { origin: 'https://attacker.example' },
    )
    const res = await POST(req)

    expect(res.status).toBe(403)
    expect(await res.json()).toEqual({ error: 'Forbidden' })
  })

  it('rejects malformed origin header values', async () => {
    const req = createRequest(
      { slug: 'a', category: 'b', title: 'c' },
      { origin: 'not-a-url' },
    )
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('accepts referer validation when origin header is absent', async () => {
    const req = createRequest(
      { slug: 'slug', category: 'cat', title: 'title' },
      {
        referer: 'https://viscalyx.org/en/blog',
      },
    )
    req.headers.delete('origin')

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
  })

  it('rejects malformed referer values when origin is absent', async () => {
    const req = createRequest(
      { slug: 'slug', category: 'cat', title: 'title' },
      {
        referer: 'not-a-url',
      },
    )
    req.headers.delete('origin')

    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('rejects requests without origin and referer headers', async () => {
    const req = createRequest({ slug: 'slug', category: 'cat', title: 'title' })
    req.headers.delete('origin')
    req.headers.delete('referer')
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('returns 400 when required fields are missing', async () => {
    const req = createRequest({ slug: 'slug-only' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      error: 'Missing or invalid fields: slug, category, title',
    })
  })

  it('returns 400 for non-object JSON body', async () => {
    const req = new Request('https://viscalyx.org/api/analytics/blog-read', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://viscalyx.org',
      },
      body: JSON.stringify([]),
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      error: 'Request body must be a JSON object',
    })
  })

  it('returns 400 for invalid JSON body', async () => {
    const req = new Request('https://viscalyx.org/api/analytics/blog-read', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://viscalyx.org',
      },
      body: 'not valid json{{{',
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      error: 'Invalid JSON',
    })
  })

  it('returns 400 when required fields are not non-empty strings', async () => {
    const req = createRequest({
      slug: ' ',
      category: 123,
      title: ['bad'],
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      error: 'Missing or invalid fields: slug, category, title',
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

  it('sanitizes invalid readProgress/timeSpent values before analytics write', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
      readProgress: { invalid: true },
      timeSpent: 'not-a-number',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockWriteDataPoint).toHaveBeenCalledTimes(1)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[1]).toBe(0)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[2]).toBe(0)
  })

  it('coerces numeric string readProgress/timeSpent values before analytics write', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
      readProgress: '50.5',
      timeSpent: '22',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockWriteDataPoint).toHaveBeenCalledTimes(1)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[1]).toBe(50.5)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[2]).toBe(22)
  })

  it('clamps readProgress to 100 and timeSpent to 0', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
      readProgress: 150,
      timeSpent: -5,
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockWriteDataPoint).toHaveBeenCalledTimes(1)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[1]).toBe(100)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[2]).toBe(0)
  })

  it('sanitizes partially numeric strings to zero', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
      readProgress: '50abc',
      timeSpent: '22s',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockWriteDataPoint).toHaveBeenCalledTimes(1)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[1]).toBe(0)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[2]).toBe(0)
  })

  it('stores anonymous identifier when hashed IP storage is disabled', async () => {
    // STORE_HASHED_IP defaults to unset (false) in test env
    const req = createRequest(
      { slug: 'my-post', category: 'automation', title: 'My Post' },
      { 'cf-connecting-ip': '203.0.113.10' },
    )

    await POST(req)

    const stored =
      mockWriteDataPoint.mock.calls[0][0].blobs[BLOB_INDEX_HASHED_IP]
    expect(stored).toBe('anonymous')
  })

  it('falls back to anonymous identifier when no client IP exists', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
    })

    await POST(req)

    expect(
      mockWriteDataPoint.mock.calls[0][0].blobs[BLOB_INDEX_HASHED_IP],
    ).toBe('anonymous')
  })

  it('does not attempt IP hashing when gate is disabled', async () => {
    // STORE_HASHED_IP is not set, so even without the secret the
    // route should succeed without a hash warning.
    delete process.env.ANALYTICS_HASH_SECRET
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const req = createRequest(
      { slug: 'my-post', category: 'automation', title: 'My Post' },
      { 'cf-connecting-ip': '203.0.113.2' },
    )

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(warnSpy).not.toHaveBeenCalled()
    expect(
      mockWriteDataPoint.mock.calls[0][0].blobs[BLOB_INDEX_HASHED_IP],
    ).toBe('anonymous')
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
      expect.any(Error),
    )
  })

  it('returns 400 when request parsing throws', async () => {
    const req = {
      headers: new Headers({ origin: 'https://viscalyx.org' }),
      json: async () => {
        throw new Error('bad body')
      },
    } as unknown as Request

    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Invalid JSON' })
  })

  it('treats whitespace-only string metrics as null', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
      readProgress: '   ',
      timeSpent: '\t',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[1]).toBe(0)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[2]).toBe(0)
  })

  it('treats NaN and Infinity metric values as null', async () => {
    // Bypass JSON serialization (NaN/Infinity become null in JSON)
    const req = {
      headers: new Headers({ origin: 'https://viscalyx.org' }),
      json: async () => ({
        slug: 'my-post',
        category: 'automation',
        title: 'My Post',
        readProgress: Number.NaN,
        timeSpent: Number.POSITIVE_INFINITY,
      }),
    } as unknown as Request

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[1]).toBe(0)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[2]).toBe(0)
  })

  it('treats numeric strings that overflow to Infinity as null', async () => {
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
      readProgress: '1e999',
      timeSpent: '-1e999',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[1]).toBe(0)
    expect(mockWriteDataPoint.mock.calls[0][0].doubles[2]).toBe(0)
  })

  it('stores hashed IP when STORE_HASHED_IP is enabled', async () => {
    process.env.STORE_HASHED_IP = 'true'
    const req = createRequest(
      { slug: 'my-post', category: 'automation', title: 'My Post' },
      { 'cf-connecting-ip': '203.0.113.1' },
    )

    const res = await POST(req)

    expect(res.status).toBe(200)
    const stored =
      mockWriteDataPoint.mock.calls[0][0].blobs[BLOB_INDEX_HASHED_IP]
    expect(stored).not.toBe('anonymous')
    expect(stored).toMatch(/^[0-9a-f]{64}$/)
  })

  it('warns and falls back when hashIP fails due to missing secret', async () => {
    process.env.STORE_HASHED_IP = 'true'
    delete process.env.ANALYTICS_HASH_SECRET
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const req = createRequest(
      { slug: 'my-post', category: 'automation', title: 'My Post' },
      { 'cf-connecting-ip': '203.0.113.1' },
    )

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to hash client IP:',
      expect.any(Error),
    )
    expect(
      mockWriteDataPoint.mock.calls[0][0].blobs[BLOB_INDEX_HASHED_IP],
    ).toBe('anonymous')
  })

  it('returns 500 when an unexpected error occurs', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
      throw new Error('unexpected failure')
    })
    const req = createRequest({
      slug: 'my-post',
      category: 'automation',
      title: 'My Post',
    })

    const res = await POST(req)

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Failed to track blog read' })
    expect(errorSpy).toHaveBeenCalled()
  })
})

describe('SITE_URL module-level validation', () => {
  it('throws when SITE_URL is not a valid URL', async () => {
    vi.resetModules()
    vi.doMock('@/lib/constants', () => ({ SITE_URL: 'not-a-url' }))
    vi.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: vi.fn(),
    }))

    await expect(import('@/app/api/analytics/blog-read/route')).rejects.toThrow(
      'SITE_URL is not a valid URL',
    )
  })
})
