import { Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { ConfirmationModal } from 'viscalyx-site'

const noop = () => {}

// The modal is position:fixed - a transformed frame contains the overlay inside the cell.
const Frame = ({ children }: { children: ReactNode }) => (
  <div
    className="relative overflow-hidden"
    style={{ width: 720, height: 460, transform: 'translateZ(0)' }}
  >
    {children}
  </div>
)

export const Danger = () => (
  <Frame>
    <ConfirmationModal
      cancelText="Cancel"
      confirmIcon={<Trash2 aria-hidden="true" className="w-4 h-4" />}
      confirmText="Reset Consent"
      isOpen
      message="Are you sure you want to reset all cookie preferences? This will remove all stored consent data."
      onClose={noop}
      onConfirm={noop}
      title="Reset Cookie Preferences"
      variant="danger"
    />
  </Frame>
)

export const Warning = () => (
  <Frame>
    <ConfirmationModal
      cancelText="Keep editing"
      confirmText="Discard changes"
      isOpen
      message="You have unsaved cookie preferences. Leaving now will discard them."
      onClose={noop}
      onConfirm={noop}
      title="Discard unsaved changes?"
      variant="warning"
    />
  </Frame>
)

export const Info = () => (
  <Frame>
    <ConfirmationModal
      cancelText="Not now"
      confirmText="Continue"
      isOpen
      message="You are about to open the Viscalyx GitHub organization in a new tab."
      onClose={noop}
      onConfirm={noop}
      title="Leaving viscalyx.org"
      variant="info"
    />
  </Frame>
)

export const Loading = () => (
  <Frame>
    <ConfirmationModal
      cancelText="Cancel"
      confirmIcon={<Trash2 aria-hidden="true" className="w-4 h-4" />}
      confirmLoading
      confirmText="Reset Consent"
      isOpen
      message="Are you sure you want to reset all cookie preferences? This will remove all stored consent data."
      onClose={noop}
      onConfirm={noop}
      title="Reset Cookie Preferences"
      variant="danger"
    />
  </Frame>
)
