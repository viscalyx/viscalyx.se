import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ConsentEvent } from '../consent-events'
import { consentEvents } from '../consent-events'

describe('ConsentEventEmitter', () => {
  beforeEach(() => {
    // Clean up all listeners between tests
    consentEvents.removeAllListeners()
  })

  it('should add and remove event listeners', () => {
    const listener = vi.fn()

    expect(consentEvents.getListenerCount('consent-changed')).toBe(0)

    const unsubscribe = consentEvents.on('consent-changed', listener)
    expect(consentEvents.getListenerCount('consent-changed')).toBe(1)

    unsubscribe()
    expect(consentEvents.getListenerCount('consent-changed')).toBe(0)
  })

  it('should emit consent-changed events', () => {
    const listener = vi.fn()
    consentEvents.on('consent-changed', listener)

    const event: ConsentEvent = {
      type: 'consent-changed',
      settings: {
        'strictly-necessary': true,
        analytics: true,
        preferences: false,
      },
    }

    consentEvents.emit(event)

    expect(listener).toHaveBeenCalledWith(event)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should emit consent-reset events', () => {
    const listener = vi.fn()
    consentEvents.on('consent-reset', listener)

    const event: ConsentEvent = {
      type: 'consent-reset',
    }

    consentEvents.emit(event)

    expect(listener).toHaveBeenCalledWith(event)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple listeners for the same event', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    consentEvents.on('consent-changed', listener1)
    consentEvents.on('consent-changed', listener2)

    const event: ConsentEvent = {
      type: 'consent-changed',
      settings: {
        'strictly-necessary': true,
        analytics: false,
        preferences: true,
      },
    }

    consentEvents.emit(event)

    expect(listener1).toHaveBeenCalledWith(event)
    expect(listener2).toHaveBeenCalledWith(event)
    expect(consentEvents.getListenerCount('consent-changed')).toBe(2)
  })

  it('should handle listener errors gracefully', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const workingListener = vi.fn()
    const errorListener = vi.fn(() => {
      throw new Error('Test error')
    })

    consentEvents.on('consent-changed', errorListener)
    consentEvents.on('consent-changed', workingListener)

    const event: ConsentEvent = {
      type: 'consent-changed',
      settings: {
        'strictly-necessary': true,
        analytics: true,
        preferences: true,
      },
    }

    consentEvents.emit(event)

    expect(errorListener).toHaveBeenCalledWith(event)
    expect(workingListener).toHaveBeenCalledWith(event)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in consent event listener:',
      expect.any(Error),
    )

    consoleErrorSpy.mockRestore()
  })

  it('should not emit to wrong event type listeners', () => {
    const changeListener = vi.fn()
    const resetListener = vi.fn()

    consentEvents.on('consent-changed', changeListener)
    consentEvents.on('consent-reset', resetListener)

    const resetEvent: ConsentEvent = {
      type: 'consent-reset',
    }

    consentEvents.emit(resetEvent)

    expect(resetListener).toHaveBeenCalledWith(resetEvent)
    expect(changeListener).not.toHaveBeenCalled()
  })

  it('should remove all listeners', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    consentEvents.on('consent-changed', listener1)
    consentEvents.on('consent-reset', listener2)

    expect(consentEvents.getListenerCount('consent-changed')).toBe(1)
    expect(consentEvents.getListenerCount('consent-reset')).toBe(1)

    consentEvents.removeAllListeners()

    expect(consentEvents.getListenerCount('consent-changed')).toBe(0)
    expect(consentEvents.getListenerCount('consent-reset')).toBe(0)
  })

  it('should automatically clean up empty listener sets', () => {
    const listener = vi.fn()
    const unsubscribe = consentEvents.on('consent-changed', listener)

    expect(consentEvents.getListenerCount('consent-changed')).toBe(1)

    unsubscribe()

    expect(consentEvents.getListenerCount('consent-changed')).toBe(0)
  })
})
