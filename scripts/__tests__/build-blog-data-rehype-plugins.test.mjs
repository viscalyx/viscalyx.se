import { describe, expect, it } from 'vitest'

/**
 * Unit tests for the anonymous rehype plugins in build-blog-data.js
 * that transform code blocks and tables during the blog build pipeline.
 *
 * These tests run the same remark → rehype pipeline used by the build script
 * and assert the HTML output for:
 *   (a) code-block-wrapper with code-language-label and data-mermaid
 *   (b) table-scroll-region with table-right-fade
 */

const PIPELINE_TIMEOUT_MS = 30000

async function processMarkdown(markdown) {
  const { remark } = await import('remark')
  const { default: remarkGfm } = await import('remark-gfm')
  const { default: remarkRehype } = await import('remark-rehype')
  const { default: rehypePrettyCode } = await import('rehype-pretty-code')
  const { default: rehypeStringify } = await import('rehype-stringify')
  const { visit } = await import('unist-util-visit')

  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },
      keepBackground: false,
    })
    .use(() => {
      // Mirrors the code-block-wrapper plugin in build-blog-data.js
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
    })
    .use(() => {
      // Mirrors the table-scroll-region plugin in build-blog-data.js
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
    })
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}

describe('code-block-wrapper rehype plugin', () => {
  it(
    'wraps a code block in a div with class code-block-wrapper',
    async () => {
      const md = '```javascript\nconst x = 1;\n```\n'
      const html = await processMarkdown(md)

      expect(html).toContain('class="code-block-wrapper"')
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'adds a code-language-label div with the uppercase language name',
    async () => {
      const md = '```python\nprint("hi")\n```\n'
      const html = await processMarkdown(md)

      expect(html).toContain('class="code-language-label"')
      expect(html).toContain('PYTHON')
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'sets data-language on the wrapper div',
    async () => {
      const md = '```typescript\nconst y: number = 2;\n```\n'
      const html = await processMarkdown(md)

      expect(html).toContain('data-language="typescript"')
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'sets data-mermaid="true" on the pre element for mermaid blocks',
    async () => {
      const md = '```mermaid\ngraph TD;\nA-->B;\n```\n'
      const html = await processMarkdown(md)

      expect(html).toContain('data-mermaid="true"')
      expect(html).toContain('class="code-block-wrapper mermaid-code-block"')
      expect(html).toContain('MERMAID DIAGRAM')
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'uses "MERMAID DIAGRAM" as label for mermaid blocks instead of "MERMAID"',
    async () => {
      const md = '```mermaid\nsequenceDiagram\nA->>B: Hello\n```\n'
      const html = await processMarkdown(md)

      expect(html).toContain('MERMAID DIAGRAM')
      // The label should be the full "MERMAID DIAGRAM", not just "MERMAID"
      expect(html).not.toContain('>MERMAID</div>')
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'leaves code blocks without a language unwrapped by the plugin',
    async () => {
      const md = '```\nplain text\n```\n'
      const html = await processMarkdown(md)

      // rehype-pretty-code does not produce a <figure> for language-less
      // blocks, so the code-block-wrapper plugin should not touch them.
      expect(html).toContain('<pre>')
      expect(html).toContain('plain text')
      expect(html).not.toContain('code-block-wrapper')
    },
    PIPELINE_TIMEOUT_MS,
  )
})

describe('table-scroll-region rehype plugin', () => {
  it(
    'wraps a table in a div with class table-scroll-region',
    async () => {
      const md = '| A | B |\n| --- | --- |\n| 1 | 2 |\n'
      const html = await processMarkdown(md)

      expect(html).toContain('class="table-scroll-region"')
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'includes a sibling div with class table-right-fade',
    async () => {
      const md = '| X | Y |\n| --- | --- |\n| 3 | 4 |\n'
      const html = await processMarkdown(md)

      expect(html).toContain('class="table-right-fade"')
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'preserves the original table inside the scroll wrapper',
    async () => {
      const md = '| Col1 | Col2 |\n| --- | --- |\n| val1 | val2 |\n'
      const html = await processMarkdown(md)

      expect(html).toContain('<table>')
      expect(html).toContain('class="table-scroll-region"')
      // The table should be inside the scroll region wrapper
      const scrollRegionStart = html.indexOf('class="table-scroll-region"')
      const tableStart = html.indexOf('<table>', scrollRegionStart)
      expect(tableStart).toBeGreaterThan(scrollRegionStart)
    },
    PIPELINE_TIMEOUT_MS,
  )

  it(
    'wraps multiple tables independently',
    async () => {
      const md =
        '| A | B |\n| --- | --- |\n| 1 | 2 |\n\n| C | D |\n| --- | --- |\n| 3 | 4 |\n'
      const html = await processMarkdown(md)

      const matches = html.match(/class="table-scroll-region"/g)
      expect(matches).toHaveLength(2)

      const fadeMatches = html.match(/class="table-right-fade"/g)
      expect(fadeMatches).toHaveLength(2)
    },
    PIPELINE_TIMEOUT_MS,
  )
})
