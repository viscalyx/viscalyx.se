import { vi } from 'vitest'

// Utility to suppress specific console.error warnings in tests
export function suppressConsoleErrors(): void {
  const originalError = console.error
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const firstArg = args[0]
    if (
      typeof firstArg === 'string' &&
      ((firstArg.includes('React does not recognize the') &&
        firstArg.includes('prop on a DOM element.')) ||
        firstArg.includes('non-boolean attribute') ||
        (firstArg.includes('Received') && firstArg.includes('fill')))
    ) {
      return
    }
    originalError(...(args as [unknown, ...unknown[]]))
  })
}
