/**
 * Cookie utility functions for secure cookie management
 */

/**
 * Get secure attribute string for cookies based on protocol
 * @returns '; Secure' if served over HTTPS, empty string otherwise
 */
export function getSecureAttribute(): string {
  if (typeof window === 'undefined') return ''
  return window.location.protocol === 'https:' ? '; Secure' : ''
}

function writeCookie(cookie: string): void {
  const doc = window.document as Document & { cookie: string }
  doc.cookie = cookie
}

/**
 * Set a cookie with proper security attributes
 * @param name - Cookie name
 * @param value - Cookie value (will be URL encoded)
 * @param options - Cookie options
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    path?: string
    maxAge?: number
    expires?: string
    sameSite?: 'Strict' | 'Lax' | 'None'
    domain?: string
  } = {},
): void {
  if (typeof window === 'undefined') return

  const { path = '/', maxAge, expires, sameSite = 'Lax', domain } = options

  let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}${getSecureAttribute()}`

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`
  }

  if (expires) {
    cookieString += `; expires=${expires}`
  }

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  try {
    writeCookie(cookieString)
  } catch (error) {
    console.error('Failed to set cookie:', error)
  }
}

/**
 * Delete a cookie with proper security attributes
 * @param name - Cookie name to delete
 * @param options - Cookie options (path, domain)
 */
export function deleteCookie(
  name: string,
  options: {
    path?: string
    domain?: string
  } = {},
): void {
  if (typeof window === 'undefined') return

  const { path = '/', domain } = options
  const secureAttribute = getSecureAttribute()
  const expiresPast = 'expires=Thu, 01 Jan 1970 00:00:00 GMT'

  try {
    // Delete for current path
    writeCookie(`${name}=; path=${path}; ${expiresPast}${secureAttribute}`)

    // Delete for specified domain
    if (domain) {
      writeCookie(
        `${name}=; domain=${domain}; path=${path}; ${expiresPast}${secureAttribute}`,
      )
    } else {
      // Delete for root domain
      const currentDomain = window.location.hostname
      writeCookie(
        `${name}=; domain=${currentDomain}; path=${path}; ${expiresPast}${secureAttribute}`,
      )

      // Delete for parent domain (if subdomain)
      if (currentDomain.includes('.')) {
        const parentDomain = currentDomain.substring(currentDomain.indexOf('.'))
        writeCookie(
          `${name}=; domain=${parentDomain}; path=${path}; ${expiresPast}${secureAttribute}`,
        )
      }
    }
  } catch (error) {
    console.error('Failed to delete cookie:', error)
  }
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    const cookies = document.cookie.split(';')
    const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`))

    if (cookie) {
      const [, ...valueParts] = cookie.split('=')
      return decodeURIComponent(valueParts.join('='))
    }

    return null
  } catch {
    return null
  }
}
