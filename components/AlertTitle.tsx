import React from 'react'
import { AlertIcon, type AlertIconProps } from './BlogIcons'

interface AlertTitleProps {
  type: AlertIconProps['type']
  title: string
  className?: string
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
  type,
  title,
  className = 'github-alert-title font-bold mb-3 flex items-center gap-2',
}) => {
  return (
    <div className={className}>
      <AlertIcon type={type} className="w-5 h-5" />
      {title}
    </div>
  )
}

export default AlertTitle
