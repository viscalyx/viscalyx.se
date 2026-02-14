import React from 'react'
import { vi } from 'vitest'

// Hoist all mock functions
const {
  mockGetSerializableTeamMemberById,
  mockGetTeamMemberIds,
  mockNotFound,
} = vi.hoisted(() => ({
  mockGetSerializableTeamMemberById: vi.fn(),
  mockGetTeamMemberIds: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi
    .fn()
    .mockResolvedValue((key: string) => `translated:${key}`),
}))

// Mock team utilities
vi.mock('@/lib/team', () => ({
  getSerializableTeamMemberById: mockGetSerializableTeamMemberById,
  getTeamMemberIds: mockGetTeamMemberIds,
}))

// Mock constants
vi.mock('@/lib/constants', () => ({
  SITE_URL: 'https://example.com',
}))

// Mock i18n
vi.mock('@/i18n', () => ({
  locales: ['en', 'sv'],
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: mockNotFound,
}))

// Mock child component
vi.mock('../TeamMemberClient', () => ({
  __esModule: true,
  default: ({ member }: { member: { name: string } }) =>
    React.createElement(
      'div',
      { 'data-testid': 'team-member-client' },
      member.name
    ),
}))

import { render, screen } from '@testing-library/react'

import TeamMemberPage, {
  generateMetadata,
  generateStaticParams,
} from '@/app/[locale]/team/[memberId]/page'

import type { Metadata } from 'next'

const mockMember = {
  id: 'johlju',
  name: 'Johan Ljunggren',
  role: 'Founder & Lead Consultant',
  image: '/johlju-profile.jpg',
  bio: 'Passionate automation expert with over 30 years of experience.',
  location: 'Sweden',
  specialties: ['PowerShell DSC', 'DevOps'],
  socialLinks: [{ name: 'GitHub' as const, href: 'https://github.com/johlju' }],
}

describe('TeamMemberPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSerializableTeamMemberById.mockReturnValue(mockMember)
    mockGetTeamMemberIds.mockReturnValue(['johlju'])
  })

  describe('generateStaticParams', () => {
    it('returns params for all locales and member IDs', () => {
      const result = generateStaticParams()

      expect(result).toEqual([
        { locale: 'en', memberId: 'johlju' },
        { locale: 'sv', memberId: 'johlju' },
      ])
    })

    it('returns empty array when no members exist', () => {
      mockGetTeamMemberIds.mockReturnValue([])

      const result = generateStaticParams()

      expect(result).toEqual([])
    })
  })

  describe('generateMetadata', () => {
    it('returns metadata with member name and role in title', async () => {
      const params = Promise.resolve({ locale: 'en', memberId: 'johlju' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.title).toBe('Johan Ljunggren — Founder & Lead Consultant')
      expect(metadata.description).toBe(
        'Passionate automation expert with over 30 years of experience.'
      )
    })

    it('returns profile OG type with member image', async () => {
      const params = Promise.resolve({ locale: 'en', memberId: 'johlju' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.openGraph).toMatchObject({
        type: 'profile',
        locale: 'en_US',
        title: 'Johan Ljunggren — Founder & Lead Consultant',
      })

      const images = metadata.openGraph?.images as Array<{
        url: string
        alt: string
      }>
      expect(images[0]).toMatchObject({
        url: 'https://example.com/johlju-profile.jpg',
        alt: 'Johan Ljunggren',
      })
    })

    it('uses sv_SE locale for Swedish', async () => {
      const params = Promise.resolve({ locale: 'sv', memberId: 'johlju' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.openGraph).toMatchObject({
        locale: 'sv_SE',
      })
    })

    it('returns empty object for non-existent member', async () => {
      mockGetSerializableTeamMemberById.mockReturnValue(null)
      const params = Promise.resolve({ locale: 'en', memberId: 'nobody' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata).toEqual({})
    })

    it('includes twitter card metadata', async () => {
      const params = Promise.resolve({ locale: 'en', memberId: 'johlju' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        title: 'Johan Ljunggren — Founder & Lead Consultant',
        description:
          'Passionate automation expert with over 30 years of experience.',
      })
    })

    it('omits OG images when member has no image', async () => {
      mockGetSerializableTeamMemberById.mockReturnValue({
        ...mockMember,
        image: undefined,
      })
      const params = Promise.resolve({ locale: 'en', memberId: 'johlju' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.openGraph?.images).toBeUndefined()
    })

    it('includes alternates with canonical and languages', async () => {
      const params = Promise.resolve({ locale: 'en', memberId: 'johlju' })
      const metadata: Metadata = await generateMetadata({ params })

      expect(metadata.alternates?.canonical).toContain('/en/team/johlju')
      expect(metadata.alternates?.languages).toHaveProperty('en')
      expect(metadata.alternates?.languages).toHaveProperty('sv')
    })
  })

  describe('TeamMemberPage component', () => {
    it('renders TeamMemberClient with member data', async () => {
      const params = Promise.resolve({ locale: 'en', memberId: 'johlju' })
      const page = await TeamMemberPage({ params })
      render(page)

      expect(screen.getByTestId('team-member-client')).toBeInTheDocument()
      expect(screen.getByText('Johan Ljunggren')).toBeInTheDocument()
    })

    it('calls notFound for non-existent member', async () => {
      mockGetSerializableTeamMemberById.mockReturnValue(null)
      const params = Promise.resolve({ locale: 'en', memberId: 'nobody' })

      await expect(async () => TeamMemberPage({ params })).rejects.toThrow(
        'NEXT_NOT_FOUND'
      )
      expect(mockNotFound).toHaveBeenCalled()
    })
  })
})
