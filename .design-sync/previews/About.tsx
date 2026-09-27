import './_in-view'
import { About } from 'viscalyx-site'

export const Default = () => <About />

export const DarkMode = () => (
  <div className="dark">
    <div className="bg-secondary-900">
      <About />
    </div>
  </div>
)
