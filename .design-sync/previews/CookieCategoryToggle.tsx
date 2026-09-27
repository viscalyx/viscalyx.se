import { CookieCategoryToggle } from 'viscalyx-site'

const noop = () => {}

const Row = ({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) => (
  <div className="flex w-80 items-center justify-between gap-4 text-sm font-medium text-secondary-900 dark:text-secondary-100">
    <span>{name}</span>
    {children}
  </div>
)

export const States = () => (
  <div className="flex flex-col gap-2">
    <Row name="Strictly Necessary Cookies">
      <CookieCategoryToggle
        category="strictly-necessary"
        categoryName="Strictly Necessary Cookies"
        checked
        onChange={noop}
        requiredLabel="Required"
      />
    </Row>
    <Row name="Preference Cookies">
      <CookieCategoryToggle
        category="preferences"
        categoryName="Preference Cookies"
        checked
        onChange={noop}
      />
    </Row>
    <Row name="Analytics Cookies">
      <CookieCategoryToggle
        category="analytics"
        categoryName="Analytics Cookies"
        checked={false}
        onChange={noop}
      />
    </Row>
  </div>
)

export const DarkMode = () => (
  <div className="dark">
    <div className="flex flex-col gap-2 rounded-lg bg-secondary-900 p-4">
      <Row name="Preference Cookies">
        <CookieCategoryToggle
          category="preferences"
          categoryName="Preference Cookies"
          checked
          onChange={noop}
        />
      </Row>
      <Row name="Analytics Cookies">
        <CookieCategoryToggle
          category="analytics"
          categoryName="Analytics Cookies"
          checked={false}
          onChange={noop}
        />
      </Row>
    </div>
  </div>
)
