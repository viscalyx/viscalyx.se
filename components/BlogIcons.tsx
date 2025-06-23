// Optimized blog icons using currentColor
import React, { memo } from 'react'

interface BlogIconProps {
  className?: string
}

// Copy Icon - Stroke style (preferred from test)
export const CopyIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4' }) => (
    <svg
      role="img"
      aria-label="Copy to clipboard"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
)
CopyIcon.displayName = 'CopyIcon'

// Checkmark Icon - Fill style (preferred from test)
export const CheckmarkIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4' }) => (
    <svg
      role="img"
      aria-label="Copied to clipboard"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
    </svg>
  )
)
CheckmarkIcon.displayName = 'CheckmarkIcon'

// ChevronUp Icon - Stroke style for scroll indicators
export const ChevronUpIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4' }) => (
    <svg
      role="img"
      aria-label="Scroll up"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
)

// ChevronDown Icon - Stroke style for scroll indicators
export const ChevronDownIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4' }) => (
    <svg
      role="img"
      aria-label="Scroll down"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
)

// Caution icon component for alerts
export const NoteIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5' }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
)
NoteIcon.displayName = 'NoteIcon'

export const TipIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5' }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
)
TipIcon.displayName = 'TipIcon'

export const ImportantIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5' }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  )
)
ImportantIcon.displayName = 'ImportantIcon'

export const WarningIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5' }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
)
WarningIcon.displayName = 'WarningIcon'

export const CautionIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5' }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.111 2.889A3 3 0 0110.5 2h3a3 3 0 012.389.889L20.111 7.11A3 3 0 0121 9.5v5a3 3 0 01-.889 2.389L15.889 21.11A3 3 0 0113.5 22h-3a3 3 0 01-2.389-.889L3.889 16.89A3 3 0 013 14.5v-5a3 3 0 01.889-2.389L8.111 2.889z" />
      <path d="M12 9v2m0 4h.01" />
    </svg>
  )
)
CautionIcon.displayName = 'CautionIcon'

// Add display names for memoized icons to satisfy react/display-name rule
ChevronUpIcon.displayName = 'ChevronUpIcon'
ChevronDownIcon.displayName = 'ChevronDownIcon'

// Alert Icon component for blog alerts/blockquotes
export interface AlertIconProps extends BlogIconProps {
  type: 'note' | 'tip' | 'important' | 'warning' | 'caution'
}

export const AlertIcon: React.FC<AlertIconProps> = memo(
  ({ type, className = 'w-5 h-5' }) => {
    switch (type) {
      case 'note':
        return <NoteIcon className={className} />
      case 'tip':
        return <TipIcon className={className} />
      case 'important':
        return <ImportantIcon className={className} />
      case 'warning':
        return <WarningIcon className={className} />
      case 'caution':
        return <CautionIcon className={className} />
      default:
        return <NoteIcon className={className} />
    }
  }
)
AlertIcon.displayName = 'AlertIcon'

// Helper function to get the appropriate icon component for an alert type
export const getAlertIcon = (
  type: string
): React.ComponentType<BlogIconProps> => {
  switch (type.toLowerCase()) {
    case 'note':
      return NoteIcon
    case 'tip':
      return TipIcon
    case 'important':
      return ImportantIcon
    case 'warning':
      return WarningIcon
    case 'caution':
      return CautionIcon
    default:
      return NoteIcon
  }
}
