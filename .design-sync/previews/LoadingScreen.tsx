import { LoadingScreen } from 'viscalyx-site'

const Frame = ({
  children,
  dark,
}: {
  children: React.ReactNode
  dark?: boolean
}) => (
  <div className={dark ? 'dark' : undefined}>
    <div
      className="ds-loading-frame overflow-hidden rounded-lg border bg-white dark:bg-secondary-900"
      style={{ width: 576, height: 320 }}
    >
      {/* LoadingScreen fills the viewport (min-h-screen); size it to the frame instead. */}
      <style>{'.ds-loading-frame .min-h-screen { min-height: 320px; }'}</style>
      {children}
    </div>
  </div>
)

export const Loading = () => (
  <Frame>
    <LoadingScreen />
  </Frame>
)

export const Redirecting = () => (
  <Frame>
    <LoadingScreen type="redirecting" />
  </Frame>
)

export const CustomMessage = () => (
  <Frame dark>
    <LoadingScreen message="Loading blog posts..." />
  </Frame>
)
