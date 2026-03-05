import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { intlMiddlewareMock } = vi.hoisted(() => {
  const { NextResponse } = require('next/server')
  return {
    intlMiddlewareMock: vi.fn(() => NextResponse.next()),
  }
})

vi.mock('next-intl/middleware', () => ({
  default: () => intlMiddlewareMock,
}))

vi.mock('@/i18n', () => ({
  locales: ['en', 'sv'],
}))

// Import after mocks are set up
const { default: middleware } = await import('@/middleware')

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(url = 'https://example.com/en'): NextRequest {
    return new NextRequest(new URL(url))
  }

  it('propagates x-nonce as a request-header override', () => {
    const response = middleware(createRequest())
    const nonce = response.headers.get('x-middleware-request-x-nonce')

    expect(nonce).toBeTruthy()
    expect(nonce).toMatch(/^[A-Za-z0-9+/]{22}$/)

    const overrides = response.headers.get('x-middleware-override-headers')
    expect(overrides).toContain('x-nonce')
  })

  it('generates a unique nonce per request', () => {
    const response1 = middleware(createRequest())
    const response2 = middleware(createRequest())

    expect(response1.headers.get('x-middleware-request-x-nonce')).not.toBe(
      response2.headers.get('x-middleware-request-x-nonce'),
    )
  })

  it('sets Content-Security-Policy header with nonce in script-src', () => {
    const response = middleware(createRequest())
    const csp = response.headers.get('Content-Security-Policy')
    const nonce = response.headers.get('x-middleware-request-x-nonce')

    expect(csp).toContain(`'nonce-${nonce}'`)
    expect(csp).toContain("script-src 'self'")
    // script-src must not contain 'unsafe-inline' — extract the directive
    const scriptSrc = csp?.match(/script-src[^;]*/)?.[0]
    expect(scriptSrc).not.toContain("'unsafe-inline'")
  })

  it('splits style-src into elem and attr directives', () => {
    const response = middleware(createRequest())
    const csp = response.headers.get('Content-Security-Policy')

    // style-src-elem blocks injected <style> elements (only same-origin allowed)
    expect(csp).toContain("style-src-elem 'self'")
    // style-src-attr allows inline style attributes (Framer Motion + Shiki)
    expect(csp).toContain("style-src-attr 'unsafe-inline'")
    // The broad style-src 'unsafe-inline' must not be present
    expect(csp).not.toContain("style-src 'self' 'unsafe-inline'")
  })

  it('includes all required CSP directives', () => {
    const response = middleware(createRequest())
    const csp = response.headers.get('Content-Security-Policy')

    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("img-src 'self' data:")
    expect(csp).toContain("font-src 'self'")
    expect(csp).toContain("connect-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("form-action 'self'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("base-uri 'self'")
  })
})
