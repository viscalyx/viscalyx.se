import { Hero } from 'viscalyx-site'

export const Default = () => (
  <div className="w-full">
    <Hero />
  </div>
)

export const DarkMode = () => (
  <div className="dark w-full">
    <div className="bg-secondary-900 text-secondary-100">
      <Hero />
    </div>
  </div>
)
