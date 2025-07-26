// Custom remark plugin to handle image paths for VS Code and blog system
// This plugin transforms image paths to work in both environments

const { visit } = require('unist-util-visit')

/**
 * Remark plugin to transform image paths for dual compatibility
 *
 * Transforms:
 * - `/public/image.png` -> `/image.png` (for blog system)
 * - `/public/blog-images/image.png` -> `/blog-images/image.png` (for blog system)
 * - Leaves https:// URLs unchanged
 *
 * The plugin removes the `/public/` prefix during build so images work correctly
 * in the blog system, while VS Code preview can see them with the full path.
 */
function remarkImagePaths(options = {}) {
  const { mode = 'build' } = options

  return tree => {
    visit(tree, 'image', node => {
      if (!node.url) return

      // Skip external URLs (http/https)
      if (node.url.startsWith('http://') || node.url.startsWith('https://')) {
        return
      }

      // Handle /public/ paths - remove /public prefix for blog system
      if (node.url.startsWith('/public/')) {
        if (mode === 'build') {
          // Remove /public prefix: /public/image.png -> /image.png
          node.url = node.url.substring(7) // Remove '/public'
          if (!node.url.startsWith('/')) {
            node.url = '/' + node.url
          }
        }
        // For VS Code preview, leave the path as-is since it can resolve /public/ paths
      }
    })
  }
}

module.exports = remarkImagePaths
