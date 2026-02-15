'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CopyIcon, CheckmarkIcon } from './BlogIcons'

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const t = useTranslations('copyButton')
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
      className={`group relative p-2 rounded-md bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-600 backdrop-blur-sm shadow-sm hover:shadow-md ${className}`}
      title={copied ? t('copied') : t('copyToClipboard')}
      aria-label={copied ? t('copiedToClipboard') : t('copyCodeToClipboard')}
    >
      {copied ? (
        <CheckmarkIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
      ) : (
        <CopyIcon className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors" />
      )}

      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
        {copied ? t('copied') : t('copy')}
      </span>
    </button>
  )
}
