import { describe, expect, it, vi } from 'vitest'
import RootLayout, { metadata } from '../layout'
import { metadata as metadataObject } from '../metadata'

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(async () => 'en'),
}))

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mocked-inter' }),
}))

vi.mock('@/lib/theme-context', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}))

describe('RootLayout', () => {
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
    const htmlElement = ui as unknown as { props: { children: unknown[] } }
    const head = htmlElement.props.children[0] as {
      props: { children: { props: { dangerouslySetInnerHTML: { __html: string } } } }
    }
    const scriptContent = head.props.children.props.dangerouslySetInnerHTML.__html

    expect(scriptContent).toContain("localStorage.getItem('theme')")
    expect(scriptContent).toContain("document.documentElement.classList")
  })

  it('re-exports metadata object', () => {
    expect(metadata).toBe(metadataObject)
  })
})
