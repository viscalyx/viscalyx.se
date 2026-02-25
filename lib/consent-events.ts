/**
 * Event system for cookie consent changes
 * Provides a clean way to handle consent-related events without circular dependencies
 */

export type ConsentEventType = 'consent-changed' | 'consent-reset'

export interface ConsentChangeEvent {
  type: 'consent-changed'
  settings: {
    'strictly-necessary': boolean
    analytics: boolean
    preferences: boolean
  }
}

export interface ConsentResetEvent {
  type: 'consent-reset'
}

export type ConsentEvent = ConsentChangeEvent | ConsentResetEvent

type ConsentEventListener = (event: ConsentEvent) => void

class ConsentEventEmitter {
  private listeners: Map<ConsentEventType, Set<ConsentEventListener>> =
    new Map()

  /**
   * Subscribe to consent events
   */
  on(eventType: ConsentEventType, listener: ConsentEventListener): () => void {
    let eventListeners = this.listeners.get(eventType)
    if (!eventListeners) {
      eventListeners = new Set()
      this.listeners.set(eventType, eventListeners)
    }
    eventListeners.add(listener)

    // Return unsubscribe function
    return () => {
      eventListeners.delete(listener)
      if (eventListeners.size === 0) {
        this.listeners.delete(eventType)
      }
    }
  }

  /**
   * Emit a consent event
   */
  emit(event: ConsentEvent): void {
    const listeners = this.listeners.get(event.type)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          console.error('Error in consent event listener:', error)
        }
      })
    }
  }

  /**
   * Remove all listeners (useful for testing)
   */
  removeAllListeners(): void {
    this.listeners.clear()
  }

  /**
   * Get number of listeners for a specific event type (useful for testing)
   */
  getListenerCount(eventType: ConsentEventType): number {
    return this.listeners.get(eventType)?.size ?? 0
  }
}

// Global event emitter instance
export const consentEvents = new ConsentEventEmitter()
