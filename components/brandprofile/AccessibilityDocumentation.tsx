'use client'

import { getAccessibilityInfo } from '@/lib/colors'
import {
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
  Monitor,
  Palette,
} from 'lucide-react'
import { useState } from 'react'

interface AccessibilityGuidelineProps {
  title: string
  description: string
  status: 'compliant' | 'partial' | 'non-compliant'
  details: string[]
}

const AccessibilityGuideline = ({
  title,
  description,
  status,
  details,
}: AccessibilityGuidelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusIcon = {
    compliant: <CheckCircle className="w-5 h-5 text-green-500" />,
    partial: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    'non-compliant': <AlertCircle className="w-5 h-5 text-red-500" />,
  }

  const statusColor = {
    compliant: 'text-green-600 dark:text-green-400',
    partial: 'text-yellow-600 dark:text-yellow-400',
    'non-compliant': 'text-red-600 dark:text-red-400',
  }

  return (
    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {statusIcon[status]}
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-left w-full focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          >
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
              {title}
            </h4>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              {description}
            </p>
            <span
              className={`text-xs font-medium mt-2 inline-block ${statusColor[status]}`}
            >
              {status.replace('-', ' ').toUpperCase()}
            </span>
          </button>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-secondary-200 dark:border-secondary-700">
              <ul className="space-y-1">
                {details.map((detail, index) => (
                  <li
                    key={index}
                    className="text-sm text-secondary-700 dark:text-secondary-300"
                  >
                    • {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AccessibilityDocumentation = () => {
  const accessibilityInfo = getAccessibilityInfo()

  const guidelines: AccessibilityGuidelineProps[] = [
    {
      title: 'Color Contrast (WCAG 2.1 AA)',
      description:
        'All text and interactive elements meet minimum 4.5:1 contrast ratio',
      status: 'compliant',
      details: [
        'Primary colors tested against white and light backgrounds',
        'Secondary colors optimized for readability',
        'Interactive elements have sufficient contrast in all states',
        'Dark mode maintains proper contrast ratios',
      ],
    },
    {
      title: 'Color Blindness Accessibility',
      description:
        'Colors are distinguishable for users with color vision deficiencies',
      status: 'compliant',
      details: [
        'Tested for protanopia (red-blind) users',
        'Tested for deuteranopia (green-blind) users',
        'Tested for tritanopia (blue-blind) users',
        'Information not conveyed by color alone',
      ],
    },
    {
      title: 'Keyboard Navigation',
      description: 'All interactive elements are accessible via keyboard',
      status: 'compliant',
      details: [
        'Tab order follows logical flow',
        'Focus indicators are clearly visible',
        'All buttons and links are keyboard accessible',
        'Modal dialogs trap focus appropriately',
      ],
    },
    {
      title: 'Screen Reader Support',
      description: 'Content is properly structured for assistive technologies',
      status: 'compliant',
      details: [
        'Semantic HTML elements used appropriately',
        'ARIA labels provided where needed',
        'Heading hierarchy is logical',
        'Alt text provided for all images',
      ],
    },
    {
      title: 'Responsive Design',
      description: 'Interface adapts to different screen sizes and zoom levels',
      status: 'compliant',
      details: [
        'Content reflows properly at 400% zoom',
        'Touch targets are at least 44px × 44px',
        'Text remains readable at all screen sizes',
        'Horizontal scrolling is avoided',
      ],
    },
    {
      title: 'Animation & Motion',
      description:
        'Animations respect user preferences and accessibility needs',
      status: 'compliant',
      details: [
        'Respects prefers-reduced-motion setting',
        'No auto-playing videos or animations',
        'Animations have appropriate duration',
        'No flashing content that could trigger seizures',
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Monitor className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
            Accessibility Compliance
          </h2>
        </div>
        <p className="text-primary-700 dark:text-primary-300 mb-4">
          Our design system follows WCAG 2.1 AA guidelines and best practices to
          ensure accessibility for all users, including those with disabilities.
        </p>

        {/* Compliance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Palette className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                Color Contrast
              </span>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {
                accessibilityInfo.contrastTests.filter(test => test.passes)
                  .length
              }{' '}
              of {accessibilityInfo.contrastTests.length} tests passed
            </p>
          </div>

          <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                Color Blindness
              </span>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Tested for 3 types of color vision deficiency
            </p>
          </div>

          <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                WCAG Level
              </span>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              AA Compliant
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Guidelines */}
      <div>
        <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Accessibility Guidelines Compliance
        </h3>
        <div className="space-y-4">
          {guidelines.map((guideline, index) => (
            <AccessibilityGuideline key={index} {...guideline} />
          ))}
        </div>
      </div>

      {/* Testing Tools */}
      <div className="bg-secondary-50 dark:bg-secondary-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Accessibility Testing Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
              Automated Testing
            </h4>
            <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
              <li>• axe-core accessibility engine</li>
              <li>• Lighthouse accessibility audit</li>
              <li>• WAVE Web Accessibility Evaluation</li>
              <li>• Colour Contrast Analyser</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
              Manual Testing
            </h4>
            <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
              <li>• Keyboard navigation testing</li>
              <li>• Screen reader testing (NVDA, JAWS, VoiceOver)</li>
              <li>• Color blindness simulation</li>
              <li>• High contrast mode testing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
          Implementation Notes
        </h3>
        <div className="space-y-3 text-sm text-yellow-800 dark:text-yellow-200">
          <p>
            <strong>Color Usage:</strong> Always provide additional visual cues
            beyond color alone (icons, text, patterns) to convey important
            information.
          </p>
          <p>
            <strong>Focus Management:</strong> Ensure focus indicators are
            clearly visible and follow logical tab order throughout the
            interface.
          </p>
          <p>
            <strong>Alternative Text:</strong> Provide descriptive alt text for
            images and icons that convey meaning or function.
          </p>
          <p>
            <strong>Form Labels:</strong> Use proper labels and descriptions for
            all form inputs to assist screen reader users.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityDocumentation
