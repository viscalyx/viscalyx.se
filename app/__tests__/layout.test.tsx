import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RootLayout, { metadata } from '@/app/layout'
import { metadata as metadataObject } from '@/app/metadata'

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

describe('RootLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const findThemeScriptNode = (
    node: unknown
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

  it('re-exports metadata object', () => {
    expect(metadata).toBe(metadataObject)
  })
})
