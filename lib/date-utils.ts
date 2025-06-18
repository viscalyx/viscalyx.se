/**
 * Date utility functions for the application
 */

/**
 * Normalizes a date string to ensure it's valid or returns a fallback date.
 * Supports fallback as a Date or date string.
 *
 * @param dateString - The date string to normalize (optional)
 * @param fallbackValue - The fallback date to use if the input is invalid (Date or string, defaults to Unix epoch)
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
  fallbackValue?: Date | string
): string {
  const parsedDate = dateString ? new Date(dateString) : undefined
  if (parsedDate && isValidDate(parsedDate)) {
    return getISODate(parsedDate)
  }
  // Normalize fallbackDate into a Date, defaulting to epoch start date if missing or invalid
  let fbDateObj: string
  if (fallbackValue === undefined) {
    fbDateObj = getISODate(new Date(0)) // Unix epoch start date
  } else if (typeof fallbackValue === 'string') {
    // If fallbackValue is a string, check if it's a valid date string, if so fetch the ISO date
    fbDateObj =
      fallbackValue && isValidDate(fallbackValue)
        ? getISODate(new Date(fallbackValue))
        : // Output the value the user passed even if it is not a dateString, e.g. 'Not valid date'
          fallbackValue
  } else {
    // If fallbackValue is a date, fetch the ISO date
    fbDateObj = getISODate(fallbackValue)
  }
  return fbDateObj
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
