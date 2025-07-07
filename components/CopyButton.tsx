'use client'

import { useState } from 'react'
import { CheckmarkIcon, CopyIcon } from './BlogIcons'

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)

      // Fallback for older browsers or when clipboard API is not available
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr)
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group relative p-2 rounded-md bg-white/80 hover:bg-white dark:bg-secondary-800/80 dark:hover:bg-secondary-800 transition-all duration-200 border border-secondary-200 dark:border-secondary-600 backdrop-blur-sm shadow-sm hover:shadow-md ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
    >
      {copied ? (
        <CheckmarkIcon className="w-4 h-4 text-[#059669]" />
      ) : (
        <CopyIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-300 group-hover:text-secondary-800 dark:group-hover:text-secondary-100 transition-colors" />
      )}

      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-secondary-900 dark:bg-secondary-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  )
}
