import React from 'react'
import Image from 'next/image'

interface XIconProps {
  className?: string
  variant?: 'dark' | 'light'
}

const XIcon: React.FC<XIconProps> = ({
  className = 'w-5 h-5',
  variant = 'light',
}) => {
  const iconSrc =
    variant === 'light'
      ? '/x-logo/logo-white.png'
      : '/x-logo/logo-black.png'

  const altText =
    variant === 'light' ? 'X logo (white)' : 'X logo (black)'

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

export default XIcon
