import { LanguageSwitcher, ThemeToggle } from 'viscalyx-site'

export const Default = () => <LanguageSwitcher />

export const InHeader = () => (
  <div className="flex w-96 items-center justify-between rounded-lg border bg-white/90 px-4 py-3 shadow-sm">
    <span className="text-xl font-bold text-gradient">Viscalyx</span>
    <div className="flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  </div>
)

export const DarkMode = () => (
  <div className="dark">
    <div className="flex w-96 items-center justify-between rounded-lg bg-secondary-900 px-4 py-3">
      <span className="text-xl font-bold text-gradient">Viscalyx</span>
      <LanguageSwitcher />
    </div>
  </div>
)
