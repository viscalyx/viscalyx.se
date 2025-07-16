---
title: 'Block quotes Examples'
date: '2025-06-22'
author: 'Johan Ljunggren'
excerpt: 'Demonstrates available blockquote styles in Markdown.'
image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop&crop=center'
tags: ['GitHub', 'Markdown', 'Alerts', 'Examples']
category: 'Documentation'
readTime: '3 min read'
---

This post demonstrates the new regular blockquote and GitHub-style markdown alerts that support different types with distinct colors and icons.

## Regular

Regular block quotations are indented passages that are typographically set apart on their own:

```markdown
> This is a regular blockquote without any special alert type. It maintains the original styling and behavior.
```

> This is a regular blockquote without any special alert type. It maintains the original styling and behavior.

## Quote

This used for getting quotations marks around a quote. The reference to where the source can be found (e.g., including author, title, and page number) are not yet supported.

```markdown
> [!QUOTE]
> The best way to learn programming is not just by reading about it, but by actually writing code and solving real problems.
```

> [!QUOTE]
> The best way to learn programming is not just by reading about it, but by actually writing code and solving real problems.

## GitHub-style

These GitHub-style alerts make your documentation more visually appealing and help readers quickly identify important information based on the color coding and iconography.

You can use the following alert types in your markdown:

```markdown
> [!NOTE]
> Highlights information that users should consider, even when skimming.
```

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

```markdown
> [!TIP]
> Optional information to help a user be more successful.
```

> [!TIP]
> Optional information to help a user be more successful.

```markdown
> [!IMPORTANT]
> Crucial information necessary for users to succeed.
```

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

```markdown
> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.
```

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

```markdown
> [!CAUTION]
> Negative potential consequences of an action.
```

> [!CAUTION]
> Negative potential consequences of an action.

## Real-World Examples

### Regular

> This is a regular blockquote without quote marks, perfect for general emphasis or citations where you don't want the traditional quotation styling.

### Quotations with Visual Quote Marks

> [!QUOTE]
> The best way to learn programming is not just by reading about it, but by actually writing code and solving real problems. Start small, be consistent, and don't be afraid to make mistakes – they're part of the learning process.

### Configuration Notes

> [!NOTE]
> Make sure to back up your configuration files before making any changes. This will allow you to restore your settings if something goes wrong.

### Performance Tips

> [!TIP]
> Use caching mechanisms like Redis or Memcached to improve application performance. This can reduce database load by up to 80% in typical web applications.

### Security Requirements

> [!IMPORTANT]
> Always validate user input on both client and server sides. Client-side validation is for user experience, but server-side validation is essential for security.

### Potential Issues

> [!WARNING]
> Running this command will permanently delete all data in the specified database. Make sure you have created a backup before proceeding.

### Breaking Changes

> [!CAUTION]
> This update contains breaking changes that will require code modifications. Review the migration guide carefully before upgrading to avoid application failures.

## Multi-paragraph Alerts

Alerts can contain multiple paragraphs and even other markdown elements:

> [!IMPORTANT]
> This is a complex alert with multiple paragraphs.
>
> It can contain **bold text**, _italic text_, and even code snippets like `npm install`.
>
> Use this for detailed explanations that require more context.

The blockquote handles inline code-blocks, e.g. `npm install`.
