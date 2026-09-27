import { AlertIcon } from 'viscalyx-site'

// Title colors from app/blog-content.css (--alert-title-color-light / -dark).
const types = [
  { type: 'note', label: 'Note', light: '#2563eb', dark: '#60a5fa' },
  { type: 'tip', label: 'Tip', light: '#16a34a', dark: '#34d399' },
  { type: 'important', label: 'Important', light: '#7c3aed', dark: '#a78bfa' },
  { type: 'warning', label: 'Warning', light: '#d97706', dark: '#fb923c' },
  { type: 'caution', label: 'Caution', light: '#dc2626', dark: '#f87171' },
] as const

export const AllTypes = () => (
  <div className="flex flex-wrap gap-6">
    {types.map(({ type, label, light }) => (
      <div className="flex flex-col items-center gap-2" key={type}>
        <span style={{ color: light }}>
          <AlertIcon className="w-8 h-8" type={type} />
        </span>
        <span className="text-sm font-medium text-secondary-700">{label}</span>
      </div>
    ))}
  </div>
)

// How the blog uses it: AlertIconInjector puts the icon in each GitHub-style alert title.
export const InAlertTitle = () => (
  <div className="blog-content prose w-[32rem]">
    {types
      .filter(({ type }) => type !== 'important')
      .map(({ type, label }) => (
        <div
          className={`github-alert github-alert-${type}`}
          data-alert-type={type}
          key={type}
        >
          <div className="github-alert-title">
            <AlertIcon label={label} type={type} />
            {label}
          </div>
          <div className="github-alert-content">
            <p>
              {type === 'note' &&
                'DSC v3 resources run on Windows, Linux, and macOS.'}
              {type === 'tip' &&
                'Use Test-DscConfiguration to check for drift before applying.'}
              {type === 'warning' &&
                'Applying this configuration restarts the SQL Server service.'}
              {type === 'caution' &&
                'Removing the VHDX deletes every Time Machine backup on it.'}
            </p>
          </div>
        </div>
      ))}
  </div>
)

export const DarkMode = () => (
  <div className="dark">
    <div className="flex flex-wrap gap-6 rounded-lg bg-secondary-900 p-6 text-secondary-100">
      {types.map(({ type, dark }) => (
        <span key={type} style={{ color: dark }}>
          <AlertIcon className="w-8 h-8" type={type} />
        </span>
      ))}
    </div>
  </div>
)
