import { StackOverflowIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <StackOverflowIcon className="w-5 h-5" title="Stack Overflow" />
    <StackOverflowIcon className="w-6 h-6" title="Stack Overflow" />
    <StackOverflowIcon className="w-8 h-8" title="Stack Overflow" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="Stack Overflow"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://stackoverflow.com"
    >
      <StackOverflowIcon className="w-5 h-5" title="Stack Overflow" />
    </a>
    <a
      aria-label="Stack Overflow"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://stackoverflow.com"
    >
      <StackOverflowIcon className="w-5 h-5" title="Stack Overflow" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <StackOverflowIcon
      className="w-8 h-8 text-primary-600"
      title="Stack Overflow"
    />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <StackOverflowIcon
          className="w-8 h-8 text-primary-400"
          title="Stack Overflow"
        />
      </div>
    </div>
  </div>
)
