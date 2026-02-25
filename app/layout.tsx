import { Inter } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import { ThemeProvider } from '@/lib/theme-context'
import './code-block-components.css'
import './globals.css'
import { metadata } from './metadata'
import './prism-theme.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const themeInitScript = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      let shouldUseDark = false;

      if (savedTheme === 'dark') {
        shouldUseDark = true;
      } else if (savedTheme === 'light') {
        shouldUseDark = false;
      } else {
        shouldUseDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (shouldUseDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      document.documentElement.classList.remove('dark');
    }
  })();
`

export { metadata }

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  // Get the current locale using next-intl
  const locale = await getLocale()

  return (
    <html
      className={`scroll-smooth ${inter.className}`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <script id="theme-init-script">{themeInitScript}</script>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
