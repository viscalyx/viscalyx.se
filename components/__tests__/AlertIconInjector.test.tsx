import { act, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AlertIconInjector } from '@/components/AlertIconInjector'

// Mock react-dom/client so we can observe createRoot calls without creating real React roots.
const { renderMock, unmountMock, createRootMock } = vi.hoisted(() => {
  const renderMock = vi.fn()
  const unmountMock = vi.fn()
  const createRootMock = vi.fn((_container?: unknown) => ({
    render: renderMock,
    unmount: unmountMock,
  }))

  return { renderMock, unmountMock, createRootMock }
})

vi.mock('react-dom/client', () => ({
  // Forward the first argument only (the container element). This avoids TS2556
  // under newer TS versions where spreading `any[]` into a non-rest function
  // is disallowed.
  createRoot: (container: unknown) => createRootMock(container),
}))

describe('AlertIconInjector', () => {
  const renderInjector = (
    contentKey = 'k1',
    children: ReactNode = <div>children</div>,
  ) =>
    render(
      <AlertIconInjector contentKey={contentKey}>{children}</AlertIconInjector>,
    )

  const flushInjectionDelay = async () => {
    await act(async () => {
      vi.advanceTimersByTime(60)
    })
  }

  const flushDeferredCleanup = async () => {
    await act(async () => {
      vi.advanceTimersByTime(0)
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
    renderMock.mockClear()
    unmountMock.mockClear()
    createRootMock.mockClear()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('should inject an icon container and render an AlertIcon for each supported alert title', async () => {
    renderInjector(
      'k1',
      <div>
        <div className="github-alert-title" data-alert-icon="note">
          Note title
        </div>
        <div className="github-alert-title" data-alert-icon="warning">
          Warning title
        </div>
      </div>,
    )
    await flushInjectionDelay()

    const containers = document.querySelectorAll('.alert-icon-container')
    expect(containers).toHaveLength(2)

    // The container should be inserted as the first child of each title.
    const titles = document.querySelectorAll('.github-alert-title')
    expect(titles[0].firstChild).toBe(containers[0])
    expect(titles[1].firstChild).toBe(containers[1])

    expect(createRootMock).toHaveBeenCalledTimes(2)
    expect(renderMock).toHaveBeenCalledTimes(2)
  })

  it('should not inject icons for unsupported data-alert-icon values', async () => {
    renderInjector(
      'k1',
      <div>
        <div className="github-alert-title" data-alert-icon="note">
          Note title
        </div>
        <div className="github-alert-title" data-alert-icon="invalid">
          Invalid title
        </div>
        <div className="github-alert-title" data-alert-icon="">
          Empty title
        </div>
      </div>,
    )
    await flushInjectionDelay()

    const containers = document.querySelectorAll('.alert-icon-container')
    expect(containers).toHaveLength(1)

    expect(createRootMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
  })

  it('should remove existing icon containers before injecting new ones to avoid duplicates', async () => {
    const alertTitleChildren = (
      <div>
        <div className="github-alert-title" data-alert-icon="note">
          Note title
        </div>
      </div>
    )

    const { rerender } = renderInjector('k1', alertTitleChildren)
    await flushInjectionDelay()

    expect(document.querySelectorAll('.alert-icon-container')).toHaveLength(1)

    // Re-run the effect with a new content key.
    rerender(
      <AlertIconInjector contentKey="k2">
        {alertTitleChildren}
      </AlertIconInjector>,
    )

    await flushInjectionDelay()

    // Still exactly one container: the old one should have been removed before injection.
    expect(document.querySelectorAll('.alert-icon-container')).toHaveLength(1)
    expect(createRootMock).toHaveBeenCalledTimes(2)
    expect(renderMock).toHaveBeenCalledTimes(2)
  })

  it('should unmount created roots and remove icon containers on cleanup', async () => {
    const { unmount } = renderInjector(
      'k1',
      <div>
        <div className="github-alert-title" data-alert-icon="note">
          Note title
        </div>
        <div className="github-alert-title" data-alert-icon="tip">
          Tip title
        </div>
      </div>,
    )
    await flushInjectionDelay()

    expect(document.querySelectorAll('.alert-icon-container')).toHaveLength(2)

    unmount()

    // Cleanup uses setTimeout(..., 0) to defer unmount.
    await flushDeferredCleanup()

    // Depending on React/StrictMode behavior and how effects are flushed,
    // cleanup may unmount an extra time. Assert at least the expected roots
    // were unmounted.
    expect(unmountMock.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(document.querySelectorAll('.alert-icon-container')).toHaveLength(0)
  })

  it('should warn if unmount throws during cleanup', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    unmountMock.mockImplementationOnce(() => {
      throw new Error('boom')
    })

    const { unmount } = renderInjector(
      'k1',
      <div>
        <div className="github-alert-title" data-alert-icon="note">
          Note title
        </div>
      </div>,
    )
    await flushInjectionDelay()

    unmount()

    await flushDeferredCleanup()

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain(
      'Error unmounting AlertIcon root:',
    )
  })

  it('should do nothing when no alert title nodes exist', async () => {
    renderInjector(
      'k1',
      <div>
        <p>No alerts here</p>
      </div>,
    )
    await flushInjectionDelay()

    expect(document.querySelectorAll('.alert-icon-container')).toHaveLength(0)
    expect(createRootMock).not.toHaveBeenCalled()
    expect(renderMock).not.toHaveBeenCalled()
  })

  it('should remove stale pre-existing icon containers for the same content key before new injection', async () => {
    renderInjector(
      'k1',
      <div>
        <div className="github-alert-title" data-alert-icon="note">
          <span className="alert-icon-container" data-content-key="k1">
            stale
          </span>
          Note title
        </div>
      </div>,
    )
    await flushInjectionDelay()

    const containers = document.querySelectorAll('.alert-icon-container')
    expect(containers).toHaveLength(1)
    expect(containers[0]).toHaveAttribute('data-content-key', 'k1')
    expect(containers[0].textContent).not.toContain('stale')
  })

  it('should cancel pending injection when unmounted before timeout fires', async () => {
    const { unmount } = renderInjector(
      'k1',
      <div>
        <div className="github-alert-title" data-alert-icon="note">
          Note title
        </div>
      </div>,
    )
    unmount()

    await flushInjectionDelay()
    await flushDeferredCleanup()

    expect(document.querySelectorAll('.alert-icon-container')).toHaveLength(0)
    expect(createRootMock).not.toHaveBeenCalled()
    expect(renderMock).not.toHaveBeenCalled()
  })

  it('should not inject icons into alert titles outside this component instance root', async () => {
    render(
      <div>
        <AlertIconInjector contentKey="k1">
          <div className="github-alert-title" data-alert-icon="note">
            Inside title
          </div>
        </AlertIconInjector>
        <div className="github-alert-title" data-alert-icon="warning">
          Outside title
        </div>
      </div>,
    )

    await flushInjectionDelay()

    const containers = document.querySelectorAll('.alert-icon-container')
    expect(containers).toHaveLength(1)

    const titles = document.querySelectorAll('.github-alert-title')
    expect(titles[0].querySelector('.alert-icon-container')).not.toBeNull()
    expect(titles[1].querySelector('.alert-icon-container')).toBeNull()
  })
})
