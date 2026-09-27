import type { ReactNode } from 'react'
import { ImageModal } from 'viscalyx-site'

const noop = () => {}

// The modal is position:fixed - a transformed frame keeps the overlay inside the cell.
const Frame = ({ children }: { children: ReactNode }) => (
  <div
    className="relative overflow-hidden"
    style={{ width: 900, height: 620, transform: 'translateZ(0)' }}
  >
    {children}
  </div>
)

export const BlogImage = () => (
  <Frame>
    <ImageModal
      imageAlt="A cross-platform folder DSC v3 resource configuring the same folder on Windows, Linux, and macOS"
      imageSrc="/blog-images/cross-platform-folder-dsc-v3-resource/cross-platform-config-folder-windows-linux-macos.png"
      isOpen
      onClose={noop}
    />
  </Frame>
)

export const Photo = () => (
  <Frame>
    <ImageModal
      imageAlt="Rear of an enterprise server with fans and status LEDs"
      imageSrc="/enterprise-server-rear-fans-leds-monochrome.png"
      isOpen
      onClose={noop}
    />
  </Frame>
)
