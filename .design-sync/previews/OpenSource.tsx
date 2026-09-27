import './_in-view'
import { OpenSource } from 'viscalyx-site'

export const Default = () => (
  <div className="w-full">
    <OpenSource />
  </div>
)

export const DarkMode = () => (
  <div className="dark w-full">
    <div className="bg-secondary-900 text-secondary-100">
      <OpenSource />
    </div>
  </div>
)
