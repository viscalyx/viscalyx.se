import { vi } from 'vitest'

export const mockLoadingSpinner = () => {
  vi.mock('@/components/LoadingSpinner', () => ({
    __esModule: true,
    default: ({ size, color }: { size?: string; color?: string }) => (
      <output
        data-color={color}
        data-size={size}
        data-testid="loading-spinner"
      />
    ),
  }))
}
