import { vi } from 'vitest'

vi.mock('@/components/LoadingSpinner', () => ({
  __esModule: true,
  default: ({ size, color }: { size?: string; color?: string }) => (
    <output data-color={color} data-size={size} data-testid="loading-spinner" />
  ),
}))

export const mockLoadingSpinner = () => {
  // Importing this module registers the top-level mock.
}
