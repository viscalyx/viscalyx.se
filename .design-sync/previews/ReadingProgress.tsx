import type { ReactNode } from 'react'
import { ReadingProgress } from 'viscalyx-site'

// The bar is position:fixed at the top of the viewport; the frame contains it inside the cell.
// Progress is real: the article (`target`) starts in the first viewport, so the reader is part-way in.
const Frame = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <div className={dark ? 'dark' : undefined}>
    <div
      className="relative overflow-hidden bg-white dark:bg-secondary-900"
      style={{ width: 720, height: 320, transform: 'translateZ(0)' }}
    >
      {children}
    </div>
  </div>
)

const Article = ({ id }: { id: string }) => (
  <article className="px-8 pt-10" id={id} style={{ height: 1400 }}>
    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
      Infrastructure
    </p>
    <h1 className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">
      Set Up a Hyper-V VM as a Time Machine Backup Target
    </h1>
    <p className="mt-4 max-w-xl text-secondary-600 dark:text-secondary-300">
      Turn a Hyper-V host into a network Time Machine destination for your Macs,
      with a dedicated virtual disk and Samba share.
    </p>
  </article>
)

export const PartWayThrough = () => (
  <Frame>
    <ReadingProgress target="#rp-article-light" />
    <Article id="rp-article-light" />
  </Frame>
)

export const DarkMode = () => (
  <Frame dark>
    <ReadingProgress target="#rp-article-dark" />
    <Article id="rp-article-dark" />
  </Frame>
)
