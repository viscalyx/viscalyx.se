import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RootLayout, { metadata } from '@/app/layout'
import { metadata as metadataObject } from '@/app/metadata'

const { getOrganizationJsonLdMock, getWebSiteJsonLdMock } = vi.hoisted(() => ({
  getOrganizationJsonLdMock: vi.fn(() => ({ '@type': 'Organization' })),
  getWebSiteJsonLdMock: vi.fn(() => ({ '@type': 'WebSite' })),
}))

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(async () => 'en'),
  getTranslations: vi.fn(async () => (key: string) => key),
  getFormatter: vi.fn(async () => ({
    dateTime: (d: string | number | Date) => new Date(d).toISOString(),
  })),
}))

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mocked-inter' }),
}))

vi.mock('@/lib/theme-context', () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}))

vi.mock('@/lib/structured-data', () => ({
  getOrganizationJsonLd: () => getOrganizationJsonLdMock(),
  getWebSiteJsonLd: () => getWebSiteJsonLdMock(),
}))

describe('RootLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const findThemeScriptNode = (
    node: unknown,
  ): { props: Record<string, unknown> } | null => {
    if (!node || typeof node !== 'object') {
      return null
    }
    const candidate = node as {
      type?: unknown
      props?: Record<string, unknown>
    }

    if (
      candidate.type === 'script' &&
      candidate.props?.id === 'theme-init-script'
    ) {
      return candidate as { props: Record<string, unknown> }
    }

    const children = candidate.props?.children
    const childList = Array.isArray(children) ? children : [children]
    for (const child of childList) {
      const found = findThemeScriptNode(child)
      if (found) return found
    }
    return null
  }

  const findScriptNodeById = (
    node: unknown,
    id: string,
  ): { props: Record<string, unknown> } | null => {
    if (!node || typeof node !== 'object') {
      return null
    }

    const candidate = node as {
      type?: unknown
      props?: Record<string, unknown>
    }

    if (candidate.type === 'script' && candidate.props?.id === id) {
      return candidate as { props: Record<string, unknown> }
    }

    const children = candidate.props?.children
    const childList = Array.isArray(children) ? children : [children]
    for (const child of childList) {
      const found = findScriptNodeById(child, id)
      if (found) return found
    }
    return null
  }

  it('renders html/body shell with locale and theme provider', async () => {
    const ui = await RootLayout({
      children: <main data-testid="child">child</main>,
    })
    const htmlElement = ui as unknown as {
      type: string
      props: Record<string, unknown>
    }

    expect(htmlElement.type).toBe('html')
    expect(htmlElement.props.lang).toBe('en')
    expect(String(htmlElement.props.className)).toContain('scroll-smooth')
    expect(String(htmlElement.props.className)).toContain('mocked-inter')
  })

  it('injects anti-FOUC theme bootstrap script', async () => {
    const ui = await RootLayout({ children: <div /> })
    const scriptNode = findThemeScriptNode(ui)

    expect(scriptNode).not.toBeNull()
    const scriptContent = String(scriptNode?.props.children ?? '')

    expect(scriptContent).toContain("localStorage.getItem('theme')")
    expect(scriptContent).toContain('document.documentElement.classList')
  })

  it('emits organization and website JSON-LD scripts in head', async () => {
    const ui = await RootLayout({ children: <div /> })

    const organizationScriptNode = findScriptNodeById(ui, 'organization-jsonld')
    const websiteScriptNode = findScriptNodeById(ui, 'website-jsonld')

    expect(getOrganizationJsonLdMock).toHaveBeenCalledTimes(1)
    expect(getWebSiteJsonLdMock).toHaveBeenCalledTimes(1)
    expect(organizationScriptNode).not.toBeNull()
    expect(websiteScriptNode).not.toBeNull()
    expect(String(organizationScriptNode?.props.children)).toBe(
      JSON.stringify(getOrganizationJsonLdMock.mock.results[0].value),
    )
    expect(String(websiteScriptNode?.props.children)).toBe(
      JSON.stringify(getWebSiteJsonLdMock.mock.results[0].value),
    )
  })

  it('re-exports metadata object', () => {
    expect(metadata).toBe(metadataObject)
  })
})
