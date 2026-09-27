import { YouTubeIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <YouTubeIcon className="w-5 h-5" title="YouTube" />
    <YouTubeIcon className="w-6 h-6" title="YouTube" />
    <YouTubeIcon className="w-8 h-8" title="YouTube" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="YouTube"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://www.youtube.com"
    >
      <YouTubeIcon className="w-5 h-5" title="YouTube" />
    </a>
    <a
      aria-label="YouTube"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://www.youtube.com"
    >
      <YouTubeIcon className="w-5 h-5" title="YouTube" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <YouTubeIcon className="w-8 h-8 text-primary-600" title="YouTube" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <YouTubeIcon className="w-8 h-8 text-primary-400" title="YouTube" />
      </div>
    </div>
  </div>
)
