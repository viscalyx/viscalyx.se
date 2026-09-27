import { LinkedInIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <LinkedInIcon className="w-5 h-5" title="LinkedIn" />
    <LinkedInIcon className="w-6 h-6" title="LinkedIn" />
    <LinkedInIcon className="w-8 h-8" title="LinkedIn" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="LinkedIn"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://www.linkedin.com"
    >
      <LinkedInIcon className="w-5 h-5" title="LinkedIn" />
    </a>
    <a
      aria-label="LinkedIn"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://www.linkedin.com"
    >
      <LinkedInIcon className="w-5 h-5" title="LinkedIn" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <LinkedInIcon className="w-8 h-8 text-primary-600" title="LinkedIn" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <LinkedInIcon className="w-8 h-8 text-primary-400" title="LinkedIn" />
      </div>
    </div>
  </div>
)
