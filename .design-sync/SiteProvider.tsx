'use client'

import { MotionGlobalConfig } from 'framer-motion'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/lib/theme-context'
import cookiesEn from '@/messages/cookies.en.json'
import cookiesSv from '@/messages/cookies.sv.json'
import en from '@/messages/en.json'
import privacyEn from '@/messages/privacy.en.json'
import privacySv from '@/messages/privacy.sv.json'
import sv from '@/messages/sv.json'
import termsEn from '@/messages/terms.en.json'
import termsSv from '@/messages/terms.sv.json'

// Mirrors i18n.ts: main messages plus the page namespaces cookies/privacy/terms.
const messages = {
  en: { ...en, cookies: cookiesEn, privacy: privacyEn, terms: termsEn },
  sv: { ...sv, cookies: cookiesSv, privacy: privacySv, terms: termsSv },
}

export interface SiteProviderProps {
  children?: ReactNode
  /** Site language. Default `en`. */
  locale?: 'en' | 'sv'
  /** Jump every framer-motion animation to its end state (static previews, screenshots). Default `false`. */
  skipAnimations?: boolean
}

/**
 * Root wrapper for every Viscalyx component: next-intl translations (the
 * site's own `messages/*.json`) plus the light/dark ThemeProvider. Components
 * that call `useTranslations` or `useTheme` throw without it.
 */
export function SiteProvider({
  locale = 'en',
  skipAnimations = false,
  children,
}: SiteProviderProps) {
  MotionGlobalConfig.skipAnimations = skipAnimations
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale]}
      timeZone="Europe/Stockholm"
    >
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  )
}
