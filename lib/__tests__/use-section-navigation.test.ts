import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSectionNavigation } from '../use-section-navigation'

// Mock next/navigation
const pushMock = vi.fn()
let mockPathname = '/'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => mockPathname,
}))

describe('useSectionNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname = '/'
  })

  describe('hash links on home page', () => {
    it('smooth-scrolls to section when on home page', () => {
      mockPathname = '/'
      const mockElement = { scrollIntoView: vi.fn() }
      vi.spyOn(document, 'querySelector').mockReturnValue(
        mockElement as unknown as Element
      )

      const { result } = renderHook(() => useSectionNavigation())

      act(() => {
        result.current.handleNavigation('#about')
      })

      expect(document.querySelector).toHaveBeenCalledWith('#about')
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      })
      expect(pushMock).not.toHaveBeenCalled()
    })

    it('does nothing when element is not found on home page', () => {
      mockPathname = '/'
      vi.spyOn(document, 'querySelector').mockReturnValue(null)

      const { result } = renderHook(() => useSectionNavigation())

      act(() => {
        result.current.handleNavigation('#nonexistent')
      })

      expect(document.querySelector).toHaveBeenCalledWith('#nonexistent')
      expect(pushMock).not.toHaveBeenCalled()
    })
  })

  describe('hash links away from home page', () => {
    it('navigates to home page with hash when not on home page', () => {
      mockPathname = '/blog'

      const { result } = renderHook(() => useSectionNavigation())

      act(() => {
        result.current.handleNavigation('#about')
      })

      expect(pushMock).toHaveBeenCalledWith('/#about')
    })
  })

  describe('regular page navigation', () => {
    it('pushes regular href via router', () => {
      const { result } = renderHook(() => useSectionNavigation())

      act(() => {
        result.current.handleNavigation('/team')
      })

      expect(pushMock).toHaveBeenCalledWith('/team')
    })
  })

  describe('external links', () => {
    it('does not handle external links by default', () => {
      const { result } = renderHook(() => useSectionNavigation())
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

      act(() => {
        result.current.handleNavigation('https://github.com')
      })

      // Without handleExternalLinks, it falls through to router.push
      expect(openSpy).not.toHaveBeenCalled()
      expect(pushMock).toHaveBeenCalledWith('https://github.com')

      openSpy.mockRestore()
    })

    it('opens external links in new tab when handleExternalLinks is true', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({ handleExternalLinks: true })
      )
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

      act(() => {
        result.current.handleNavigation('https://github.com')
      })

      expect(openSpy).toHaveBeenCalledWith(
        'https://github.com',
        '_blank',
        'noopener noreferrer'
      )
      expect(pushMock).not.toHaveBeenCalled()

      openSpy.mockRestore()
    })

    it('navigates regular paths even with handleExternalLinks enabled', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({ handleExternalLinks: true })
      )

      act(() => {
        result.current.handleNavigation('/team')
      })

      expect(pushMock).toHaveBeenCalledWith('/team')
    })
  })
})
