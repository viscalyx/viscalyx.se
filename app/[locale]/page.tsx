import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import About from '@/components/About'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import OpenSource from '@/components/OpenSource'
import ScrollToTop from '@/components/ScrollToTop'
import { SITE_URL } from '@/lib/constants'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })

  const title = `${t('title')} ${t('titleHighlight')} ${t('titleEnd')}`
  const description = t('description')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      url: SITE_URL,
      siteName: 'Viscalyx',
      images: [
        {
          url: `${SITE_URL}/og-home-${locale}.png`,
          width: 1200,
          height: 630,
          alt: t('og.imageAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        sv: `${SITE_URL}/sv`,
      },
    },
  }
}

export default async function Home() {
  return (
    <main className="min-h-screen animate-fade-in">
      <Header />
      <Hero />
      <About />
      <OpenSource />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
