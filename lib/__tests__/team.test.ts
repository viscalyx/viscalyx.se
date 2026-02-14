import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAuthorInitials,
  getSerializableTeamMemberById,
  getSerializableTeamMemberByName,
  getTeamMemberById,
  getTeamMemberByName,
  getTeamMemberIds,
  getTeamMembers,
  socialIconMap,
} from '@/lib/team'

// Mock translation function with correct typing
const mockTranslation = vi.fn()
const mockRaw = vi.fn()

// Type for the mock translation function
type MockTranslationFunction = {
  (key: string): string
  raw: (key: string) => unknown
}

// Create the mock object with the raw method
const mockT: MockTranslationFunction = Object.assign(mockTranslation, {
  raw: mockRaw,
})

describe('team utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock return values
    mockTranslation.mockImplementation((key: string) => {
      switch (key) {
        case 'members.johlju.role':
          return 'Founder & Lead Consultant'
        case 'members.johlju.bio':
          return 'Passionate automation expert with over 30 years of experience in IT.'
        // case 'members.testsson.role':
        //   return 'Test Role'
        // case 'members.testsson.bio':
        //   return 'Test bio'
        default:
          return key
      }
    })

    mockRaw.mockImplementation((key: string) => {
      switch (key) {
        case 'members.johlju.specialties':
          return ['PowerShell DSC', 'DevOps', 'Open Source']
        // case 'members.testsson.specialties':
        //   return ['Testing', 'Quality Assurance']
        default:
          return []
      }
    })
  })

  describe('getTeamMembers', () => {
    it('should return an array of team members with correct structure', () => {
      const teamMembers = getTeamMembers(mockT)

      expect(teamMembers).toBeInstanceOf(Array)
      expect(teamMembers).toHaveLength(1)

      // Check first member (johlju)
      expect(teamMembers[0]).toMatchObject({
        id: 'johlju',
        name: 'Johan Ljunggren',
        role: 'Founder & Lead Consultant',
        image: '/johlju-profile.jpg',
        bio: 'Passionate automation expert with over 30 years of experience in IT.',
        location: 'Sweden',
        specialties: ['PowerShell DSC', 'DevOps', 'Open Source'],
      })

      // Check social links separately - currently 7 active links
      expect(teamMembers[0].socialLinks).toHaveLength(7)
      expect(
        teamMembers[0].socialLinks.some(link => link.name === 'Email')
      ).toBe(true)
      expect(
        teamMembers[0].socialLinks.some(link => link.name === 'LinkedIn')
      ).toBe(true)
      expect(
        teamMembers[0].socialLinks.some(link => link.name === 'Bluesky')
      ).toBe(true)
      expect(
        teamMembers[0].socialLinks.some(link => link.name === 'Mastodon')
      ).toBe(true)
      expect(teamMembers[0].socialLinks.some(link => link.name === 'X')).toBe(
        true
      )
      expect(
        teamMembers[0].socialLinks.some(link => link.name === 'Discord')
      ).toBe(true)
      expect(
        teamMembers[0].socialLinks.some(link => link.name === 'GitHub')
      ).toBe(true)
    })

    it('should call translation functions with correct keys', () => {
      getTeamMembers(mockT)

      expect(mockTranslation).toHaveBeenCalledWith('members.johlju.role')
      expect(mockTranslation).toHaveBeenCalledWith('members.johlju.bio')

      expect(mockRaw).toHaveBeenCalledWith('members.johlju.specialties')
    })
  })

  describe('getTeamMemberById', () => {
    it('should return the correct team member by ID', () => {
      const member = getTeamMemberById('johlju', mockT)

      expect(member).not.toBeNull()
      expect(member?.id).toBe('johlju')
      expect(member?.name).toBe('Johan Ljunggren')
    })

    it('should return null for testsson ID since it is commented out', () => {
      const member = getTeamMemberById('testsson', mockT)

      expect(member).toBeNull()
    })

    it('should return null for non-existent ID', () => {
      const member = getTeamMemberById('nonexistent', mockT)

      expect(member).toBeNull()
    })

    it('should return null for empty ID', () => {
      const member = getTeamMemberById('', mockT)

      expect(member).toBeNull()
    })
  })

  describe('getSerializableTeamMemberById', () => {
    it('should return a serializable team member without icon components', () => {
      const member = getSerializableTeamMemberById('johlju', mockT)

      expect(member).not.toBeNull()
      expect(member?.id).toBe('johlju')
      expect(member?.name).toBe('Johan Ljunggren')
      expect(member?.socialLinks).toHaveLength(7)

      // Verify socialLinks don't have icon property (serializable format)
      member?.socialLinks.forEach(link => {
        expect(link).toHaveProperty('name')
        expect(link).toHaveProperty('href')
        expect(link).not.toHaveProperty('icon')
      })
    })

    it('should return null for non-existent ID', () => {
      const member = getSerializableTeamMemberById('nonexistent', mockT)

      expect(member).toBeNull()
    })

    it('should return null for empty ID', () => {
      const member = getSerializableTeamMemberById('', mockT)

      expect(member).toBeNull()
    })

    it('should have all required fields in serializable format', () => {
      const member = getSerializableTeamMemberById('johlju', mockT)

      expect(member).toMatchObject({
        id: 'johlju',
        name: 'Johan Ljunggren',
        role: 'Founder & Lead Consultant',
        image: '/johlju-profile.jpg',
        bio: 'Passionate automation expert with over 30 years of experience in IT.',
        location: 'Sweden',
        specialties: ['PowerShell DSC', 'DevOps', 'Open Source'],
      })
    })

    it('should have social link names that match socialIconMap keys', () => {
      const member = getSerializableTeamMemberById('johlju', mockT)

      member?.socialLinks.forEach(link => {
        expect(Object.keys(socialIconMap)).toContain(link.name)
      })
    })
  })

  describe('socialIconMap', () => {
    it('should contain all expected social icon mappings', () => {
      expect(socialIconMap).toHaveProperty('Email')
      expect(socialIconMap).toHaveProperty('LinkedIn')
      expect(socialIconMap).toHaveProperty('Bluesky')
      expect(socialIconMap).toHaveProperty('Mastodon')
      expect(socialIconMap).toHaveProperty('X')
      expect(socialIconMap).toHaveProperty('Discord')
      expect(socialIconMap).toHaveProperty('GitHub')
    })

    it('should have valid React components for each icon', () => {
      Object.values(socialIconMap).forEach(icon => {
        // React components can be functions or objects (forwardRef returns an object)
        expect(['function', 'object']).toContain(typeof icon)
      })
    })
  })

  describe('getTeamMemberByName', () => {
    it('should return the correct team member by exact name', () => {
      const member = getTeamMemberByName('Johan Ljunggren', mockT)

      expect(member).not.toBeNull()
      expect(member?.name).toBe('Johan Ljunggren')
      expect(member?.id).toBe('johlju')
    })

    it('should return the correct team member by name case-insensitive', () => {
      const member = getTeamMemberByName('johan ljunggren', mockT)

      expect(member).not.toBeNull()
      expect(member?.name).toBe('Johan Ljunggren')
      expect(member?.id).toBe('johlju')
    })

    it('should return the correct team member by name with different casing', () => {
      const member = getTeamMemberByName('JOHAN LJUNGGREN', mockT)

      expect(member).not.toBeNull()
      expect(member?.name).toBe('Johan Ljunggren')
      expect(member?.id).toBe('johlju')
    })

    it('should return null for non-existent name', () => {
      const member = getTeamMemberByName('Non Existent', mockT)

      expect(member).toBeNull()
    })

    it('should return null for empty name', () => {
      const member = getTeamMemberByName('', mockT)

      expect(member).toBeNull()
    })
  })

  describe('getSerializableTeamMemberByName', () => {
    it('should return a serializable team member without icon components', () => {
      const member = getSerializableTeamMemberByName('Johan Ljunggren', mockT)

      expect(member).not.toBeNull()
      expect(member?.id).toBe('johlju')
      expect(member?.name).toBe('Johan Ljunggren')
      expect(member?.socialLinks).toHaveLength(7)

      // Verify socialLinks don't have icon property (serializable format)
      member?.socialLinks.forEach(link => {
        expect(link).toHaveProperty('name')
        expect(link).toHaveProperty('href')
        expect(link).not.toHaveProperty('icon')
      })
    })

    it('should be case-insensitive', () => {
      const member = getSerializableTeamMemberByName('johan ljunggren', mockT)

      expect(member).not.toBeNull()
      expect(member?.id).toBe('johlju')
    })

    it('should return null for non-existent name', () => {
      const member = getSerializableTeamMemberByName('Non Existent', mockT)

      expect(member).toBeNull()
    })

    it('should return null for empty name', () => {
      const member = getSerializableTeamMemberByName('', mockT)

      expect(member).toBeNull()
    })

    it('should have social link names that match socialIconMap keys', () => {
      const member = getSerializableTeamMemberByName('Johan Ljunggren', mockT)

      member?.socialLinks.forEach(link => {
        expect(Object.keys(socialIconMap)).toContain(link.name)
      })
    })
  })

  describe('getAuthorInitials', () => {
    it('should return correct initials for a two-word name', () => {
      const initials = getAuthorInitials('Johan Ljunggren')

      expect(initials).toBe('JL')
    })

    it('should return correct initials for a single word name', () => {
      const initials = getAuthorInitials('Johan')

      expect(initials).toBe('J')
    })

    it('should return correct initials for a three-word name', () => {
      const initials = getAuthorInitials('Johan Carl Ljunggren')

      expect(initials).toBe('JC')
    })

    it('should return correct initials for a name with many words', () => {
      const initials = getAuthorInitials('Johan Carl Erik Ljunggren')

      expect(initials).toBe('JC')
    })

    it('should handle lowercase names correctly', () => {
      const initials = getAuthorInitials('johan ljunggren')

      expect(initials).toBe('JL')
    })

    it('should handle mixed case names correctly', () => {
      const initials = getAuthorInitials('jOhAn LjUnGgReN')

      expect(initials).toBe('JL')
    })

    it('should handle empty string', () => {
      const initials = getAuthorInitials('')

      expect(initials).toBe('')
    })

    it('should handle names with extra spaces', () => {
      const initials = getAuthorInitials('  Johan   Ljunggren  ')

      expect(initials).toBe('JL')
    })

    it('should handle corporate names', () => {
      const initials = getAuthorInitials('Viscalyx Team')

      expect(initials).toBe('VT')
    })

    it('should handle hyphenated names', () => {
      const initials = getAuthorInitials('Mary-Jane Watson')

      expect(initials).toBe('MW')
    })
  })

  describe('getTeamMemberIds', () => {
    it('should return an array of strings', () => {
      const ids = getTeamMemberIds()

      expect(Array.isArray(ids)).toBe(true)
      ids.forEach(id => expect(typeof id).toBe('string'))
    })

    it('should include johlju', () => {
      const ids = getTeamMemberIds()

      expect(ids).toContain('johlju')
    })

    it('should return a non-empty array', () => {
      const ids = getTeamMemberIds()

      expect(ids.length).toBeGreaterThan(0)
    })
  })
})
