/**
 * Date utility functions for the application
 */

/**
 * Normalizes a date string to ensure it's valid or returns a fallback date.
 *
 * @param dateString - The date string to normalize (optional)
 * @param fallbackDate - The fallback date to use if the input is invalid (defaults to '1970-01-01')
 * @returns A valid ISO date string or the fallback date
 *
 * @example
 * normalizeDate('2024-12-10') // returns '2024-12-10'
 * normalizeDate('invalid-date') // returns '1970-01-01'
 * normalizeDate(undefined) // returns '1970-01-01'
 * normalizeDate('', '2024-01-01') // returns '2024-01-01'
 */
export function normalizeDate(
  dateString?: string,
  fallbackDate: string = '1970-01-01'
): string {
  return dateString && !isNaN(Date.parse(dateString))
    ? dateString
    : fallbackDate
}

/**
 * Checks if a date string is valid
 *
 * @param dateString - The date string to validate
 * @returns true if the date string is valid, false otherwise
 */
export function isValidDate(dateString?: string): boolean {
  return Boolean(dateString && !isNaN(Date.parse(dateString)))
}

/**
 * Gets the current date in ISO format (YYYY-MM-DD)
 *
 * @returns Current date as ISO string
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0]
}
