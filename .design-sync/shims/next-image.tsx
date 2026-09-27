// Design-sync shim for next/image: a plain <img> with next/image's layout props mapped.
// Root-relative srcs are the site's public/ assets - load them from the production site.
// Loads eagerly unless told otherwise: lazy offscreen images never load in static captures.
import { type CSSProperties, forwardRef, type ImgHTMLAttributes } from 'react'

const SITE_ORIGIN = 'https://viscalyx.org'
const resolveSrc = (url: string) =>
  url.startsWith('/') && !url.startsWith('//') ? `${SITE_ORIGIN}${url}` : url

type Src = string | { src: string; width?: number; height?: number }

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'placeholder'> {
  alt: string
  blurDataURL?: string
  fill?: boolean
  loader?: unknown
  onLoadingComplete?: unknown
  placeholder?: string
  priority?: boolean
  quality?: number | string
  src: Src
  unoptimized?: boolean
}

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    alt,
    fill,
    priority: _pr,
    quality: _q,
    placeholder: _ph,
    blurDataURL: _b,
    unoptimized: _u,
    loader: _l,
    onLoadingComplete: _o,
    style,
    ...rest
  },
  ref,
) {
  const url = resolveSrc(typeof src === 'string' ? src : src.src)
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    : undefined
  return (
    // biome-ignore lint/performance/noImgElement: this shim stands in for next/image outside Next.js
    <img
      alt={alt}
      loading={rest.loading ?? 'eager'}
      ref={ref}
      src={url}
      style={{ ...fillStyle, ...style }}
      {...rest}
    />
  )
})

export default Image
