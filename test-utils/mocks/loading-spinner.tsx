import { vi } from 'vitest'

export const mockLoadingSpinner = () => {
  vi.mock('@/components/LoadingSpinner', () => ({
    __esModule: true,
    default: ({ size, color }: { size?: string; color?: string }) => (
      <div data-testid="loading-spinner" data-size={size} data-color={color} />
    ),
  }))
}
