import './_in-view'
import { Team } from 'viscalyx-site'

export const Default = () => (
  <div className="w-full">
    <Team />
  </div>
)

export const DarkMode = () => (
  <div className="dark w-full">
    <div className="bg-secondary-900 text-secondary-100">
      <Team />
    </div>
  </div>
)
