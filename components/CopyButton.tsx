'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CheckmarkIcon, CopyIcon } from '@/components/BlogIcons'

interface ComponentProps {
  className?: string
  text: string
}

export default function CopyButton({ text, className = '' }: ComponentProps) {
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
      aria-label={copied ? t('copiedToClipboard') : t('copyCodeToClipboard')}
      className={`group relative flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-md bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-600 backdrop-blur-sm shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${className}`}
      onClick={handleCopy}
      title={copied ? t('copied') : t('copyToClipboard')}
      type="button"
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
