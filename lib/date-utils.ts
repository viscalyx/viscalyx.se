/**
 * Date utility functions for the application
 */

/**
 * Normalizes a date string to ensure it's valid or returns a fallback date.
 * Supports fallback as a Date or date string.
 *
 * @param dateString - The date string to normalize (optional)
 * @param fallbackDate - The fallback date to use if the input is invalid (Date or string, defaults to Unix epoch)
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
  fallbackDate: Date | string = new Date(0)
): string {
  const parsedDate = dateString ? new Date(dateString) : undefined
  if (isValidDate(parsedDate)) {
    return getISODate(parsedDate as Date)
  }
  const fbDate =
    typeof fallbackDate === 'string'
      ? isValidDate(fallbackDate)
        ? new Date(fallbackDate)
        : new Date(0)
      : fallbackDate
  return getISODate(fbDate)
}

/**
 * Checks if a date is valid or if a string can be parsed to a valid date
 *
 * @param dateOrString - The date or date string to validate
 * @returns true if the date is valid, false otherwise
 */
export function isValidDate(date?: Date): boolean
export function isValidDate(dateString: string): boolean
export function isValidDate(dateOrString?: Date | string): boolean {
  if (typeof dateOrString === 'string') {
    const parsed = new Date(dateOrString)
    if (!(parsed instanceof Date) || isNaN(parsed.getTime())) {
      return false
    }
    const strictFormat = /^\d{4}-\d{2}-\d{2}$/
    if (strictFormat.test(dateOrString)) {
      return getISODate(parsed) === dateOrString
    }
    return true
  }
  return dateOrString instanceof Date && !isNaN(dateOrString.getTime())
}

/**
 * Gets the current date in ISO format (YYYY-MM-DD)
 *
 * @returns Current date as ISO string
 */
export function getCurrentDateISO(): string {
  return getISODate(new Date())
}

/**
 * Converts a date to ISO format (YYYY-MM-DD)
 *
 * @param date - The date to convert
 * @returns ISO date string
 */
export function getISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}
