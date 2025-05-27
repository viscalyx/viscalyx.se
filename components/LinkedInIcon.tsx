import React from 'react'
import Image from 'next/image'

interface LinkedInIconProps {
  className?: string
  variant?: 'dark' | 'light'
}

const LinkedInIcon: React.FC<LinkedInIconProps> = ({
  className = 'w-5 h-5',
  variant = 'light',
}) => {
  const iconSrc =
    variant === 'light'
      ? '/in-logo/InBug-White.png'
      : '/in-logo/InBug-Black.png'

  const altText =
    variant === 'light' ? 'LinkedIn logo (white)' : 'LinkedIn logo (black)'

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

export default LinkedInIcon
