import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

const { dynamicMock } = vi.hoisted(() => ({
  dynamicMock: vi.fn((_loader, _options) => {
    const MockedDynamicComponent = () => (
      <div data-testid="cookie-settings-dynamic">Cookie Settings Dynamic</div>
    )

    return MockedDynamicComponent
  }),
}))

vi.mock('next/dynamic', () => ({
  default: dynamicMock,
}))

import CookieSettingsWrapper from '../CookieSettingsWrapper'

describe('CookieSettingsWrapper', () => {
  it('configures client-only dynamic import with a loading fallback', () => {
    expect(dynamicMock).toHaveBeenCalledTimes(1)

    const options = dynamicMock.mock.calls[0][1] as {
      ssr?: boolean
      loading?: () => ReactElement
    }

    expect(options.ssr).toBe(false)
    expect(options.loading).toBeTypeOf('function')

    const { container } = render(options.loading!())
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(container.querySelectorAll('.h-4, .h-6')).toHaveLength(3)
  })

  it('uses a loader that resolves to CookieSettings module', async () => {
    const loader = dynamicMock.mock.calls[0][0] as () => Promise<{
      default: unknown
    }>
    const loadedModule = await loader()
    expect(loadedModule).toHaveProperty('default')
  })

  it('renders the dynamically imported CookieSettings component', () => {
    render(<CookieSettingsWrapper />)

    expect(screen.getByTestId('cookie-settings-dynamic')).toBeInTheDocument()
  })
})
