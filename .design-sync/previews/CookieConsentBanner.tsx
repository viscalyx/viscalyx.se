import { CookieConsentBanner } from 'viscalyx-site'

// The banner and its backdrop are position:fixed - a transformed frame keeps them in the cell.
// It shows whenever no consent choice is stored (the preview page has none).
const Frame = ({
  children,
  dark,
}: {
  children: React.ReactNode
  dark?: boolean
}) => (
  <div className={dark ? 'dark' : undefined}>
    <div
      className="relative overflow-hidden bg-secondary-50 dark:bg-secondary-800"
      style={{ width: 860, height: 420, transform: 'translateZ(0)' }}
    >
      {children}
    </div>
  </div>
)

export const Default = () => (
  <Frame>
    <CookieConsentBanner />
  </Frame>
)

export const DarkMode = () => (
  <Frame dark>
    <CookieConsentBanner />
  </Frame>
)
