import { describe, it, expect, vi } from 'vitest'
import {
  getTeamMembers,
  getTeamMemberById,
  getTeamMemberByName,
  getAuthorInitials,
} from '../team'

// Mock translation function
const mockTranslation = vi.fn()
mockTranslation.raw = vi.fn()

// Type for the mock translation function
type MockTranslationFunction = {
  (key: string): string
  raw: (key: string) => unknown
}

const mockT = mockTranslation as MockTranslationFunction

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
        case 'members.testsson.role':
          return 'Test Role'
        case 'members.testsson.bio':
          return 'Test bio'
        default:
          return key
      }
    })
    
    mockTranslation.raw.mockImplementation((key: string) => {
      switch (key) {
        case 'members.johlju.specialties':
          return ['PowerShell DSC', 'DevOps', 'Open Source']
        case 'members.testsson.specialties':
          return ['Testing', 'Quality Assurance']
        default:
          return []
      }
    })
  })

  describe('getTeamMembers', () => {
    it('should return an array of team members with correct structure', () => {
      const teamMembers = getTeamMembers(mockT)
      
      expect(teamMembers).toBeInstanceOf(Array)
      expect(teamMembers).toHaveLength(2)
      
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
      
      // Check social links separately
      expect(teamMembers[0].socialLinks).toHaveLength(10)
      expect(teamMembers[0].socialLinks.some(link => link.name === 'Email')).toBe(true)
      expect(teamMembers[0].socialLinks.some(link => link.name === 'LinkedIn')).toBe(true)
      expect(teamMembers[0].socialLinks.some(link => link.name === 'Stack Overflow')).toBe(true)
      expect(teamMembers[0].socialLinks.some(link => link.name === 'YouTube')).toBe(true)
      expect(teamMembers[0].socialLinks.some(link => link.name === 'Slack')).toBe(true)
      
      // Check second member (testsson)
      expect(teamMembers[1]).toMatchObject({
        id: 'testsson',
        name: 'Test Testsson',
        role: 'Test Role',
        image: undefined,
        bio: 'Test bio',
        location: 'Sweden',
        specialties: ['Testing', 'Quality Assurance'],
      })
      
      // Check social links separately
      expect(teamMembers[1].socialLinks).toHaveLength(1)
      expect(teamMembers[1].socialLinks.some(link => link.name === 'Instagram')).toBe(true)
    })

    it('should call translation functions with correct keys', () => {
      getTeamMembers(mockT)
      
      expect(mockTranslation).toHaveBeenCalledWith('members.johlju.role')
      expect(mockTranslation).toHaveBeenCalledWith('members.johlju.bio')
      expect(mockTranslation).toHaveBeenCalledWith('members.testsson.role')
      expect(mockTranslation).toHaveBeenCalledWith('members.testsson.bio')
      
      expect(mockTranslation.raw).toHaveBeenCalledWith('members.johlju.specialties')
      expect(mockTranslation.raw).toHaveBeenCalledWith('members.testsson.specialties')
    })
  })

  describe('getTeamMemberById', () => {
    it('should return the correct team member by ID', () => {
      const member = getTeamMemberById('johlju', mockT)
      
      expect(member).not.toBeNull()
      expect(member?.id).toBe('johlju')
      expect(member?.name).toBe('Johan Ljunggren')
    })

    it('should return the correct team member by ID for testsson', () => {
      const member = getTeamMemberById('testsson', mockT)
      
      expect(member).not.toBeNull()
      expect(member?.id).toBe('testsson')
      expect(member?.name).toBe('Test Testsson')
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
      const initials = getAuthorInitials('Johan Anders Ljunggren')
      
      expect(initials).toBe('JA')
    })

    it('should return correct initials for a name with many words', () => {
      const initials = getAuthorInitials('Johan Anders Erik Ljunggren')
      
      expect(initials).toBe('JA')
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
})