import { Inter } from 'next/font/google'
import { ThemeProvider } from '../lib/theme-context'
import './code-block-components.css'
import './globals.css'
import { metadata } from './metadata'
import './prism-theme.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export { metadata }

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  return (
    <html
      lang={locale}
      className={`scroll-smooth ${inter.className}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check localStorage for saved theme
                  const savedTheme = localStorage.getItem('theme');

                  // Determine the theme to apply
                  let shouldUseDark = false;

                  if (savedTheme === 'dark') {
                    shouldUseDark = true;
                  } else if (savedTheme === 'light') {
                    shouldUseDark = false;
                  } else {
                    // Default to 'system' - check user's OS preference
                    shouldUseDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }

                  // Apply the theme immediately to prevent FOUC
                  if (shouldUseDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback to light theme if there's any error
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
