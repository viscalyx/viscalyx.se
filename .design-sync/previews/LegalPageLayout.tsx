import type { ReactNode } from 'react'
import { LegalPageLayout, LegalSection } from 'viscalyx-site'

// LegalPageLayout renders the fixed Header - a transformed frame keeps it inside the cell.
const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ width: '100%', transform: 'translateZ(0)' }}>{children}</div>
)

export const PrivacyPolicy = () => (
  <Frame>
    <LegalPageLayout
      lastUpdatedDate={new Date('2025-06-01')}
      lastUpdatedLabel="Last updated"
      subtitle="How we collect, use, and protect your information"
      title="Privacy Policy"
    >
      <LegalSection
        description="We automatically collect limited information when you visit our website. We do not collect personal information such as names, email addresses, or contact details as we do not have contact forms or user accounts:"
        items={[
          'Blog reading analytics (article views, reading progress, time spent on pages)',
          'Technical information (IP address, user agent, browser type, referring website)',
          'Geographic information (country-level location from Cloudflare)',
        ]}
        title="Information we collect"
      />
      <LegalSection
        description="We implement appropriate technical and organizational measures to protect information. All data is processed through Cloudflare's secure infrastructure, and we do not store personal identifying information on our servers."
        title="Data security"
      />
    </LegalPageLayout>
  </Frame>
)
