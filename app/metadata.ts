export const metadata = {
  title: {
    default: 'Viscalyx - Automation Consulting for Developers & IT Professionals',
    template: '%s | Viscalyx'
  },
  description: 'Expert automation consulting specializing in PowerShell DSC, DevOps, and infrastructure automation. Transform your workflows with our proven solutions.',
  keywords: ['automation', 'PowerShell DSC', 'DevOps', 'infrastructure', 'consulting', 'IT automation'],
  authors: [{ name: 'Viscalyx' }],
  creator: 'Viscalyx',
  publisher: 'Viscalyx',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://viscalyx.se'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viscalyx.se',
    title: 'Viscalyx - Automation Consulting for Developers & IT Professionals',
    description: 'Expert automation consulting specializing in PowerShell DSC, DevOps, and infrastructure automation. Transform your workflows with our proven solutions.',
    siteName: 'Viscalyx',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=630&fit=crop&crop=center',
        width: 1200,
        height: 630,
        alt: 'Viscalyx - Automation Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viscalyx - Automation Consulting for Developers & IT Professionals',
    description: 'Expert automation consulting specializing in PowerShell DSC, DevOps, and infrastructure automation. Transform your workflows with our proven solutions.',
    images: ['https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=630&fit=crop&crop=center'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0066cc' },
    ],
  },
  manifest: '/manifest.json',
}
