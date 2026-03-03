/**
 * Rehype plugin that converts rehype-pretty-code <figure> wrappers
 * into .code-block-wrapper divs with a language label.
 *
 * Mermaid blocks receive an extra `mermaid-code-block` class and
 * the pre element is annotated with data-mermaid="true".
 */

const { visit } = require('unist-util-visit')

function rehypeCodeBlockWrapper() {
  return tree => {
    visit(tree, 'element', node => {
      if (
        node.tagName !== 'figure' ||
        node.properties['data-rehype-pretty-code-figure'] === undefined
      ) {
        return
      }

      const preChild = node.children.find(
        child => child.type === 'element' && child.tagName === 'pre',
      )
      if (!preChild) return

      const language =
        typeof preChild.properties['data-language'] === 'string'
          ? preChild.properties['data-language']
          : ''
      const isMermaid = language === 'mermaid'

      // Build label element
      const labelElement = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-language-label'] },
        children: [
          {
            type: 'text',
            value: isMermaid ? 'MERMAID DIAGRAM' : language.toUpperCase(),
          },
        ],
      }

      if (isMermaid) {
        preChild.properties['data-mermaid'] = 'true'
      }

      // Replace figure with our wrapper div
      node.tagName = 'div'
      node.properties = {
        className: [
          'code-block-wrapper',
          ...(isMermaid ? ['mermaid-code-block'] : []),
        ],
        'data-language': language,
      }
      node.children = [labelElement, preChild]
    })
  }
}

module.exports = rehypeCodeBlockWrapper
