// Custom remark plugin to handle floating images
// This allows us to avoid allowDangerousHtml while still supporting styled images

const { visit } = require('unist-util-visit')
const { parse } = require('node-html-parser')

function remarkFloatingImages() {
  return tree => {
    visit(tree, 'html', (node, index, parent) => {
      try {
        // Parse the HTML content using a proper HTML parser
        const root = parse(node.value)
        const imgElement = root.querySelector('img')

        if (!imgElement) return

        // Extract attributes using the parser's API
        const src = imgElement.getAttribute('src')
        const alt = imgElement.getAttribute('alt') || ''
        const style = imgElement.getAttribute('style') || ''

        if (!src) return

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
                  className: style.includes('float')
                    ? ['floating-image']
                    : undefined,
                },
              },
            },
          ],
        }

        // Replace the HTML node with the markdown image
        parent.children[index] = markdownImage
      } catch (error) {
        // If parsing fails, leave the node unchanged
        console.warn(
          'Failed to parse HTML in remark-floating-images:',
          error.message
        )
      }
    })
  }
}

module.exports = remarkFloatingImages
