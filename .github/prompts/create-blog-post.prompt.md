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

- `excerpt` is the SEO meta description: write 140-155 characters when possible,
  never exceed 160 characters
- `excerpt` must be a concise summary that preserves key post context (topic,
  platform/tool, and main outcome)
- Sections: `##`, subsections: `###`
- Code blocks: specify language
- For markdownlint `MD013`: disable only when a Markdown table, fenced code block, or `<img>` tag contains a line longer than 80 characters; add `markdownlint-disable MD013` immediately before that block and `markdownlint-enable MD013` immediately after
- Wrap long non-table/non-code lines at word boundaries around 80 chars
- Never split a Markdown URL across lines; when a line has a Markdown link that starts before 80 chars, only wrap after the link closing parenthesis `)`
- Never split inline code in backticks; when wrapping around inline code, break
  either before or after the full inline-code segment
- Never wrap Markdown comments like `<!-- ... -->`; for cSpell line suppressions,
  put `<!-- cSpell:disable-next-line -->` on the line before the target text
- Run `npm run spell` before commit
