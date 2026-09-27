import { LoadingSpinner } from 'viscalyx-site'

export const Sizes = () => (
  <div className="flex items-center gap-6">
    <LoadingSpinner size="sm" />
    <LoadingSpinner size="md" />
    <LoadingSpinner size="lg" />
  </div>
)

export const Colors = () => (
  <div className="flex items-center gap-6">
    <LoadingSpinner color="primary" size="lg" />
    <LoadingSpinner color="secondary" size="lg" />
    <div className="rounded-lg bg-primary-600 p-3">
      <LoadingSpinner color="white" size="lg" />
    </div>
  </div>
)

export const InButton = () => (
  <button
    className="btn-primary inline-flex items-center gap-2"
    disabled
    type="button"
  >
    <LoadingSpinner color="white" size="sm" />
    Saving...
  </button>
)
