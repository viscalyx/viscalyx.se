# Design sync notes (viscalyx.se)

This repo is a Next.js site, not a component package. `.design-sync/build.mjs`
(`cfg.buildCmd`) turns `components/` into a package the converter can consume,
at `.design-sync/.cache/pkg/` (gitignored, rebuilt every sync). Run it before
`package-build.mjs` / `resync.mjs`.

## How the package is built

- `entry.tsx` re-exports every component by name (the site uses default exports,
  which the converter's synth entry can't see). New components must be added
  there.
- `next/link`, `next/image`, `next/navigation`, `next/dynamic` and `mermaid` are
  swapped for `shims/*` by an esbuild plugin in `build.mjs`. `usePathname()`
  returns `/en`; routers are no-ops.
- `next/image` shim rewrites root-relative `src` (the site's `public/` photos)
  to `https://viscalyx.org<src>` (user decision, first sync). `SITE_URL` in
  `lib/constants.ts` is the source.
- `mermaid` shim loads the installed mermaid version's ESM build from jsDelivr
  on first use (inlining it made the bundle 8.6 MB instead of 1.5 MB).
- Declarations: tsc via `tsconfig.types.json`; `build.mjs` then moves
  `types/.design-sync` to `types/_sync` (the converter's `**/*.d.ts` glob skips
  dot-dirs) and rewrites `@/` imports to relative paths (tsc keeps path aliases;
  the converter can't resolve them).
- CSS: Tailwind v4 compiled from `site.css` (globals + code-block + shiki +
  `@source inline` safelist for the design agent). `app/blog-content.css` is
  compiled SEPARATELY: its `@reference "./globals.css"` puts a shared tree in
  reference mode and drops every theme var. Inter comes from a Google Fonts
  `@import` prepended to `styles.css` (`[FONT_REMOTE]`, expected).
- `site.css` has `@source not` for `.agents` and `.github`: Tailwind auto-scans
  the whole repo, and a skill doc (skills live in either folder depending on
  branch) used `font-serif`, which pulled Tailwind's default serif stack
  (Cambria) into the CSS. The Claude Design app then flagged Cambria as a
  missing font and added a Caladea substitute. Cambria is NOT a site font (user
  asked about `public/cambria-font-complete-kit`, first sync: not shipped). If
  `[FONT_MISSING]`/`[FONT_REMOTE]` names Cambria again, find the new scan
  source.
- `esbuild` is imported from the repo's `node_modules` (transitive via
  vitest/vite).
- Groups come from `docsMap` stubs in `groups/*.md` (paths are relative to the
  package dir, hence `../../groups/`).
- Excluded from cards (still in the bundle): `AlertIconInjector`,
  `CodeBlockEnhancer`, `ImageEnhancer` (DOM mutators for server-rendered blog
  HTML), `CookieSettingsWrapper` (thin `next/dynamic` wrapper of
  `CookieSettings`), the small BlogIcons glyphs (`AlertIcon` covers them),
  `SiteProvider`.

## Preview authoring

- `cfg.provider` = `SiteProvider` with `skipAnimations: true`.
  `package-capture.mjs` freezes the clock, so framer-motion animations never
  leave their first frame (opacity 0) without it. `SiteProvider`'s default is
  `false`, so designs keep their animations.
- Sections that reveal on scroll (`useInView` / `whileInView`) need `import
  './_in-view'` at the top of the preview: it replaces IntersectionObserver so
  everything reports as in view. Don't import it in components that use
  IntersectionObserver for behavior (TableOfContents, ReadingProgress).
- Dark mode: `<div className="dark"><div className="bg-secondary-900
  text-secondary-100">` (the `dark` custom variant matches `.dark *`). The text
  color matters: uncolored headings inherit the body's
  `dark:text-secondary-100`, which only fires when `.dark` is on `<html>`.
- Captures are 900x700 at a fixed 2024 clock: tall sections crop at 700px,
  media-query breakpoints follow the viewport (not a wrapper, so no truthful
  "mobile" story), Footer copyright reads 2024.
- Fixed-position overlays (modals, banners): wrap each story in a frame of fixed
  size with `transform: translateZ(0)` so the overlay stays inside the cell, and
  set `cardMode: "single"`.
- A component's own `relative` class beats an `absolute` passed via `className`:
  position it with a wrapper div instead.
- Use real copy from `messages/en.json` when the component takes text props.

## Known render warns

- `[FONT_REMOTE] "Inter"`: expected, Inter loads from Google Fonts.

## Preview gotchas (from the first sync's authoring waves)

- Previews can't import `lib/blog.ts` (dynamic `node:fs/promises`),
  `lib/slug-utils-client.ts` (sanitize-html pulls postcss internals) or anything
  using the `@/` alias (e.g. `lib/team.ts`). Blog previews read
  `lib/blog-data.json` and `public/blog-content/<slug>.json` (`.content` is the
  pre-rendered HTML) directly and mirror the slug logic with `slugify`.
- Tailwind classes that appear only in previews are compiled by `build.mjs`
  (site.css `@source`s `./previews`), so a new class needs a full rebuild before
  it shows.
- `next/image` shim loads eagerly: lazy offscreen images never load and
  `package-capture`'s settle step waits on `img.decode()` forever (the capture
  hangs).
- LoadingScreen is `min-h-screen`: its preview caps that with a frame-scoped
  `<style>`.
- ScrollToTop only shows past `scrollY > 300`: its preview redefines
  `window.scrollY` and fires `scroll`.
- CookieConsentBanner shows because the preview page has no stored consent;
  "Accept All" autofocuses.
- LanguageSwitcher's open dropdown needs a click, so only the closed state is
  previewed.
- Footer is always dark (no DarkMode story).
- MermaidRenderer loads mermaid from jsDelivr; the capture sandbox can reach it.

## Repo findings (not fixed by the sync)

- `MermaidRenderer`'s `SVG_SANITIZE_OPTIONS` (DOMPurify 3.4.5) strips the HTML
  inside `<foreignObject>`, so flowchart/class/state diagram labels render empty
  (same code as the live site). Sequence/gantt/pie diagrams use SVG `<text>` and
  are fine; the preview shows those.

## Re-sync risks

- `build.mjs` depends on `esbuild` and `@tailwindcss/postcss` from the repo's
  `node_modules` (esbuild is transitive); a dependency bump that drops esbuild
  breaks the build.
- Shims mimic Next APIs (`next/link`, `next/image`, `next/navigation`,
  `next/dynamic`): new Next imports in components (e.g. `next/script`,
  `useSearchParams` behavior) need shim coverage.
- `entry.tsx` lists components by hand: a new component in `components/` is
  invisible until added.
- Images load from `https://viscalyx.org` and mermaid from jsDelivr (pinned to
  the installed version): both need network wherever designs render.
- Blog previews read `lib/blog-data.json` / `public/blog-content/*.json`: new or
  removed posts change their content, which re-triggers grading for those
  previews.
- Previews for the capture step rely on `skipAnimations` + `_in-view.ts`; a
  component that animates without framer-motion (CSS keyframes are fine) may
  need its own handling.
