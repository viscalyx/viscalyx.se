# Create Blog Post

Create `/content/blog/post-slug.md`:

```yaml
---
title: 'Post Title'
date: 'YYYY-MM-DD'
author: 'Author Name'
excerpt: 'Max 160 chars'
image: 'https://images.unsplash.com/photo-xxx?w=1200&h=600&fit=crop'
tags: ['tag1', 'tag2']
category: 'DevOps|PowerShell|Azure|Infrastructure|Automation'
---
```

Rules:

- Sections: `##`, subsections: `###`
- Code blocks: specify language
- Run `npm run spell` before commit
