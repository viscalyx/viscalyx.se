// jest.setup.ts
// Setup file for Jest tests
import '@testing-library/jest-dom'

jest.mock('framer-motion', () => {
  const { createElement } = require('react')
  const forward = (tag: string) => (props: any) => {
    const {
      children,
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
    return createElement(tag, rest, children)
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
jest.mock('next/image', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ src, alt, fill, ...rest }: any) =>
      React.createElement('img', { src, alt, ...rest }),
  }
})
