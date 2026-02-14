# Page Metadata Integration Tests

## What is tested

- Every sub-page has a unique page title (not just the root fallback)
- Meta description is present and non-empty on all pages
- Open Graph metadata (type, locale, title, description) is correctly set
- Twitter card metadata is present
- OG type is `website` for all pages except team member pages (`profile`)
- Team member pages include OG image
- Locale switching correctly updates `og:locale` between `en_US` and `sv_SE`

## Pages covered

| Page         | Path              | OG Type |
| ------------ | ----------------- | ------- |
| Homepage     | `/en`             | website |
| Team listing | `/en/team`        | website |
| Team member  | `/en/team/johlju` | profile |
| Cookies      | `/en/cookies`     | website |
| Privacy      | `/en/privacy`     | website |
| Terms        | `/en/terms`       | website |

## Running

```bash
npx playwright test page-metadata
```
