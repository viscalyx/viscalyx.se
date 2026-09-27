// Design-sync shim for next/link: a plain anchor (no Next router outside the app).
import { type AnchorHTMLAttributes, forwardRef, type ReactNode } from 'react'

type Href =
  | string
  | { pathname?: string; hash?: string; query?: Record<string, string> }

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  children?: ReactNode
  href: Href
  legacyBehavior?: boolean
  locale?: string | false
  passHref?: boolean
  prefetch?: boolean | null
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
}

const toHref = (href: Href) =>
  typeof href === 'string'
    ? href
    : `${href.pathname ?? ''}${href.hash ? `#${href.hash.replace(/^#/, '')}` : ''}`

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    prefetch: _p,
    replace: _r,
    scroll: _s,
    shallow: _sh,
    locale: _l,
    legacyBehavior: _lb,
    passHref: _ph,
    ...rest
  },
  ref,
) {
  return <a href={toHref(href)} ref={ref} {...rest} />
})

export default Link
