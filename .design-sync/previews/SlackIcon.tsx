import { SlackIcon } from 'viscalyx-site'

export const Default = () => (
  <div className="flex items-center gap-4 text-secondary-900">
    <SlackIcon className="w-5 h-5" title="Slack" />
    <SlackIcon className="w-6 h-6" title="Slack" />
    <SlackIcon className="w-8 h-8" title="Slack" />
  </div>
)

export const FooterTile = () => (
  <div className="flex items-center gap-4 rounded-lg bg-secondary-900 p-6">
    <a
      aria-label="Slack"
      className="rounded-lg bg-secondary-800 p-3 text-white"
      href="https://slack.com"
    >
      <SlackIcon className="w-5 h-5" title="Slack" />
    </a>
    <a
      aria-label="Slack"
      className="rounded-lg bg-primary-600 p-3 text-white"
      href="https://slack.com"
    >
      <SlackIcon className="w-5 h-5" title="Slack" />
    </a>
  </div>
)

export const Brand = () => (
  <div className="flex items-center gap-4">
    <SlackIcon className="w-8 h-8 text-primary-600" title="Slack" />
    <div className="dark">
      <div className="rounded-lg bg-secondary-900 p-3">
        <SlackIcon className="w-8 h-8 text-primary-400" title="Slack" />
      </div>
    </div>
  </div>
)
