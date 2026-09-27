import type { ReactNode } from 'react'
import { Header } from 'viscalyx-site'

// The header is position:fixed - a transformed frame keeps it inside the cell.
const Frame = ({
  children,
  dark,
  width = '100%',
}: {
  children: ReactNode
  dark?: boolean
  width?: number | string
}) => (
  <div className={dark ? 'dark' : undefined}>
    <div
      className={`gradient-bg relative overflow-hidden ${dark ? 'text-secondary-100' : ''}`}
      style={{ width, height: 120, transform: 'translateZ(0)' }}
    >
      {children}
    </div>
  </div>
)

export const Default = () => (
  <Frame>
    <Header />
  </Frame>
)

export const DarkMode = () => (
  <Frame dark>
    <Header />
  </Frame>
)
