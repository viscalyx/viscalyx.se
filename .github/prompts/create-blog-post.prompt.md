---
agent: agent
description: 'Create a blog post Markdown file with required front-matter and rules'
---

# Create Blog Post

Create `/content/blog/post-slug.md`:

```yaml
---
title: 'Post Title'
date: 'YYYY-MM-DD'
author: 'Author Name'
excerpt: 'Max 160 chars'
image: '/temporary-image.png'
imageAlt: 'Alt text describing the subject the final image should depict'
tags: ['tag1', 'tag2']
category: 'DevOps|PowerShell|Azure|Infrastructure|Automation'
readTime: '5 min'
---
```

Rules:

- Sections: `##`, subsections: `###`
- Code blocks: specify language
- For markdownlint `MD013`: disable before markdown tables and fenced code
  blocks, then re-enable immediately after each block
- Wrap long non-table/non-code lines at word boundaries around 80 chars
- Never split a Markdown URL across lines; when a line has a Markdown link that starts prior to 80 chars, only wrap after the link closing parenthesis `)`
- Run `npm run spell` before commit
