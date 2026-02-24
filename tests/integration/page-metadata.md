# Page Metadata Integration Tests

> Test flow documentation for [`page-metadata.spec.ts`](page-metadata.spec.ts)

This test suite validates that every page on the site has correct SEO
metadata — page titles, meta descriptions, Open Graph tags, Twitter card
tags, and locale-specific values.

---

## Overview Flowchart

<!-- markdownlint-disable MD013 -->
```mermaid
flowchart TD
    A[Page Load] --> B{Which page?}
    B --> C[Homepage /en]
    B --> D[Team /en/team]
    B --> E[Team Member /en/team/johlju]
    B --> F[Cookies /en/cookies]
    B --> G[Privacy /en/privacy]
    B --> H[Terms /en/terms]

    C --> I[Check title, description, OG, Twitter]
    D --> I
    E --> J[Check title, description, OG profile, OG image, Twitter]
    F --> I
    G --> I
    H --> I

    I --> K{Locale switch?}
    K -- /sv --> L["Verify og:locale = sv_SE"]
    K -- /en --> M["Verify og:locale = en_US"]
```
<!-- markdownlint-enable MD013 -->

---

## Test Setup

No shared `beforeEach` hooks — each test navigates to the target page
directly via `page.goto()`. Tests rely on the Next.js development server
being available (started by Playwright config).

---

## Pages Covered

<!-- markdownlint-disable MD013 -->
| Page         | Path              | OG Type | Twitter Card        |
| ------------ | ----------------- | ------- | ------------------- |
| Homepage     | `/en`             | website | summary_large_image |
| Team listing | `/en/team`        | website | summary_large_image |
| Team member  | `/en/team/johlju` | profile | summary_large_image |
| Cookies      | `/en/cookies`     | website | summary_large_image |
| Privacy      | `/en/privacy`     | website | summary_large_image |
| Terms        | `/en/terms`       | website | summary_large_image |
<!-- markdownlint-enable MD013 -->

---

## Test Cases

### Homepage — should have page title with template suffix

**Purpose:** Ensures the homepage title contains the site name.

1. Navigate to `/en`.
2. Assert `document.title` contains "Viscalyx".

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en
    Note over P: ✓ title contains "Viscalyx"
```
<!-- markdownlint-enable MD013 -->

### Homepage — should have meta description

**Purpose:** Validates that a non-trivial meta description is present.

1. Navigate to `/en`.
2. Read `meta[name="description"]` content.
3. Assert it is truthy and longer than 10 characters.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en
    P->>P: Read meta description
    Note over P: ✓ description.length > 10
```
<!-- markdownlint-enable MD013 -->

### Homepage — should have Open Graph metadata

**Purpose:** Confirms OG title, description, type, and locale are set for the
homepage.

1. Navigate to `/en`.
2. Assert `og:title` and `og:description` are truthy.
3. Assert `og:type` is `website`.
4. Assert `og:locale` is `en_US`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en
    Note over P: ✓ og:title present
    Note over P: ✓ og:description present
    Note over P: ✓ og:type = website
    Note over P: ✓ og:locale = en_US
```
<!-- markdownlint-enable MD013 -->

### Homepage — should have Twitter card metadata

**Purpose:** Validates Twitter card type is set on the homepage.

1. Navigate to `/en`.
2. Assert `twitter:card` is `summary_large_image`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en
    Note over P: ✓ twitter:card = summary_large_image
```
<!-- markdownlint-enable MD013 -->

### Team Page — should have team-specific page title

**Purpose:** Ensures the team page has a unique title, not just the root
fallback.

1. Navigate to `/en/team`.
2. Assert title contains "Viscalyx" and is longer than just "Viscalyx".

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/team
    Note over P: ✓ title contains "Viscalyx"
    Note over P: ✓ title.length > "Viscalyx".length
```
<!-- markdownlint-enable MD013 -->

### Team Page — should have meta description

**Purpose:** Validates meta description is present on the team page.

1. Navigate to `/en/team`.
2. Assert `meta[name="description"]` is truthy and longer than 10 characters.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/team
    P->>P: Read meta description
    Note over P: ✓ description.length > 10
```
<!-- markdownlint-enable MD013 -->

### Team Page — should have Open Graph metadata

**Purpose:** Confirms OG title and type are correctly set.

1. Navigate to `/en/team`.
2. Assert `og:title` is truthy and `og:type` is `website`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/team
    Note over P: ✓ og:title present
    Note over P: ✓ og:type = website
```
<!-- markdownlint-enable MD013 -->

### Team Page — should have Twitter card metadata

**Purpose:** Validates Twitter card is present on the team page.

1. Navigate to `/en/team`.
2. Assert `twitter:card` is `summary_large_image`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/team
    Note over P: ✓ twitter:card = summary_large_image
```
<!-- markdownlint-enable MD013 -->

### Team Member Page — should have member-specific page title

**Purpose:** Ensures individual member pages have a unique title.

1. Navigate to `/en/team/johlju`.
2. Assert title contains "Viscalyx" and is longer than just "Viscalyx".

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/team/johlju
    Note over P: ✓ title contains "Viscalyx"
    Note over P: ✓ title.length > "Viscalyx".length
```
<!-- markdownlint-enable MD013 -->

### Team Member Page — should have Open Graph profile type

**Purpose:** Validates that team member pages use the `profile` OG type.

1. Navigate to `/en/team/johlju`.
2. Assert `og:type` is `profile`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/team/johlju
    Note over P: ✓ og:type = profile
```
<!-- markdownlint-enable MD013 -->

