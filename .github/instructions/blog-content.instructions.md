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
image: '/temporary-image.png'
imageAlt: 'Alt text describing the subject the final image should depict'
tags: ['tag1', 'tag2']
category: 'Any category — reuse existing ones when possible (e.g., DevOps, PowerShell, Azure, Infrastructure, Automation)'
---
```

**Image**: Use `/temporary-image.png` as a placeholder until you add a final image to the `/public` folder. Write descriptive `imageAlt` text that guides what the final image should depict.

## Content Rules

- Start sections with `##`, subsections with `###`
- Never skip heading levels
- Code blocks: always specify language
- Images: include alt text
- For markdownlint `MD013`: disable before markdown tables, fenced code blocks and `<img>` tags, then re-enable immediately after each block
- Wrap long non-table/non-code lines at word boundaries around 80 chars
- Never split a Markdown URL across lines; when a line has a Markdown link that starts prior to 80 chars, only wrap after the link closing parenthesis `)`
- Never split inline code in backticks; when wrapping around inline code, break either before or after the full inline-code segment
- Never wrap Markdown comments like `<!-- ... -->`; for cSpell line suppressions, use `<!-- cSpell:disable-next-line -->` on the line before the target text

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
