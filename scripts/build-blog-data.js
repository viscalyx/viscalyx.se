const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { remark } = require('remark')
const remarkHtml = require('remark-html').default
const remarkGfm = require('remark-gfm').default

const postsDirectory = path.join(process.cwd(), 'content/blog')
const outputPath = path.join(process.cwd(), 'lib/blog-data.json')

async function buildBlogData() {
  console.log('Building blog data for production...')

  try {
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

        // Process markdown content to HTML
        const processedContent = await remark()
          .use(remarkGfm)
          .use(remarkHtml)
          .process(content)

        const contentHtml = processedContent.toString()

        // Extract category from tags if not explicitly set
        const category =
          data.category || (data.tags && data.tags[0]) || 'General'

        const post = {
          slug,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          author: data.author || 'Unknown Author',
          excerpt: data.excerpt || '',
          image:
            data.image ||
            'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop&crop=center',
          tags: data.tags || [],
          readTime: data.readTime || '5 min read',
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

    // Sort posts by date (newest first)
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const blogData = {
      posts,
      slugs,
      lastBuilt: new Date().toISOString(),
    }

    // Write the blog data to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(blogData, null, 2))
    console.log(`✓ Blog data written to ${outputPath}`)
    console.log(`✓ Built ${posts.length} blog posts`)
  } catch (error) {
    console.error('Error building blog data:', error)
    process.exit(1)
  }
}

// Run the build
buildBlogData()
