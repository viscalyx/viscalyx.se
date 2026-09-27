import { BlueskyIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <BlueskyIcon className="w-5 h-5" title="Bluesky" />
    <BlueskyIcon className="w-6 h-6" title="Bluesky" />
    <BlueskyIcon className="w-8 h-8" title="Bluesky" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="Bluesky"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://bsky.app"
    >
      <BlueskyIcon className="w-5 h-5" title="Bluesky" />
    </a>
    <a
      aria-label="Bluesky"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://bsky.app"
    >
      <BlueskyIcon className="w-5 h-5" title="Bluesky" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <BlueskyIcon className="w-8 h-8 text-primary-600" title="Bluesky" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <BlueskyIcon className="w-8 h-8 text-primary-400" title="Bluesky" />
      </div>
    </div>
  </div>
)