### Team Member Page — should have member image in OG metadata

**Purpose:** Confirms that an OG image is present for team members with images.

1. Navigate to `/en/team/johlju`.
2. Assert `og:image` is truthy.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/team/johlju
    Note over P: ✓ og:image present
```
<!-- markdownlint-enable MD013 -->

### Cookies Page — should have cookies-specific page title

**Purpose:** Ensures the cookies page has a unique title.

1. Navigate to `/en/cookies`.
2. Assert title contains "Viscalyx" and is longer than just "Viscalyx".

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/cookies
    Note over P: ✓ title contains "Viscalyx"
    Note over P: ✓ title.length > "Viscalyx".length
```
<!-- markdownlint-enable MD013 -->

### Cookies Page — should have meta description

**Purpose:** Validates meta description is present on the cookies page.

1. Navigate to `/en/cookies`.
2. Assert `meta[name="description"]` is truthy.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/cookies
    P->>P: Read meta description
    Note over P: ✓ description is truthy
```
<!-- markdownlint-enable MD013 -->

### Cookies Page — should have Open Graph metadata

**Purpose:** Confirms OG type is `website` on the cookies page.

1. Navigate to `/en/cookies`.
2. Assert `og:type` is `website`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/cookies
    Note over P: ✓ og:type = website
```
<!-- markdownlint-enable MD013 -->

### Cookies Page — should have Twitter card metadata

**Purpose:** Validates Twitter card is present on the cookies page.

1. Navigate to `/en/cookies`.
2. Assert `twitter:card` is `summary_large_image`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/cookies
    Note over P: ✓ twitter:card = summary_large_image
```
<!-- markdownlint-enable MD013 -->

### Privacy Page — should have privacy-specific page title

**Purpose:** Ensures the privacy page has a unique title.

1. Navigate to `/en/privacy`.
2. Assert title contains "Viscalyx" and is longer than just "Viscalyx".

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/privacy
    Note over P: ✓ title contains "Viscalyx"
    Note over P: ✓ title.length > "Viscalyx".length
```
<!-- markdownlint-enable MD013 -->

### Privacy Page — should have meta description

**Purpose:** Validates meta description is present on the privacy page.

1. Navigate to `/en/privacy`.
2. Assert `meta[name="description"]` is truthy.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/privacy
    P->>P: Read meta description
    Note over P: ✓ description is truthy
```
<!-- markdownlint-enable MD013 -->

### Privacy Page — should have Open Graph metadata

**Purpose:** Confirms OG type is `website` on the privacy page.

1. Navigate to `/en/privacy`.
2. Assert `og:type` is `website`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/privacy
    Note over P: ✓ og:type = website
```
<!-- markdownlint-enable MD013 -->

### Privacy Page — should have Twitter card metadata

**Purpose:** Validates Twitter card is present on the privacy page.

1. Navigate to `/en/privacy`.
2. Assert `twitter:card` is `summary_large_image`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/privacy
    Note over P: ✓ twitter:card = summary_large_image
```
<!-- markdownlint-enable MD013 -->

### Terms Page — should have terms-specific page title

**Purpose:** Ensures the terms page has a unique title.

1. Navigate to `/en/terms`.
2. Assert title contains "Viscalyx" and is longer than just "Viscalyx".

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/terms
    Note over P: ✓ title contains "Viscalyx"
    Note over P: ✓ title.length > "Viscalyx".length
```
<!-- markdownlint-enable MD013 -->

### Terms Page — should have meta description

**Purpose:** Validates meta description is present on the terms page.

1. Navigate to `/en/terms`.
2. Assert `meta[name="description"]` is truthy.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/terms
    P->>P: Read meta description
    Note over P: ✓ description is truthy
```
<!-- markdownlint-enable MD013 -->

### Terms Page — should have Open Graph metadata

**Purpose:** Confirms OG type is `website` on the terms page.

1. Navigate to `/en/terms`.
2. Assert `og:type` is `website`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/terms
    Note over P: ✓ og:type = website
```
<!-- markdownlint-enable MD013 -->

### Terms Page — should have Twitter card metadata

**Purpose:** Validates Twitter card is present on the terms page.

1. Navigate to `/en/terms`.
2. Assert `twitter:card` is `summary_large_image`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /en/terms
    Note over P: ✓ twitter:card = summary_large_image
```
<!-- markdownlint-enable MD013 -->

### Locale Switching — should use sv_SE locale for Swedish homepage

**Purpose:** Validates that the Swedish locale correctly sets `og:locale`.

1. Navigate to `/sv`.
2. Assert `og:locale` is `sv_SE`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /sv
    Note over P: ✓ og:locale = sv_SE
```
<!-- markdownlint-enable MD013 -->

### Locale Switching — should use sv_SE locale for Swedish team page

**Purpose:** Validates locale switching works on subpages too.

1. Navigate to `/sv/team`.
2. Assert `og:locale` is `sv_SE`.

<!-- markdownlint-disable MD013 -->
```mermaid
sequenceDiagram
    participant P as Page
    P->>P: goto /sv/team
    Note over P: ✓ og:locale = sv_SE
```
<!-- markdownlint-enable MD013 -->

## Running

<!-- markdownlint-disable MD013 -->
```bash
npx playwright test page-metadata
```
<!-- markdownlint-enable MD013 -->
