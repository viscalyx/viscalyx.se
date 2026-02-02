---
applyTo: 'content/blog/**/*.md'
---

# Blog Posts

## Filename

`kebab-case-title.md` (matches URL slug)

## Frontmatter

```yaml
---
title: 'Post Title'
date: 'YYYY-MM-DD'
author: 'Author Name'
excerpt: 'Max 160 chars for SEO'
image: 'https://images.unsplash.com/photo-xxx?w=1200&h=600&fit=crop'
tags: ['tag1', 'tag2']
category: 'DevOps|PowerShell|Azure|Infrastructure|Automation'
---
```

## Content Rules

- Start sections with `##`, subsections with `###`
- Never skip heading levels
- Code blocks: always specify language
- Images: include alt text

## Callouts

Use GitHub-style blockquote alerts:

```markdown
> [!NOTE]
> Informational callout

> [!TIP]
> Helpful advice

> [!WARNING]
> Important caution

> [!CAUTION]
> Critical warning
```

## Quality Check

Run `npm run spell` before committing
