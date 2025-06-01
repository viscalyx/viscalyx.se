# Page Dates Management

This document explains how page last modified dates are managed in the sitemap and individual pages.

## Overview

The application uses actual Git commit dates for static pages instead of always using the current date (`new Date()`). This improves SEO accuracy by providing real last modified timestamps.

## How It Works

### 1. Build Script (`scripts/build-page-dates.js`)

- Reads Git history to find the last commit date for each static page
- Generates `lib/page-dates.json` with ISO date strings
- Runs during the build process via `npm run build:page-dates`

### 2. Data File (`lib/page-dates.json`)

- Contains last modified dates for all static pages
- Format: `{ "pageName": "2025-06-01T09:37:24.000Z" }`
- Generated automatically, not manually edited

### 3. Utility Function (`lib/file-dates.ts`)

- Exports `getStaticPageDates()` function
- Reads from `page-dates.json` and converts to Date objects
- Works in all environments including Cloudflare Workers

### 4. Usage

**In Sitemap (`app/sitemap.ts`):**
```typescript
const staticPageDates = getStaticPageDates()
// Use staticPageDates.privacy, staticPageDates.terms, etc.
```

**In Pages (`app/[locale]/privacy/page.tsx`, etc.):**
```typescript
const staticPageDates = getStaticPageDates()
// Use format.dateTime(staticPageDates.privacy, {...})
```

## Build Process Integration

The page dates are built automatically as part of:
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run deploy`

## Manual Update

To manually update page dates:
```bash
npm run build:page-dates
```

## Tracked Pages

- **home**: `app/[locale]/page.tsx`
- **blog**: `app/[locale]/blog/page.tsx`
- **caseStudies**: `app/[locale]/case-studies/page.tsx`
- **privacy**: `app/[locale]/privacy/page.tsx`
- **terms**: `app/[locale]/terms/page.tsx`

## Benefits

1. **SEO Accuracy**: Real last modified dates instead of current date
2. **Environment Compatibility**: Works in Cloudflare Workers and other serverless environments
3. **Automatic Updates**: Dates update when files are actually modified
4. **Build-time Generation**: No runtime Git commands or file system access needed

## Adding New Pages

To track a new static page:

1. Add it to the `pageDates` object in `scripts/build-page-dates.js`
2. Add the corresponding property to the return object in `lib/file-dates.ts`
3. Update the TypeScript declaration in `lib/page-dates.json.d.ts`
