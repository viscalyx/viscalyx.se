/**
 * Integration tests for the build-blog-data.js script
 *
 * This test suite verifies that the complete blog data build process
 * properly handles sanitization, file operations, and data generation.
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

// Test utilities
const createTempDir = () => {
  const tempDir = path.join(__dirname, '..', '..', 'temp-test-content')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  return tempDir
}

const cleanupTempDir = tempDir => {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

const createMockBlogPost = (filename, content) => {
  const tempDir = createTempDir()
  const blogDir = path.join(tempDir, 'content', 'blog')
  fs.mkdirSync(blogDir, { recursive: true })
  fs.writeFileSync(path.join(blogDir, filename), content)
  return tempDir
}

const copyBuildScript = tempDir => {
  // Copy the build script
  const buildScriptPath = path.join(__dirname, '..', 'build-blog-data.js')
  const tempBuildScript = path.join(tempDir, 'build-blog-data.js')
  fs.copyFileSync(buildScriptPath, tempBuildScript)

  // Copy the plugins directory
  const pluginsDir = path.join(__dirname, '..', 'plugins')
  const tempPluginsDir = path.join(tempDir, 'plugins')

  if (fs.existsSync(pluginsDir)) {
    fs.mkdirSync(tempPluginsDir, { recursive: true })

    // Copy all files in the plugins directory
    const pluginFiles = fs.readdirSync(pluginsDir)
    pluginFiles.forEach(file => {
      const srcPath = path.join(pluginsDir, file)
      const destPath = path.join(tempPluginsDir, file)

      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath)
      }
    })
  }
}

describe('Build Blog Data Integration Tests', () => {
  let originalCwd
  let tempDir

  beforeEach(() => {
    originalCwd = process.cwd()
    tempDir = null
  })

  afterEach(() => {
    process.chdir(originalCwd)
    if (tempDir) {
      cleanupTempDir(tempDir)
    }
  })

  describe('Sanitization Integration', () => {
    test('should sanitize malicious content in actual build process', async () => {
      // Create a temporary blog post with malicious content
      const maliciousPost = `---
title: "Security Test Post"
date: "2023-12-01"
author: "Security Tester"
excerpt: "Testing XSS prevention"
tags: ["security", "test"]
---

# Test Post

This is a legitimate paragraph.

<script>alert('XSS attack!')</script>

## Code Example

\`\`\`javascript
const safe = "This should be preserved";
\`\`\`

<div onclick="alert('Another XSS')">Div with onclick</div>

<img src="javascript:alert('Image XSS')" alt="Malicious image">

Normal **bold** and *italic* text should work fine.
`

      tempDir = createMockBlogPost('security-test.md', maliciousPost)

      // Copy the build script and plugins to temp directory for isolated testing
      copyBuildScript(tempDir)

      // Change to temp directory and run the build script
      process.chdir(tempDir)

      try {
        // Run the build script
        execSync('node build-blog-data.js', { stdio: 'pipe' })

        // Check that the output file was created
        const outputPath = path.join(tempDir, 'lib', 'blog-data.json')
        expect(fs.existsSync(outputPath)).toBe(true)

        // Read and parse the generated blog data
        const blogData = JSON.parse(fs.readFileSync(outputPath, 'utf8'))

        expect(blogData.posts).toHaveLength(1)
        const post = blogData.posts[0]

        // Verify malicious content is removed
        expect(post.content).not.toContain('<script>')
        expect(post.content).not.toContain('alert(')
        expect(post.content).not.toContain('onclick')
        expect(post.content).not.toContain('javascript:')

        // Verify legitimate content is preserved
        expect(post.content).toContain('<h1')
        expect(post.content).toContain('This is a legitimate paragraph')
        expect(post.content).toContain('<strong>bold</strong>')
        expect(post.content).toContain('<em>italic</em>')
        expect(post.content).toContain('safe') // Part of "const safe"

        // Verify metadata is correct
        expect(post.title).toBe('Security Test Post')
        expect(post.author).toBe('Security Tester')
        expect(post.tags).toContain('security')
      } catch (error) {
        console.error('Build script execution failed:', error.toString())
        throw error
      }
    }, 30000) // 30 second timeout for integration test

    test('should preserve syntax highlighting in build process', async () => {
      const codePost = `---
title: "Code Highlighting Test"
date: "2023-12-01"
author: "Developer"
excerpt: "Testing code blocks"
tags: ["code", "test"]
---

# Code Examples

## JavaScript

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const result = hello("World");
\`\`\`

## Python

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

## TypeScript

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

const users: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane", email: "jane@example.com" }
];
\`\`\`
`

      tempDir = createMockBlogPost('code-test.md', codePost)

      copyBuildScript(tempDir)

      process.chdir(tempDir)

      try {
        execSync('node build-blog-data.js', { stdio: 'pipe' })

        const outputPath = path.join(tempDir, 'lib', 'blog-data.json')
        const blogData = JSON.parse(fs.readFileSync(outputPath, 'utf8'))

        const post = blogData.posts[0]

        // Verify syntax highlighting classes are preserved
        expect(post.content).toContain('class="language-javascript"')
        expect(post.content).toContain('class="language-python"')
        expect(post.content).toContain('class="language-typescript"')

        // Verify data-language attributes are preserved
        expect(post.content).toContain('data-language="javascript"')
        expect(post.content).toContain('data-language="python"')
        expect(post.content).toContain('data-language="typescript"')

        // Verify token classes are preserved (from Prism.js)
        expect(post.content).toContain('class="token')

        // Verify actual code content is preserved (search for tokens within the syntax highlighting)
        expect(post.content).toContain('hello') // Function name
        expect(post.content).toContain('fibonacci') // Function name
        expect(post.content).toContain('interface') // TypeScript keyword
      } catch (error) {
        console.error('Build script execution failed:', error.toString())
        throw error
      }
    }, 30000)

    test('should handle multiple posts with mixed content safety', async () => {
      // Create multiple test posts
      const posts = [
        {
          filename: 'safe-post.md',
          content: `---
title: "Safe Post"
date: "2023-12-01"
author: "Safe Author"
excerpt: "A safe post"
tags: ["safe"]
---

# Safe Content

This post contains only safe content with **bold** and *italic* text.

## List

- Item 1
- Item 2
- Item 3
`,
        },
        {
          filename: 'malicious-post.md',
          content: `---
title: "Malicious Post"
date: "2023-12-02"
author: "Bad Actor"
excerpt: "A post with malicious content"
tags: ["dangerous"]
---

# Dangerous Content

<script>window.location='http://evil.com'</script>

This post tries to include dangerous content.

<iframe src="javascript:alert('XSS')"></iframe>

But also has legitimate content like **bold text**.
`,
        },
        {
          filename: 'mixed-post.md',
          content: `---
title: "Mixed Post"
date: "2023-12-03"
author: "Mixed Author"
excerpt: "A post with mixed content"
tags: ["mixed"]
---

# Mixed Content

Legitimate heading with id should work.

\`\`\`bash
echo "Safe command"
\`\`\`

<style>body { background: red; }</style>

But styling should be removed while preserving the rest.
`,
        },
      ]

      tempDir = createTempDir()
      const blogDir = path.join(tempDir, 'content', 'blog')
      fs.mkdirSync(blogDir, { recursive: true })

      // Create all test posts
      posts.forEach(post => {
        fs.writeFileSync(path.join(blogDir, post.filename), post.content)
      })

      copyBuildScript(tempDir)

      process.chdir(tempDir)

      try {
        execSync('node build-blog-data.js', { stdio: 'pipe' })

        const outputPath = path.join(tempDir, 'lib', 'blog-data.json')
        const blogData = JSON.parse(fs.readFileSync(outputPath, 'utf8'))

        expect(blogData.posts).toHaveLength(3)

        // Verify all posts are sanitized
        blogData.posts.forEach(post => {
          expect(post.content).not.toContain('<script>')
          expect(post.content).not.toContain('<iframe>')
          expect(post.content).not.toContain('<style>')
          expect(post.content).not.toContain('javascript:')
          expect(post.content).not.toContain('alert(')
        })

        // Verify legitimate content is preserved in all posts
        const safePost = blogData.posts.find(p => p.title === 'Safe Post')
        expect(safePost.content).toContain('<strong>bold</strong>')
        expect(safePost.content).toContain('<em>italic</em>')
        expect(safePost.content).toContain('<ul>')

        const maliciousPost = blogData.posts.find(
          p => p.title === 'Malicious Post'
        )
        expect(maliciousPost.content).toContain('<strong>bold text</strong>')
        expect(maliciousPost.content).toContain(
          'This post tries to include dangerous content'
        )

        const mixedPost = blogData.posts.find(p => p.title === 'Mixed Post')
        expect(mixedPost.content).toContain('class="language-bash"')
        expect(mixedPost.content).toContain('echo') // Command name within syntax highlighting
      } catch (error) {
        console.error('Build script execution failed:', error.toString())
        throw error
      }
    }, 30000)
  })

  describe('Reading Time Calculation Security', () => {
    test('should calculate reading time from sanitized content', async () => {
      const postWithMaliciousContent = `---
title: "Reading Time Test"
date: "2023-12-01"
author: "Test Author"
excerpt: "Testing reading time calculation"
tags: ["test"]
---

# Introduction

This post has legitimate content that should be counted for reading time calculation.

<script>
// This script should not be counted in word count
alert('This is malicious code that should not affect reading time');
var maliciousVariable = 'This content should not be counted';
</script>

## Main Content

Here is the main content of the blog post. It contains multiple paragraphs with substantial text that should be properly counted for reading time estimation.

The reading time calculation should ignore any HTML tags and only count the actual text content that users will read.

This includes **bold text**, *italic text*, and [links](https://example.com) which should all contribute to the word count.

## Code Examples

\`\`\`javascript
function example() {
  console.log("This code should be counted");
  return "as part of reading time";
}
\`\`\`

The code above contains words that should be included in the reading time calculation.

## Conclusion

This conclusion paragraph wraps up the content and should also be included in the word count for accurate reading time estimation.
`

      tempDir = createMockBlogPost(
        'reading-time-test.md',
        postWithMaliciousContent
      )

      copyBuildScript(tempDir)

      process.chdir(tempDir)

      try {
        execSync('node build-blog-data.js', { stdio: 'pipe' })

        const outputPath = path.join(tempDir, 'lib', 'blog-data.json')
        const blogData = JSON.parse(fs.readFileSync(outputPath, 'utf8'))

        const post = blogData.posts[0]

        // Verify reading time is calculated and is reasonable
        expect(post.readTime).toBeDefined()
        expect(post.readTime).toMatch(/\d+ min read/)

        // Extract the number of minutes
        const minutes = Number.parseInt(post.readTime.match(/(\d+) min/)[1])

        // The post has substantial content, should be more than 1 minute
        // but not excessive since malicious content should be excluded
        expect(minutes).toBeGreaterThanOrEqual(1)
        expect(minutes).toBeLessThan(10) // Reasonable upper bound

        // Verify the content is properly sanitized
        expect(post.content).not.toContain('<script>')
        expect(post.content).not.toContain('alert(')
        expect(post.content).not.toContain('maliciousVariable')

        // Verify legitimate content is preserved
        expect(post.content).toContain('Introduction')
        expect(post.content).toContain('Main Content')
        expect(post.content).toContain('example') // Function name within syntax highlighting
      } catch (error) {
        console.error('Build script execution failed:', error.toString())
        throw error
      }
    }, 30000)
  })
})
