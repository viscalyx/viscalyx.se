import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const remarkImagePaths = require('../plugins/remark-image-paths')

describe('remark-image-paths plugin', () => {
  const run = (url, options) => {
    const plugin = remarkImagePaths(options)
    const tree = {
      type: 'root',
      children: [{ type: 'image', url }],
    }
    plugin(tree)
    return tree.children[0].url
  }

  it('removes /public prefix in build mode', () => {
    expect(run('/public/image.png', { mode: 'build' })).toBe('/image.png')
    expect(run('/public/blog-images/test.jpg', { mode: 'build' })).toBe(
      '/blog-images/test.jpg',
    )
  })

  it('does not rewrite /public paths in non-build mode', () => {
    expect(run('/public/image.png', { mode: 'preview' })).toBe(
      '/public/image.png',
    )
  })

  it('ignores external URLs', () => {
    expect(run('https://example.com/a.png', { mode: 'build' })).toBe(
      'https://example.com/a.png',
    )
    expect(run('http://example.com/a.png', { mode: 'build' })).toBe(
      'http://example.com/a.png',
    )
  })

  it('keeps non-/public relative asset paths unchanged in build mode', () => {
    expect(run('/images/foo.png', { mode: 'build' })).toBe('/images/foo.png')
    expect(run('/assets/icon.svg', { mode: 'build' })).toBe('/assets/icon.svg')
  })

  it('handles image nodes without url', () => {
    const plugin = remarkImagePaths({ mode: 'build' })
    const tree = {
      type: 'root',
      children: [{ type: 'image' }],
    }

    expect(() => plugin(tree)).not.toThrow()
    expect(tree.children[0].url).toBeUndefined()
  })

  it('adds a leading slash when transformed url does not start with slash', () => {
    const plugin = remarkImagePaths({ mode: 'build' })
    const customUrl = {
      startsWith: prefix => prefix === '/public/',
      substring: () => 'image.png',
    }
    const tree = {
      type: 'root',
      children: [{ type: 'image', url: customUrl }],
    }

    plugin(tree)

    expect(tree.children[0].url).toBe('/image.png')
  })
})
