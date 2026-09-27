import { CopyButton } from 'viscalyx-site'

const snippet = `Install-Module -Name SqlServerDsc -Scope CurrentUser`

export const Default = () => <CopyButton text={snippet} />

export const OnCodeBlock = () => (
  <div className="relative w-[28rem] rounded-lg bg-secondary-900 p-4 pr-16 font-mono text-sm text-secondary-100">
    <code>{snippet}</code>
    <div className="absolute top-2 right-2">
      <CopyButton text={snippet} />
    </div>
  </div>
)

export const DarkMode = () => (
  <div className="dark">
    <div className="flex items-center gap-3 rounded-lg bg-secondary-900 p-4">
      <CopyButton text={snippet} />
      <span className="text-sm text-secondary-300">
        Copy the install command
      </span>
    </div>
  </div>
)
