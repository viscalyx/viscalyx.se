// jest.setup.ts
// Setup file for Jest tests
import '@testing-library/jest-dom'

jest.mock('framer-motion', () => {
  const { createElement } = require('react')
  return {
    motion: {
      div: (props: any) => {
        const {
          children,
          layoutId,
          initial,
          animate,
          transition,
          whileHover,
          whileTap,
          ...rest
        } = props
        return createElement('div', rest, children)
      },
      button: (props: any) => {
        const {
          children,
          layoutId,
          initial,
          animate,
          transition,
          whileHover,
          whileTap,
          ...rest
        } = props
        return createElement('button', rest, children)
      },
    },
    useInView: () => true,
  }
})
