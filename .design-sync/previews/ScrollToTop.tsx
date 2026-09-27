import { useEffect } from 'react'
import { ScrollToTop } from 'viscalyx-site'

// ScrollToTop only shows once the page is scrolled past 300px: report a scrolled
// window and fire the scroll event it listens for (parent effects run after the child's).
const Scrolled = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => 640,
    })
    window.dispatchEvent(new Event('scroll'))
  }, [])
  return <>{children}</>
}

const Frame = ({
  children,
  dark,
}: {
  children: React.ReactNode
  dark?: boolean
}) => (
  <div className={dark ? 'dark' : undefined}>
    <div
      className="relative overflow-hidden rounded-lg border bg-white p-8 dark:bg-secondary-900"
      style={{ width: 560, height: 360, transform: 'translateZ(0)' }}
    >
      <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
        Getting started with SqlServerDsc
      </h3>
      <p className="mt-3 text-sm text-secondary-600 dark:text-secondary-300">
        Desired State Configuration lets you declare how a SQL Server instance
        should look and keeps it that way. This walkthrough installs the module
        and applies a first configuration.
      </p>
      <Scrolled>{children}</Scrolled>
    </div>
  </div>
)

export const Visible = () => (
  <Frame>
    <ScrollToTop />
  </Frame>
)

export const DarkMode = () => (
  <Frame dark>
    <ScrollToTop />
  </Frame>
)
