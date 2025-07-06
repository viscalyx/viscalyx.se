import { ReactNode } from 'react'

interface ComponentDemoProps {
  title: string
  description: string
  children: ReactNode
}

const ComponentDemo = ({
  title,
  description,
  children,
}: ComponentDemoProps) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
        {title}
      </h4>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        {description}
      </p>
    </div>
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
      {children}
    </div>
  </div>
)

export default ComponentDemo
