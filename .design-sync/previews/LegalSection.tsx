import { LegalSection } from 'viscalyx-site'

export const WithItems = () => (
  <div className="max-w-3xl">
    <LegalSection
      description="We automatically collect limited information when you visit our website. We do not collect personal information such as names, email addresses, or contact details as we do not have contact forms or user accounts:"
      items={[
        'Blog reading analytics (article views, reading progress, time spent on pages)',
        'Technical information (IP address, user agent, browser type, referring website)',
        'Geographic information (country-level location from Cloudflare)',
        'Website preferences (theme stored in local storage, language stored as a cookie in your browser)',
      ]}
      title="Information we collect"
    />
  </div>
)

export const DescriptionOnly = () => (
  <div className="max-w-3xl">
    <LegalSection
      description="We implement appropriate technical and organizational measures to protect information. All data is processed through Cloudflare's secure infrastructure, and we do not store personal identifying information on our servers."
      title="Data security"
    />
  </div>
)

export const DarkMode = () => (
  <div className="dark">
    <div className="max-w-3xl bg-secondary-900 p-6 text-secondary-100">
      <LegalSection
        description="The information we collect is used solely to:"
        items={[
          'Analyze blog content performance and reader engagement',
          'Improve website functionality and user experience',
          'Remember your theme and language preferences for future visits',
        ]}
        title="How we use your information"
      />
    </div>
  </div>
)
