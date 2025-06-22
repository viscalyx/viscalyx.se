const remarkBlockquoteTypes = require('../blockquote-types')

// Mock visit function for testing
function mockVisit(tree, type, callback) {
  function traverse(node, index = 0, parent = null) {
    if (node.type === type) {
      callback(node, index, parent)
    }
    if (node.children) {
      node.children.forEach((child, i) => traverse(child, i, node))
    }
  }
  traverse(tree)
}

describe('Blockquote Types Plugin', () => {
  test('should transform NOTE alert correctly', () => {
    const testTree = {
      type: 'root',
      children: [
        {
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: '[!NOTE] This is a test note alert',
                },
              ],
            },
          ],
        },
      ],
    }

    const plugin = remarkBlockquoteTypes(mockVisit)
    plugin(testTree)

    const alertNode = testTree.children[0]
    expect(alertNode.data.hName).toBe('div')
    expect(alertNode.data.hProperties.className).toContain('github-alert')
    expect(alertNode.data.hProperties.className).toContain('github-alert-note')
    expect(alertNode.data.hProperties['data-alert-type']).toBe('note')
    expect(alertNode.children[0].children[0].value).toBe('Note')
  })

  test('should transform WARNING alert correctly', () => {
    const testTree = {
      type: 'root',
      children: [
        {
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: '[!WARNING] This is a warning message',
                },
              ],
            },
          ],
        },
      ],
    }

    const plugin = remarkBlockquoteTypes(mockVisit)
    plugin(testTree)

    const alertNode = testTree.children[0]
    expect(alertNode.data.hProperties.className).toContain(
      'github-alert-warning'
    )
    expect(alertNode.data.hProperties['data-alert-type']).toBe('warning')
    expect(alertNode.children[0].children[0].value).toBe('Warning')
  })

  test('should not transform regular blockquotes', () => {
    const testTree = {
      type: 'root',
      children: [
        {
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'This is a regular blockquote',
                },
              ],
            },
          ],
        },
      ],
    }

    const originalValue = testTree.children[0].children[0].children[0].value
    const plugin = remarkBlockquoteTypes(mockVisit)
    plugin(testTree)

    // Should remain unchanged
    expect(testTree.children[0].children[0].children[0].value).toBe(
      originalValue
    )
    expect(testTree.children[0].data).toBeUndefined()
  })

  test('should handle empty alert text', () => {
    const testTree = {
      type: 'root',
      children: [
        {
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: '[!TIP]',
                },
              ],
            },
          ],
        },
      ],
    }

    const plugin = remarkBlockquoteTypes(mockVisit)
    plugin(testTree)

    const alertNode = testTree.children[0]
    expect(alertNode.data.hProperties.className).toContain('github-alert-tip')
    expect(alertNode.children[0].children[0].value).toBe('Tip')
  })
})
