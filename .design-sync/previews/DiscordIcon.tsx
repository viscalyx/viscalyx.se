import { DiscordIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <DiscordIcon className="w-5 h-5" title="Discord" />
    <DiscordIcon className="w-6 h-6" title="Discord" />
    <DiscordIcon className="w-8 h-8" title="Discord" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="Discord"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://discord.com"
    >
      <DiscordIcon className="w-5 h-5" title="Discord" />
    </a>
    <a
      aria-label="Discord"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://discord.com"
    >
      <DiscordIcon className="w-5 h-5" title="Discord" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <DiscordIcon className="w-8 h-8 text-primary-600" title="Discord" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <DiscordIcon className="w-8 h-8 text-primary-400" title="Discord" />
      </div>
    </div>
  </div>
)
