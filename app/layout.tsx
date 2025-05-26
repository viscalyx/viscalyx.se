import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Viscalyx - Automation & DevOps Consulting',
  description: 'Professional consulting services for task automation, DevOps solutions, and PowerShell DSC. Helping developers and IT professionals streamline their workflows.',
  keywords: 'automation, devops, powershell, dsc, consulting, it solutions, developer tools',
  authors: [{ name: 'Viscalyx' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Viscalyx - Automation & DevOps Consulting',
    description: 'Professional consulting services for task automation and DevOps solutions.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
