import { CookieCategoryIcon } from 'viscalyx-site'

const categories = [
  { category: 'strictly-necessary', label: 'Strictly Necessary Cookies' },
  { category: 'preferences', label: 'Preference Cookies' },
  { category: 'analytics', label: 'Analytics Cookies' },
] as const

export const AllCategories = () => (
  <ul className="flex flex-col gap-3">
    {categories.map(({ category, label }) => (
      <li
        className="flex items-center gap-3 text-sm font-medium text-secondary-900"
        key={category}
      >
        <CookieCategoryIcon category={category} />
        {label}
      </li>
    ))}
  </ul>
)

export const DarkMode = () => (
  <div className="dark">
    <ul className="flex flex-col gap-3 rounded-lg bg-secondary-900 p-4">
      {categories.map(({ category, label }) => (
        <li
          className="flex items-center gap-3 text-sm font-medium text-secondary-100"
          key={category}
        >
          <CookieCategoryIcon category={category} />
          {label}
        </li>
      ))}
    </ul>
  </div>
)
