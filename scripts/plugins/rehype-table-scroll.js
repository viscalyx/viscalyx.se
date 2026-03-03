/**
 * Rehype plugin that wraps <table> elements with a scroll region
 * container and a dedicated right-fade overlay element.
 */

const { visit } = require('unist-util-visit')

function rehypeTableScroll() {
  return tree => {
    const wrappedTables = new Set()

    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName !== 'table' ||
        wrappedTables.has(node) ||
        !parent ||
        typeof index !== 'number'
      ) {
        return
      }

      wrappedTables.add(node)

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['table-scroll-region'],
        },
        children: [
          node,
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-right-fade'],
            },
            children: [],
          },
        ],
      }
    })
  }
}

module.exports = rehypeTableScroll
