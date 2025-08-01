// vitest.setup.ts
// Setup file for Vitest tests
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock framer-motion
vi.mock('framer-motion', () => {
  const { createElement } = require('react')

  interface MotionProps {
    children?: React.ReactNode
    layoutId?: string
    initial?: Record<string, unknown>
    animate?: Record<string, unknown>
    transition?: Record<string, unknown>
    whileHover?: Record<string, unknown>
    whileTap?: Record<string, unknown>
    whileInView?: Record<string, unknown>
    viewport?: Record<string, unknown>
    [key: string]: unknown
  }

  const forward = (tag: string) => {
    const ForwardedComponent = (props: MotionProps) => {
      const {
        children,
        // Motion-specific props that we ignore in tests
        layoutId,
        initial,
        animate,
        transition,
        whileHover,
        whileTap,
        whileInView,
        viewport,
        ...rest
      } = props

      // Suppress unused variable warnings for motion props
      void layoutId
      void initial
      void animate
      void transition
      void whileHover
      void whileTap
      void whileInView
      void viewport
      return createElement(tag, rest, children)
    }
    ForwardedComponent.displayName = `Motion${tag.charAt(0).toUpperCase() + tag.slice(1)}`
    return ForwardedComponent
  }

  return {
    motion: {
      div: forward('div'),
      button: forward('button'),
      a: forward('a'),
    },
    useInView: () => true,
  }
})

// Mock next/image to render simple img for tests
vi.mock('next/image', () => {
  const React = require('react')

  interface ImageProps {
    src: string
    alt: string
    fill?: boolean
    width?: number
    height?: number
    priority?: boolean
    quality?: number
    placeholder?: string
    blurDataURL?: string
    [key: string]: unknown
  }

  const Image = ({ src, alt, fill, ...rest }: ImageProps) => {
    // Suppress unused variable warning for fill prop
    void fill
    return React.createElement('img', { src, alt, ...rest })
  }

  Image.displayName = 'MockedImage'

  return {
    __esModule: true,
    default: Image,
  }
})

// Mock CSS modules
vi.mock('**/*.css', () => ({}))

// Mock static assets
vi.mock('*.(png|jpg|jpeg|gif|svg)', () => 'test-file-stub')
