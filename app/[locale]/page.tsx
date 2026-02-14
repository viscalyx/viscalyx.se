import About from '@/components/About'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import OpenSource from '@/components/OpenSource'
import ScrollToTop from '@/components/ScrollToTop'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <OpenSource />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
