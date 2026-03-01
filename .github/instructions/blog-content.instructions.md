---
applyTo: 'content/blog/**/*.md'
---

# Blog Posts

## Filename

`kebab-case-title.md` (matches URL slug)

## Front Matter

```yaml
---
title: 'Post Title'
date: 'YYYY-MM-DD'
author: 'Author Name'
excerpt: 'SEO summary (target 140-155 chars, hard max 160)'
image: '/temporary-image.png'
imageAlt: 'Alt text describing the subject the final image should depict'
tags: ['tag1', 'tag2']
category: 'Any category — reuse existing ones when possible (e.g., DevOps, PowerShell, Azure, Infrastructure, Automation)'
---
```

**Image**: Use `/temporary-image.png` as a placeholder until you add a final image to the `/public` folder. Write descriptive `imageAlt` text that guides what the final image should depict.

**Excerpt SEO rule**:

- Treat `excerpt` as the post meta description
- Aim for 140-155 characters; never exceed 160 characters
- Keep it specific and include key context (topic + platform/tool + outcome)

## Content Rules

- Start sections with `##`, subsections with `###`
- Never skip heading levels
- Code blocks: always specify language
- Images: include alt text
- For markdownlint `MD013`: disable MD013 only for tables, fenced code blocks, and `<img>` tags that exceed 80 characters by adding a local disable/enable comment immediately around that specific block
- Wrap long non-table/non-code lines at word boundaries around 80 chars
- Never wrap frontmatter values (`---` YAML block at the top of a markdown file)
- Never split a Markdown URL across lines; when a line has a Markdown link that starts before 80 chars, only wrap after the link closing parenthesis `)`
- Never split inline code in backticks; when wrapping around inline code, break either before or after the full inline-code segment
- Never wrap Markdown comments like `<!-- ... -->`; for cSpell line suppressions, use `<!-- cSpell:disable-next-line -->` on the line before the target text

## Callouts

Quote callout:

```markdown
> [!QUOTE]
> Quote text phrases from references
```

Plain blockquote:

```markdown
> Regular blockquote without any special alert type. It maintains the original styling and behavior.
```

Use GitHub-style blockquote alerts:

```markdown
> [!NOTE]
> Informational callout

> [!TIP]
> Helpful advice

> [!IMPORTANT]
> Critical information needed for success

> [!WARNING]
> Important caution

> [!CAUTION]
> Critical warning
```

## Quality Check

Run `npm run spell` before committing
