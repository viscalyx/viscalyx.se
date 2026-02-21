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
- Run `npm run spell` before commit
