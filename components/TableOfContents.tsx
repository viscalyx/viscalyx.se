'use client'
import React, { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -60% 0px', // Adjust based on header height and content visibility
        threshold: 0.1,
      }
    )

    // Observe all headings
    items.forEach(item => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [items])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div
          key={index}
          className={`${
            item.level === 3 ? 'ml-4' : item.level === 4 ? 'ml-8' : ''
          }`}
        >
          <button
            onClick={() => handleClick(item.id)}
            className={`text-left w-full transition-all duration-200 block py-2 px-3 rounded-md hover:bg-primary-50 ${
              activeId === item.id
                ? 'text-primary-600 font-medium bg-primary-50 border-l-2 border-primary-600'
                : 'text-secondary-600 hover:text-primary-600'
            }`}
          >
            <span className="text-sm leading-relaxed">{item.text}</span>
          </button>
        </div>
      ))}
    </div>
  )
}

export default TableOfContents
