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
excerpt: 'SEO summary (target 140-155 chars, hard max 160)'
image: '/temporary-image.png'
imageAlt: 'Alt text describing the subject the final image should depict'
tags: ['tag1', 'tag2']
category: 'DevOps|PowerShell|Azure|Infrastructure|Automation'
readTime: '5 min'
---
```

Rules:

- `excerpt` must be a concise SEO summary that preserves topic, platform/tool, and main outcome; target 140-155 characters and never exceed 160
- Sections: `##`, subsections: `###`
- Code blocks: specify language
- For markdownlint `MD013`: disable only for tables, fenced code blocks, or `<img>` tags with lines >80 chars (wrap `markdownlint-disable MD013` / `markdownlint-enable MD013` immediately around the block). Wrap prose at ~80 chars on word boundaries; never break inline code in backticks (break before or after the full segment); never split a Markdown URL or break inside `[text](url)` — allow single long link lines unwrapped.
- Never wrap Markdown comments like `<!-- ... -->`; for cSpell line suppressions,
  put `<!-- cSpell:disable-next-line -->` on the line before the target text
- Run `npm run spell` before commit
