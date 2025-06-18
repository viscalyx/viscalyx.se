// Optimized blog icons using currentColor
import React, { memo } from 'react'

interface BlogIconProps {
  className?: string
}

// Copy Icon - Stroke style (preferred from test)
export const CopyIcon: React.FC<BlogIconProps> = ({
  className = 'w-4 h-4',
}) => (
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

// Checkmark Icon - Fill style (preferred from test)
export const CheckmarkIcon: React.FC<BlogIconProps> = ({
  className = 'w-4 h-4',
}) => (
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

// Add display names for memoized icons to satisfy react/display-name rule
ChevronUpIcon.displayName = 'ChevronUpIcon'
ChevronDownIcon.displayName = 'ChevronDownIcon'
