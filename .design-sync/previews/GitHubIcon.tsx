import { GitHubIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <GitHubIcon className="w-5 h-5" title="GitHub" />
    <GitHubIcon className="w-6 h-6" title="GitHub" />
    <GitHubIcon className="w-8 h-8" title="GitHub" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="GitHub"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://github.com"
    >
      <GitHubIcon className="w-5 h-5" title="GitHub" />
    </a>
    <a
      aria-label="GitHub"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://github.com"
    >
      <GitHubIcon className="w-5 h-5" title="GitHub" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <GitHubIcon className="w-8 h-8 text-primary-600" title="GitHub" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <GitHubIcon className="w-8 h-8 text-primary-400" title="GitHub" />
      </div>
    </div>
  </div>
)
