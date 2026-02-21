# Blog Post Page Integration Tests

> Test flow documentation for [`blog-post.spec.ts`](blog-post.spec.ts)

These tests validate the blog post page after its Phase 2 conversion from a client-rendered page (with loading state + API fetch) to a server-rendered page with a `BlogPostContent` client island. They verify SSR behavior, SEO metadata, content rendering, navigation, share functionality, and locale support.

---

## Key Architecture

| Aspect             | Before (client)                           | After (server component)                       |
| ------------------ | ----------------------------------------- | ---------------------------------------------- |
| Data loading       | `useEffect` → `fetch('/api/blog/[slug]')` | Direct `loadBlogContent()` + `getPostBySlug()` |
| Initial render     | Loading spinner                           | Full HTML with content                         |
| Page `<title>`     | Client-set                                | `generateMetadata` with post title + OG tags   |
| Interactive parts  | Entire page is `'use client'`             | `BlogPostContent` client island only           |
| Content processing | Client-side heading IDs + ToC             | Server-side `addHeadingIds()` + `extractToC()` |
| Team member data   | Client fetched team member                | `getSerializableTeamMemberByName()` on server  |
| Analytics          | Client-only                               | Hybrid: server page-view + client engagement   |
| API route          | `/api/blog/[slug]` (deleted)              | N/A — direct function calls                    |

---

## Overview — Test Coverage Flow

```mermaid
flowchart TD
    A[Navigate to /blog/slug] --> B{Content Visible?}
    B -- Yes --> C[✓ SSR verified — no loading spinner]
    B -- No --> X[✗ Regression to client rendering]
    C --> D{Page title correct?}
    D -- Yes --> E[✓ generateMetadata working]
    D -- No --> Y[✗ Metadata not exported]
    E --> F{Post content visible?}
    F -- Yes --> G[Content Rendering Tests]
    F -- No --> Z[✗ Content not loaded]
    G --> G1[Featured image]
    G --> G2[Author name]
    G --> G3[Category badge]
    G --> G4[Read time]
    G --> G5[Tags]
    G1 & G2 & G3 & G4 & G5 --> H[Table of Contents]
    H --> I[Author Bio Section]
    I --> I1[Author name + role]
    I --> I2[View Profile link]
    I1 & I2 --> J[Navigation Tests]
    J --> J1[Back to Blog link]
    J --> J2[Header + Footer present]
    J --> J3[Back link navigates to /blog]
    J1 & J2 & J3 --> K[Share Functionality]
    K --> L[Related Posts]
    L --> M[Error Handling]
    M --> M1[404 for non-existent slug]
    M --> M2[404 for path traversal]
    M1 & M2 --> N[Locale Support]
    N --> N1[/en/blog/slug works]
    N --> N2[/sv/blog/slug works]
```

---

## Test Sections

### Server-Side Rendering (3 tests)

Validates that the page renders as a server component without client-side loading states.

| Test                 | What it checks                                           |
| -------------------- | -------------------------------------------------------- |
| Post title as h1     | `<h1>` contains post title — proves server-rendered HTML |
| No loading spinner   | "Loading blog post" text is absent                       |
| Blog content in page | `.prose` or article element visible with content         |

### Page Metadata (5 tests)

Validates `generateMetadata` output for SEO.

| Test             | What it checks                                    |
| ---------------- | ------------------------------------------------- |
| Page title       | `<title>` contains post title                     |
| Meta description | `<meta name="description">` is present and useful |
| OG article type  | `og:type` is "article"                            |
| OG image         | `og:image` is set                                 |
| Twitter card     | `twitter:card` is "summary_large_image"           |

### Post Content (5 tests)

Validates the rendered post content and metadata display.

| Test           | What it checks                       |
| -------------- | ------------------------------------ |
| Featured image | Post hero image is visible           |
| Author name    | Author name appears in post metadata |
| Category       | Category badge rendered              |
| Read time      | "X min read" displayed               |
| Tags           | At least one tag is visible          |

### Table of Contents (1 test)

| Test                  | What it checks                                                   |
| --------------------- | ---------------------------------------------------------------- |
| ToC rendered for post | Desktop sidebar ToC heading (`#toc-heading`) visible in viewport |

### Author Bio (2 tests)

| Test               | What it checks                         |
| ------------------ | -------------------------------------- |
| Author bio section | Team member name displayed in bio area |
| View Profile link  | Link to team member profile page       |

### Navigation (3 tests)

