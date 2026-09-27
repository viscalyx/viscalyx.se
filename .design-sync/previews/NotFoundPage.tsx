import { NotFoundPage } from 'viscalyx-site'

export const Default = () => (
  <div style={{ width: 900 }}>
    <NotFoundPage />
  </div>
)

export const DarkMode = () => (
  <div className="dark" style={{ width: 900 }}>
    <div className="bg-secondary-900 text-secondary-100">
      <NotFoundPage />
    </div>
  </div>
)
