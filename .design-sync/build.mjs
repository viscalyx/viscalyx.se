// Builds the site's components as a package for the Claude Design sync
// (cfg.buildCmd). Outputs to .design-sync/.cache/pkg/ (gitignored):
//   dist/index.mjs  - ESM of .design-sync/entry.tsx, next/* and mermaid swapped for ./shims
//   types/          - tsc declarations (the converter's component list + props)
//   styles.css      - compiled Tailwind v4 stylesheet (site CSS + Inter webfont)
import { execFileSync } from 'node:child_process'
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwind from '@tailwindcss/postcss'
import esbuild from 'esbuild'
import postcss from 'postcss'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const out = join(here, '.cache/pkg')
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const shims = {
  'next/link': 'next-link.tsx',
  'next/image': 'next-image.tsx',
  'next/navigation': 'next-navigation.ts',
  'next/dynamic': 'next-dynamic.tsx',
  mermaid: 'mermaid.ts',
}

await esbuild.build({
  entryPoints: [join(here, 'entry.tsx')],
  outfile: join(out, 'dist/index.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  tsconfig: join(root, 'tsconfig.json'),
  packages: 'external',
  plugins: [
    {
      name: 'next-shims',
      setup(b) {
        b.onResolve(
          { filter: /^(next\/(link|image|navigation|dynamic)|mermaid)$/ },
          args => ({
            path: join(here, 'shims', shims[args.path]),
          }),
        )
      },
    },
  ],
  logLevel: 'warning',
})

execFileSync(
  process.execPath,
  [
    join(root, 'node_modules/typescript/bin/tsc'),
    '-p',
    join(here, 'tsconfig.types.json'),
  ],
  { stdio: 'inherit' },
)

// The converter globs the .d.ts tree under dirname(types) and its glob skips dot-dirs:
// move the entry's declarations out of types/.design-sync/ and point index.d.ts at them.
renameSync(join(out, 'types/.design-sync'), join(out, 'types/_sync'))
// tsc keeps the `@/` path alias in declarations; rewrite it to relative paths.
for (const f of readdirSync(join(out, 'types'), { recursive: true })) {
  if (!f.endsWith('.d.ts')) continue
  const file = join(out, 'types', f)
  const up = relative(dirname(file), join(out, 'types')) || '.'
  const text = readFileSync(file, 'utf8')
  const next = text.replace(
    /(['"])@\//g,
    `$1${up.startsWith('.') ? up : `./${up}`}/`,
  )
  if (next !== text) writeFileSync(file, next)
}
writeFileSync(join(out, 'types/index.d.ts'), "export * from './_sync/entry'\n")

const compileCss = async from =>
  (
    await postcss([tailwind({ base: root })]).process(
      readFileSync(from, 'utf8'),
      { from },
    )
  ).css
const css = [
  await compileCss(join(here, 'site.css')),
  // Compiled on its own, as in the app: its `@reference "./globals.css"` would switch a shared tree to reference mode.
  await compileCss(join(root, 'app/blog-content.css')),
].join('\n')
const inter =
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');\n"
writeFileSync(join(out, 'styles.css'), inter + css)

writeFileSync(
  join(out, 'package.json'),
  `${JSON.stringify(
    {
      name: 'viscalyx-site',
      version: JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
        .version,
      private: true,
      type: 'module',
      module: 'dist/index.mjs',
      types: 'types/index.d.ts',
      style: 'styles.css',
    },
    null,
    2,
  )}\n`,
)
console.log(`built ${out}`)
