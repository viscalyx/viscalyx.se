---
title: 'Block Quotes Examples'
date: '2025-04-22'
author: 'Johan Ljunggren'
excerpt: 'Demonstrates available blockquote styles in Markdown.'
image: '/fountain-pen-nib-writing-cursive-macro.png'
imageAlt: 'Macro view of a fountain pen nib touching lined paper, a bead of ink forming a cursive word in warm side light.'
tags: ['GitHub', 'Markdown', 'Alerts', 'Examples']
category: 'Template'
readTime: '3 min read'
---

This post demonstrates the new regular blockquote and GitHub-style markdown
alerts that support different types with distinct colors and icons.

## Regular

Regular block quotations are indented passages, typographically set apart:

<!-- markdownlint-disable MD013 -->
```markdown
> This is a regular blockquote without any special alert type. It maintains the original styling and behavior.
```
<!-- markdownlint-enable MD013 -->

> This is a regular blockquote without any special alert type. It maintains the
> original styling and behavior.

## Quote

This style places quotation marks around a passage. Source references (for
example, author, title, or page number) are not yet supported.

<!-- markdownlint-disable MD013 -->
```markdown
> [!QUOTE]
> The best way to learn programming is not just by reading about it, but by actually writing code and solving real problems.
```
<!-- markdownlint-enable MD013 -->

> [!QUOTE]
> The best way to learn programming is not just by reading about it, but by
> actually writing code and solving real problems.

## DocFX-style

These DocFX-style alerts make your documentation more visually appealing and
help readers quickly identify important information based on the color coding
and iconography.

You can use the following alert types in your markdown:

<!-- markdownlint-disable MD013 -->
```markdown
> [!NOTE]
> Highlights information that users should consider, even when skimming.
```
<!-- markdownlint-enable MD013 -->

> [!NOTE]
> Highlights information that users should take into account, even when
> skimming.

<!-- markdownlint-disable MD013 -->
```markdown
> [!TIP]
> Optional information to help a user be more successful.
```
<!-- markdownlint-enable MD013 -->

> [!TIP]
> Optional information to help a user be more successful.

<!-- markdownlint-disable MD013 -->
```markdown
> [!IMPORTANT]
> Crucial information necessary for users to succeed.
```
<!-- markdownlint-enable MD013 -->

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

<!-- markdownlint-disable MD013 -->
```markdown
> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.
```
<!-- markdownlint-enable MD013 -->

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

<!-- markdownlint-disable MD013 -->
```markdown
> [!CAUTION]
> Negative potential consequences of an action.
```
<!-- markdownlint-enable MD013 -->

> [!CAUTION]
> Negative potential consequences of an action.

## Real-World Examples

### Regular

> This is a regular blockquote without quote marks, perfect for general
> emphasis or citations where you don't want the traditional quotation styling.

### Quotations with Visual Quote Marks

> [!QUOTE]
> The best way to learn programming is not just by reading about it, but by
> actually writing code and solving real problems. Start small, be consistent,
> and don't be afraid to make mistakes – they're part of the learning process.

### Configuration Notes

> [!NOTE]
> Make sure to back up your configuration files before making any changes. This
> will allow you to restore your settings if something goes wrong.

### Performance Tips

> [!TIP]
> Use caching mechanisms like Redis or Memcached to improve application
> performance. This can reduce database load by up to 80% in typical web
> applications.

### Security Requirements

> [!IMPORTANT]
> Always validate user input on both client and server sides. Client-side
> validation is for user experience, but server-side validation is essential for
> security.

### Potential Issues

> [!WARNING]
> Running this command will permanently delete all data in the specified
> database. Make sure you have created a backup before proceeding.

### Breaking Changes

> [!CAUTION]
> This update contains breaking changes that will require code modifications.
> Review the migration guide carefully before upgrading to avoid application
> failures.

## Multi-paragraph Alerts

Alerts can contain multiple paragraphs and even other markdown elements:

> [!IMPORTANT]
> This is a complex alert with multiple paragraphs.
>
> It can contain **bold text**, _italic text_, and even code snippets like `npm
> install`.
>
> Use this for detailed explanations that require more context.

The blockquote handles inline code-blocks, e.g. `npm install`.