| Test                 | What it checks                |
| -------------------- | ----------------------------- |
| Back to Blog link    | "Back to Blog" text visible   |
| Back link navigation | Clicking navigates to `/blog` |
| Header + Footer      | Layout components rendered    |

### Share Functionality (1 test)

| Test                 | What it checks                 |
| -------------------- | ------------------------------ |
| Share button present | "Share" text visible in the UI |

### Related Posts (1 test)

| Test                     | What it checks                     |
| ------------------------ | ---------------------------------- |
| Related Articles section | "Related Articles" heading present |

### Error Handling (2 tests)

| Test                   | What it checks                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------- |
| 404 for missing slug   | Navigates to a non-existent slug and asserts the "404" heading is visible              |
| 404 for path traversal | Navigates to a percent-encoded traversal path and asserts the "404" heading is visible |

#### Path Traversal Test Details

Both error-handling tests use the `page` fixture (not the `request` fixture)
and validate DOM visibility of a "404" heading rather than asserting HTTP
response status codes.

The non-existent slug test navigates to `/blog/this-post-absolutely-does-not-exist`
via `page.goto(...)` and asserts the not-found page renders a visible `<h1>` with
text "404" using `page.getByRole('heading', { level: 1, name: '404' })`.

The path traversal test navigates to `/blog/%2e%2e%2f%2e%2e%2fetc%2fpasswd` <!-- cSpell:disable-line -->
via `page.goto(...)`. The percent-encoded path ensures the traversal payload
reaches the server before browser normalization can strip it. The assertion is
identical: the not-found page must render a visible `<h1>404</h1>` heading,
confirming the server rejected the malicious slug without leaking filesystem
content.

**Important selectors / preconditions:**

- Uses `page` fixture — navigates with `page.goto(...)` and performs DOM assertions.
- Asserts `page.getByRole('heading', { level: 1, name: '404' })` is visible.
- Encoded URL: `/blog/%2e%2e%2f%2e%2e%2fetc%2fpasswd` <!-- cSpell:disable-line -->
- Depends on `validateSlug` in `lib/blog.ts` rejecting slugs with non-alphanumeric/hyphen/underscore characters.

### Locale Support (2 tests)

| Test           | What it checks                    |
| -------------- | --------------------------------- |
| English locale | `/en/blog/slug` renders correctly |
| Swedish locale | `/sv/blog/slug` renders correctly |

### Mobile Table Behavior (1 test)

#### should keep page width stable and allow table horizontal scroll

**Purpose:** Validates that the page does not introduce unwanted horizontal overflow on mobile while still allowing horizontal scrolling within wide blog tables.

**Viewport:**

- iPhone 12/13 logical viewport (`390x844`)
- `isMobile: true`
- `hasTouch: true`

**Assertions:**

- Page dimensions stay stable:
  `html.scrollWidth <= html.clientWidth + 1`
- Page dimensions stay stable:
  `body.scrollWidth <= body.clientWidth + 1`
- Table horizontal scrolling works:
  `table.scrollLeft` increases after programmatic horizontal scroll.

**Prerequisites:**

- The test post contains at least one table that overflows horizontally at a `390px` viewport.

---

## Test Data

All tests use a known published post:

- **Slug**: `ssh-signing-keys-for-github-codespaces`
- **Author**: Johan Ljunggren
- **Category**: DevOps
- **Tags**: Git, SSH, GitHub, Codespaces, Security, DevOps

---

## Running Tests

```bash
# Run blog post integration tests only
npx playwright test tests/integration/blog-post.spec.ts

# Run all integration tests
npx playwright test

# Run with UI mode for debugging
npx playwright test tests/integration/blog-post.spec.ts --ui
```

---

## Fixture Requirements

- **Dev server** must be running on the configured `baseURL` (see `playwright.config.ts`).
- The test post (`ssh-signing-keys-for-github-codespaces`) must exist in `content/blog/` and have a built JSON in `public/blog-content/`.
- Both error-handling tests use the `page` fixture to navigate and assert DOM visibility of the "404" heading.

## Important Selectors

| Selector / Locator                         | Used in                |
| ------------------------------------------ | ---------------------- |
| `heading level: 1`                         | SSR title test         |
| `meta[name="description"]`                 | Meta description test  |
| `meta[property="og:type"]`                 | OG type test           |
| `meta[property="og:image"]`                | OG image test          |
| `meta[name="twitter:card"]`                | Twitter card test      |
| `.prose, article, [class*="blog-content"]` | Content rendering test |
| `#toc-heading`                             | Table of Contents test |
| `a` with text "Back to Blog"               | Navigation test        |
| `header`, `footer`                         | Layout test            |
