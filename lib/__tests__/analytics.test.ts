import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBlogAnalytics } from '../analytics'
import { renderHook, act } from '@testing-library/react'
import { hasConsent } from '../cookie-consent'

// Mock the cookie consent module
vi.mock('../cookie-consent', () => ({
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
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
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

  it('should track events when analytics consent is given', async () => {
    vi.mocked(hasConsent).mockReturnValue(true)

    const { result } = renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
      })
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
      })
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
      })
    )

    // Simulate scroll to 50% - this should not trigger tracking
    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 250 })
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 250,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    // Wait for any throttled events
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
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
      })
    )

    // Simulate scroll to 50%
    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 250 })
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 250,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    // Wait for throttled events
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
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
        timeSpent: expect.any(Number),
      }),
    })
  })

  it('should not use sendBeacon on page unload when analytics consent is denied', async () => {
    vi.mocked(hasConsent).mockReturnValue(false)

    renderHook(() =>
      useBlogAnalytics(mockBlogData, {
        trackReadProgress: true,
        trackTimeSpent: true,
      })
    )

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
      })
    )

    // Simulate page unload
    act(() => {
      window.dispatchEvent(new Event('beforeunload'))
    })

    expect(navigator.sendBeacon).toHaveBeenCalledWith(
      '/api/analytics/blog-read',
      JSON.stringify({
        slug: 'test-blog-post',
        category: 'Technology',
        title: 'Test Blog Post',
        readProgress: 0,
        timeSpent: expect.any(Number),
      })
    )
  })
})
