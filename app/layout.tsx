import { Inter } from 'next/font/google'
import './globals.css'
import { metadata } from './metadata'
import { ThemeProvider } from '../lib/theme-context'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export { metadata }

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
