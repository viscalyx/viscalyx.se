# Viscalyx conventions (read first)

These are the real components of the viscalyx.org website (a Next.js site for
automation and DevOps consulting): page sections, blog, cookie consent, and a
few controls. Build pages that look like viscalyx.org by composing them, and use
Tailwind utility classes for your own layout.

## Setup: always wrap in `SiteProvider`

Every component reads translations (next-intl, the site's own
`messages/*.json`) and the theme from `SiteProvider`. Without it, components
that call `useTranslations`/`useTheme` throw.

```jsx
const { SiteProvider, Header, Hero, Footer } = window.Viscalyx;
<SiteProvider locale="en">{/* "en" | "sv" */}
  <Header />
  <main><Hero /></main>
  <Footer />
</SiteProvider>
```

- Leave `skipAnimations` off in designs: the site animates sections with
  framer-motion. The preview cards turn it on only because they are static.
- Most section/page components (`Hero`, `About`, `Team`, `OpenSource`,
  `Header`, `Footer`, `NotFoundPage`) take no props: their copy comes from
  translations. Don't pass text to them. Components with props
  (`ConfirmationModal`, `CopyButton`, `LegalSection`, `BlogPostGrid`, ...) are
  documented in their `<Name>.prompt.md` / `<Name>.d.ts`.
- `Header` is `position: fixed` (about 70px tall): offset the content below it,
  e.g. `pt-20`. `Hero` is a full-height section designed to sit under the
  header without an offset.
- Dark mode is class-based: put `dark` on `<html>` (or a wrapper), and use a
  `bg-secondary-900 text-secondary-100` surface. `ThemeToggle` switches it for
  real.
- Links render as plain `<a>`; site photos load from `https://viscalyx.org`.

## Styling idiom: Tailwind v4 utilities + the site's theme

No CSS-in-JS, no style props: style your own glue with Tailwind classes.
Palette:

- **Brand blue** for CTAs, links and accents: `bg-primary-600`,
  `text-primary-600`, `hover:bg-primary-700`, `dark:bg-primary-500`, shades
  `primary-50..900`.
- **Slate neutrals** for surfaces, body text and borders: `bg-secondary-50`,
  `text-secondary-600`, `text-secondary-900`, `border-secondary-200`,
  `dark:bg-secondary-800/900`, shades `secondary-50..950`.
- **Page background**: `bg-white`, `dark:bg-secondary-900`.

Site component classes from `app/globals.css`, compiled into `_ds_bundle.css`:
`btn-primary`, `btn-secondary` (rounded-lg buttons with hover lift),
`section-padding` (py-16 + responsive px), `container-custom` (max-w-7xl
mx-auto), `gradient-bg` (primary-50 to white to secondary-50 hero wash),
`card-hover` (shadow + lift on hover), `text-gradient` (primary-600 to 800
clipped text). The font is Inter (`font-sans`, the default). Long-form content
uses `prose` / `.blog-content`.

Only classes that are in the compiled stylesheet work, because there is no
Tailwind at runtime. It holds everything the site uses plus the
primary/secondary colors, spacing 0–24, `sm:/md:/lg:` flex/grid/
`grid-cols-1..6`, text sizes `xs..6xl`, font weights, `rounded*`, and
`shadow*`. Arbitrary values (`w-[37rem]`) won't resolve: use inline `style` for
those.

## Where the truth lives

- `styles.css` imports `_ds_bundle.css`: the compiled Tailwind CSS with theme
  tokens (`--color-primary-*`, `--color-secondary-*`, `--font-sans`). Grep it
  before inventing a class.
- `components/<group>/<Name>/<Name>.prompt.md` shows the props and verified
  example JSX.

## Example

```jsx
const { SiteProvider, CopyButton } = window.Viscalyx;
const cmd = 'Install-Module -Name SqlServerDsc';
<SiteProvider>
  <section className="section-padding gradient-bg">
    <div className="container-custom grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-4xl font-bold text-secondary-900 dark:text-white">
          Automate your <span className="text-gradient">SQL Server</span>
        </h2>
        <p className="mt-4 text-lg text-secondary-600">
          PowerShell DSC resources, maintained in the open.
        </p>
        <a className="btn-primary mt-8 inline-block" href="#contact">
          Get in touch
        </a>
      </div>
      <div className="relative rounded-lg bg-secondary-900 p-4 pr-16
                      font-mono text-sm text-secondary-100">
        <code>{cmd}</code>
        <div className="absolute top-2 right-2">
          <CopyButton text={cmd} />
        </div>
      </div>
    </div>
  </section>
</SiteProvider>
```
