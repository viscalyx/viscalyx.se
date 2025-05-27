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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px', // Adjust based on header height
        threshold: 0.1,
      }
    )

    // Observe all headings
    items.forEach((item) => {
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
        block: 'start'
      })
    }
  }

  return (
    <ul className="space-y-2 text-sm">
      {items.map((item, index) => (
        <li 
          key={index} 
          className={`${
            item.level === 3 ? 'ml-4' : 
            item.level === 4 ? 'ml-8' : ''
          }`}
        >
          <button
            onClick={() => handleClick(item.id)}
            className={`text-left w-full transition-colors block py-1 hover:underline ${
              activeId === item.id
                ? 'text-primary-600 font-medium'
                : 'text-secondary-600 hover:text-primary-600'
            }`}
          >
            {item.text}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TableOfContents