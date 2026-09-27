import { XIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <XIcon className="w-5 h-5" title="X" />
    <XIcon className="w-6 h-6" title="X" />
    <XIcon className="w-8 h-8" title="X" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="X"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://x.com"
    >
      <XIcon className="w-5 h-5" title="X" />
    </a>
    <a
      aria-label="X"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://x.com"
    >
      <XIcon className="w-5 h-5" title="X" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <XIcon className="w-8 h-8 text-primary-600" title="X" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <XIcon className="w-8 h-8 text-primary-400" title="X" />
      </div>
    </div>
  </div>
)
