import { InstagramIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <InstagramIcon className="w-5 h-5" title="Instagram" />
    <InstagramIcon className="w-6 h-6" title="Instagram" />
    <InstagramIcon className="w-8 h-8" title="Instagram" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="Instagram"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://www.instagram.com"
    >
      <InstagramIcon className="w-5 h-5" title="Instagram" />
    </a>
    <a
      aria-label="Instagram"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://www.instagram.com"
    >
      <InstagramIcon className="w-5 h-5" title="Instagram" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <InstagramIcon className="w-8 h-8 text-primary-600" title="Instagram" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <InstagramIcon className="w-8 h-8 text-primary-400" title="Instagram" />
      </div>
    </div>
  </div>
)
