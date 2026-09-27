import { CookieSettings } from 'viscalyx-site'

export const Default = () => (
  <div className="p-4" style={{ width: 860 }}>
    <CookieSettings />
  </div>
)

export const DarkMode = () => (
  <div className="dark">
    <div className="bg-secondary-900 p-4" style={{ width: 860 }}>
      <CookieSettings />
    </div>
  </div>
)
