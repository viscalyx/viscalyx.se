import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { invalidateConsentCache, useBlogAnalytics } from '@/lib/analytics'
import { hasConsent } from '@/lib/cookie-consent'

// Mock the cookie consent module
vi.mock('@/lib/cookie-consent', () => ({
  hasConsent: vi.fn(),
}))

// Mock fetch
global.fetch = vi.fn()

describe('useBlogAnalytics', () => {
  const mockBlogData = {
    slug: 'test-blog-post',
    category: 'Technology',
    title: 'Test Blog Post',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    // Invalidate analytics consent cache between tests
    invalidateConsentCache()

    // Mock Date.now to return a consistent timestamp
    const mockStartTime = 1640995200000 // 2022-01-01 00:00:00 UTC
    vi.setSystemTime(mockStartTime)

    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    )

    // Mock DOM APIs
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    })

    // Mock navigator.sendBeacon
    Object.defineProperty(navigator, 'sendBeacon', {
      value: vi.fn().mockReturnValue(true),
      writable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should track events when analytics consent is given', async () => {
    vi.mocked(hasConsent).mockReturnValue(true)

    const { result } = renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
      }),
    )

    // Trigger a manual tracking event
    await act(async () => {
      await result.current.trackEvent(50, 30)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/analytics/blog-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: 'test-blog-post',
        category: 'Technology',
        title: 'Test Blog Post',
        readProgress: 50,
        timeSpent: 30,
      }),
    })
  })

  it('should not track events when analytics consent is denied', async () => {
    vi.mocked(hasConsent).mockReturnValue(false)

    const { result } = renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
      }),
    )

    // Trigger a manual tracking event
    await act(async () => {
      await result.current.trackEvent(50, 30)
    })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should not track scroll events when analytics consent is denied', async () => {
    vi.mocked(hasConsent).mockReturnValue(false)

    renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
        progressThreshold: 50,
      }),
    )

    // Simulate scroll to 50% - this should not trigger tracking
    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 250 })
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 250,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    // Advance timers to trigger any throttled events
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should track scroll events when analytics consent is given', async () => {
    vi.mocked(hasConsent).mockReturnValue(true)

    renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
        progressThreshold: 50,
      }),
    )

    // Advance time to trigger initial page view (1000ms timeout)
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Advance time to simulate elapsed time for timeSpent calculation
    act(() => {
      vi.advanceTimersByTime(5000) // Simulate 5 more seconds elapsed (total 6s)
    })

    // Simulate scroll to 50%
    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 250 })
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 250,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    // Advance timers to trigger throttled events (100ms throttle + some buffer)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(global.fetch).toHaveBeenCalledTimes(2)

    // Verify initial page view call
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      '/api/analytics/blog-read',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"readProgress":0'),
      }),
    )

    // Verify scroll tracking call
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      '/api/analytics/blog-read',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"readProgress":50'),
      }),
    )

    // Verify that timeSpent is calculated correctly (6 seconds total)
    const scrollCallArgs = vi.mocked(global.fetch).mock.calls[1]
    const requestBody = JSON.parse(scrollCallArgs[1]?.body as string)
    expect(requestBody.timeSpent).toBe(6)
  })

  it('should not use sendBeacon on page unload when analytics consent is denied', async () => {
    vi.mocked(hasConsent).mockReturnValue(false)

    renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
      }),
    )

    // Advance time to simulate some elapsed time
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Simulate page unload
    act(() => {
      window.dispatchEvent(new Event('beforeunload'))
    })

    expect(navigator.sendBeacon).not.toHaveBeenCalled()
  })

  it('should use sendBeacon on page unload when analytics consent is given', async () => {
    vi.mocked(hasConsent).mockReturnValue(true)

    renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
      }),
    )

    // Advance time to simulate elapsed time for timeSpent calculation
    act(() => {
      vi.advanceTimersByTime(3000) // Simulate 3 seconds elapsed
    })

    // Simulate page unload
    act(() => {
      window.dispatchEvent(new Event('beforeunload'))
    })

    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1)

    // Verify payload is a Blob with application/json Content-Type
    const sendBeaconCall = vi.mocked(navigator.sendBeacon).mock.calls[0]
    expect(sendBeaconCall[0]).toBe('/api/analytics/blog-read')
    const blob = sendBeaconCall[1] as Blob
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/json')

    // Verify payload contents by comparing blob size with expected JSON
    const expectedPayload = JSON.stringify({
      slug: 'test-blog-post',
      category: 'Technology',
      title: 'Test Blog Post',
      readProgress: 0,
      timeSpent: 3,
    })
    expect(blob.size).toBe(expectedPayload.length)
  })
})
