// Custom remark plugin to handle floating images
// This allows us to avoid allowDangerousHtml while still supporting styled images

function remarkFloatingImages() {
  return (tree) => {
    const { visit } = require('unist-util-visit')
    
    visit(tree, 'html', (node, index, parent) => {
      // Check if this is an img tag with style attribute
      const imgMatch = node.value.match(/<img\s+([^>]*?)>/i)
      if (!imgMatch) return

      const attributes = imgMatch[1]
      const srcMatch = attributes.match(/src=["']([^"']*?)["']/i)
      const altMatch = attributes.match(/alt=["']([^"']*?)["']/i)
      const styleMatch = attributes.match(/style=["']([^"']*?)["']/i)

      if (!srcMatch) return

      const src = srcMatch[1]
      const alt = altMatch ? altMatch[1] : ''
      const style = styleMatch ? styleMatch[1] : ''

      // Create a standard markdown image with data attributes for styling
      const markdownImage = {
        type: 'paragraph',
        children: [
          {
            type: 'image',
            url: src,
            alt: alt,
            data: {
              hProperties: {
                style: style,
                className: style.includes('float') ? ['floating-image'] : undefined
              }
            }
          }
        ]
      }

      // Replace the HTML node with the markdown image
      parent.children[index] = markdownImage
    })
  }
}

module.exports = remarkFloatingImages
