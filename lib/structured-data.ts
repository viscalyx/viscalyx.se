import type {
  BlogPosting,
  BreadcrumbList,
  Organization,
  WebSite,
  WithContext,
} from 'schema-dts'
import { SITE_URL } from '@/lib/constants'

/**
 * Generate JSON-LD structured data for the Organization.
 * Used on the root layout to provide Google with business metadata.
 */
export function getOrganizationJsonLd(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Viscalyx',
    url: SITE_URL,
    logo: `${SITE_URL}/viscalyx_logo_128x128.png`,
    description:
      'Expert automation consulting specializing in PowerShell DSC, DevOps, and infrastructure automation.',
    sameAs: ['https://github.com/viscalyx'],
  }
}

/**
 * Generate JSON-LD structured data for the WebSite.
 * Helps search engines understand the site structure.
 */
export function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Viscalyx',
    url: SITE_URL,
    inLanguage: ['en', 'sv'],
  }
}

/** Input for generating BlogPosting JSON-LD. */
export interface BlogPostingJsonLdInput {
  author: string
  date: string | null
  excerpt: string
  image: string
  imageAlt?: string
  locale: string
  slug: string
  title: string
}

/**
 * Generate JSON-LD structured data for a single blog post.
 * Used on individual blog post pages for rich search snippets.
 */
export function getBlogPostingJsonLd(
  post: BlogPostingJsonLdInput,
): WithContext<BlogPosting> {
  // Ensure image URL is absolute
  const imageUrl = post.image.startsWith('http')
    ? post.image
    : `${SITE_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.imageAlt
      ? { '@type': 'ImageObject', url: imageUrl, alternateName: post.imageAlt }
      : imageUrl,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Viscalyx',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/viscalyx_logo_128x128.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${post.locale}/blog/${post.slug}`,
    },
    inLanguage: post.locale === 'sv' ? 'sv-SE' : 'en-US',
    ...(post.date ? { datePublished: post.date } : {}),
  }

  return jsonLd
}

/** A single breadcrumb item. */
export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Generate JSON-LD structured data for breadcrumb navigation.
 * Used on blog pages to help search engines understand site hierarchy.
 */
export function getBreadcrumbListJsonLd(
  items: BreadcrumbItem[],
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
