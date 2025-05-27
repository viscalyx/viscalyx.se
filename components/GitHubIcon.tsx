import React from 'react'
import Image from 'next/image'

interface GitHubIconProps {
  className?: string
  variant?: 'dark' | 'light'
}

const GitHubIcon: React.FC<GitHubIconProps> = ({
  className = 'w-5 h-5',
  variant = 'light',
}) => {
  const iconSrc =
    variant === 'light'
      ? '/github-mark/github-mark-white.svg'
      : '/github-mark/github-mark.svg'

  const altText =
    variant === 'light' ? 'GitHub logo (white)' : 'GitHub logo (dark)'

  return (
    <Image
      src={iconSrc}
      alt={altText}
      width={20}
      height={20}
      className={className}
      priority
    />
  )
}

export default GitHubIcon
