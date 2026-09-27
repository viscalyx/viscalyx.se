import { MastodonIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <MastodonIcon className="w-5 h-5" title="Mastodon" />
    <MastodonIcon className="w-6 h-6" title="Mastodon" />
    <MastodonIcon className="w-8 h-8" title="Mastodon" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="Mastodon"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://mastodon.social"
    >
      <MastodonIcon className="w-5 h-5" title="Mastodon" />
    </a>
    <a
      aria-label="Mastodon"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://mastodon.social"
    >
      <MastodonIcon className="w-5 h-5" title="Mastodon" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <MastodonIcon className="w-8 h-8 text-primary-600" title="Mastodon" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <MastodonIcon className="w-8 h-8 text-primary-400" title="Mastodon" />
      </div>
    </div>
  </div>
)
