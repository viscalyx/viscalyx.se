import { Inter } from 'next/font/google'
import './globals.css'
import './prism-theme.css'
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
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
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
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
