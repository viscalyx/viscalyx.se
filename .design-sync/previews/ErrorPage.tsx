import { ErrorPage } from 'viscalyx-site'

const error = Object.assign(new Error('Failed to load blog posts'), {
  digest: '2846319071',
})
const reset = () => {}

export const Default = () => (
  <div style={{ width: 900 }}>
    <ErrorPage error={error} reset={reset} />
  </div>
)

export const DarkMode = () => (
  <div className="dark" style={{ width: 900 }}>
    <div className="bg-secondary-900 text-secondary-100">
      <ErrorPage error={error} reset={reset} />
    </div>
  </div>
)
