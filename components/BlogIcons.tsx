// Optimized blog icons using currentColor
import type React from 'react'
import { memo } from 'react'

interface BlogIconProps {
  className?: string
  label?: string
}

function getIconAccessibilityProps(label?: string) {
  if (!label) {
    return { 'aria-hidden': true as const }
  }

  return {
    'aria-label': label,
    role: 'img' as const,
  }
}

// Copy Icon - Stroke style (preferred from test)
export const CopyIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
      <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  ),
)
CopyIcon.displayName = 'CopyIcon'

// Checkmark Icon - Fill style (preferred from test)
export const CheckmarkIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
    </svg>
  ),
)
CheckmarkIcon.displayName = 'CheckmarkIcon'

// ChevronUp Icon - Stroke style for scroll indicators
export const ChevronUpIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
)
ChevronUpIcon.displayName = 'ChevronUpIcon'

// ChevronDown Icon - Stroke style for scroll indicators
export const ChevronDownIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-4 h-4', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
)
ChevronDownIcon.displayName = 'ChevronDownIcon'

// Note icon component for informational content
export const NoteIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
)
NoteIcon.displayName = 'NoteIcon'

// Tip icon component for helpful suggestions
export const TipIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
)
TipIcon.displayName = 'TipIcon'

// Important icon component for critical information
export const ImportantIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
)
ImportantIcon.displayName = 'ImportantIcon'

// Warning icon component for warning alerts
export const WarningIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
)
WarningIcon.displayName = 'WarningIcon'

// Caution icon component for caution alerts
export const CautionIcon: React.FC<BlogIconProps> = memo(
  ({ className = 'w-5 h-5', label }) => (
    // biome-ignore lint/a11y/noSvgWithoutTitle: accessibility handled via getIconAccessibilityProps (aria-hidden or aria-label+role)
    <svg
      {...getIconAccessibilityProps(label)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M8.111 2.889A3 3 0 0110.5 2h3a3 3 0 012.389.889L20.111 7.11A3 3 0 0121 9.5v5a3 3 0 01-.889 2.389L15.889 21.11A3 3 0 0113.5 22h-3a3 3 0 01-2.389-.889L3.889 16.89A3 3 0 013 14.5v-5a3 3 0 01.889-2.389L8.111 2.889z" />
      <path d="M12 9v2m0 4h.01" />
    </svg>
  ),
)
CautionIcon.displayName = 'CautionIcon'

// Alert Icon component for blog alerts/block quotes
export interface AlertIconProps extends BlogIconProps {
  type: 'note' | 'tip' | 'important' | 'warning' | 'caution'
}

export const AlertIcon: React.FC<AlertIconProps> = memo(
  ({ type, className = 'w-5 h-5', label }) => {
    switch (type) {
      case 'note':
        return <NoteIcon className={className} label={label} />
      case 'tip':
        return <TipIcon className={className} label={label} />
      case 'important':
        return <ImportantIcon className={className} label={label} />
      case 'warning':
        return <WarningIcon className={className} label={label} />
      case 'caution':
        return <CautionIcon className={className} label={label} />
      default:
        return <NoteIcon className={className} label={label} />
    }
  },
)
AlertIcon.displayName = 'AlertIcon'

// Helper function to get the appropriate icon component for an alert type
export const getAlertIcon = (
  type: string,
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
