const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')
const sanitizeHtml = require('sanitize-html')

const postsDirectory = path.join(process.cwd(), 'content/blog')
const outputPath = path.join(process.cwd(), 'lib/blog-data.json')

// Function to calculate reading time based on word count
function calculateReadingTime(content) {
  // Sanitize HTML first, then extract text content for accurate word count
  const sanitizedContent = sanitizeHtml(content, textOnlySanitizeOptions)
  const textContent = sanitizedContent.replace(/\s+/g, ' ').trim()

  // Count words by splitting on whitespace
  const wordCount = textContent
    .split(' ')
    .filter(word => word.length > 0).length

  // Average reading speed: 225 words per minute (middle of 200-250 range)
  const wordsPerMinute = 225
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute)

  // Return formatted string
  if (readingTimeMinutes === 1) {
    return '1 min read'
  } else {
    return `${readingTimeMinutes} min read`
  }
}

// HTML sanitization options - extend defaults with blog-specific needs
const sanitizeOptions = {
  // Use default allowed tags and attributes as base
  ...sanitizeHtml.defaults,
  // Extend allowed attributes to support table of contents navigation and syntax highlighting
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    // Allow id attributes on headings for table of contents
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
    // Allow class attributes for syntax highlighting
    code: ['class'],
    pre: ['class', 'data-language'],
    span: ['class'],
    div: ['class'],
    // Allow data attributes for Prism.js functionality
    '*': ['data-*'],
  },
  // Allow additional tags that Prism.js might use
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'span', // Prism.js uses spans for syntax highlighting
  ],
}

// Sanitization options for text extraction (strips all HTML)
const textOnlySanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
}

async function buildBlogData() {
  console.log('Building blog data...')

  try {
    // Dynamically import ES modules
    const { remark } = await import('remark')
    const { default: remarkHtml } = await import('remark-html')
    const { default: remarkGfm } = await import('remark-gfm')
    const { default: remarkRehype } = await import('remark-rehype')
    const { default: rehypePrismPlus } = await import('rehype-prism-plus')
    const { default: rehypeStringify } = await import('rehype-stringify')
    const { visit } = await import('unist-util-visit')

    // Check if content directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Blog content directory not found, creating empty blog data')
      const emptyData = {
        posts: [],
        slugs: [],
        lastBuilt: new Date().toISOString(),
      }
      fs.writeFileSync(outputPath, JSON.stringify(emptyData, null, 2))
      return
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const markdownFiles = fileNames.filter(fileName => fileName.endsWith('.md'))

    console.log(`Found ${markdownFiles.length} blog posts`)

    const posts = []
    const slugs = []

    for (const fileName of markdownFiles) {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)

      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        // Process markdown content to HTML with syntax highlighting
        const processedContent = await remark()
          .use(remarkGfm)
          .use(remarkRehype)
          .use(rehypePrismPlus, {
            showLineNumbers: false,
            ignoreMissing: true,
          })
          .use(() => {
            // Custom plugin to add data-language attribute for CSS language labels
            return tree => {
              visit(tree, 'element', node => {
                if (node.tagName === 'pre' && node.properties.className) {
                  const classNames = Array.isArray(node.properties.className)
                    ? node.properties.className
                    : [node.properties.className]

                  const languageClass = classNames.find(
                    className =>
                      typeof className === 'string' &&
                      className.startsWith('language-')
                  )

                  if (languageClass) {
                    const language = languageClass.replace('language-', '')
                    node.properties.dataLanguage = language
                  }
                }
              })
            }
          })
          .use(rehypeStringify)
          .process(content)

        const rawContentHtml = processedContent.toString()

        // Sanitize the HTML to prevent XSS attacks using default options
        const contentHtml = sanitizeHtml(rawContentHtml, sanitizeOptions)

        // Validate date field
        const validateDate = dateString => {
          if (!dateString) return false
          const date = new Date(dateString)
          return (
            !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/)
          )
        }

        let validatedDate = null
        if (data.date) {
          if (validateDate(data.date)) {
            validatedDate = data.date
          } else {
            console.warn(
              `Invalid date format in ${fileName}: "${data.date}". Expected YYYY-MM-DD format.`
            )
          }
        } else {
          console.warn(
            `Missing date field in ${fileName}. Consider adding a date in YYYY-MM-DD format.`
          )
        }

        // Extract category from tags if not explicitly set
        const category = data.category || data.tags?.[0] || 'General'

        // Calculate reading time based on content word count
        const calculatedReadTime = calculateReadingTime(contentHtml)

        const post = {
          slug,
          title: data.title || 'Untitled',
          date: validatedDate,
          author: data.author || 'Unknown Author',
          excerpt: data.excerpt || '',
          image:
            data.image ||
            'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop&crop=center',
          tags: data.tags || [],
          readTime: data.readTime || calculatedReadTime,
          category,
          content: contentHtml,
        }

        posts.push(post)
        slugs.push(slug)

        console.log(`✓ Processed: ${slug}`)
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error)
      }
    }

    // Filter posts with valid dates and handle posts with invalid dates
    const postsWithValidDates = []
    const postsWithInvalidDates = []

    posts.forEach(post => {
      if (post.date && !isNaN(new Date(post.date).getTime())) {
        postsWithValidDates.push(post)
      } else {
        // Posts with invalid or missing dates go to the end
        postsWithInvalidDates.push(post)
        if (!post.date) {
          console.warn(
            `Post "${post.slug}" has no date and will be placed at the end`
          )
        } else {
          console.warn(
            `Post "${post.slug}" has invalid date "${post.date}" and will be placed at the end`
          )
        }
      }
    })

    // Sort posts with valid dates by date (newest first)
    postsWithValidDates.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Combine sorted valid posts with invalid date posts at the end
    const sortedPosts = [...postsWithValidDates, ...postsWithInvalidDates]

    const blogData = {
      posts: sortedPosts,
      slugs,
      lastBuilt: new Date().toISOString(),
    }

    // Ensure the output directory exists before writing the file
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Write the blog data to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(blogData, null, 2))
    console.log(`✓ Blog data written to ${outputPath}`)
    console.log(
      `✓ Built ${sortedPosts.length} blog posts with HTML sanitization`
    )
    console.log(
      `✓ Posts with valid dates: ${postsWithValidDates.length}, posts with invalid dates: ${postsWithInvalidDates.length}`
    )
  } catch (error) {
    console.error('Error building blog data:', error)
    process.exit(1)
  }
}

// Run the build
buildBlogData()
