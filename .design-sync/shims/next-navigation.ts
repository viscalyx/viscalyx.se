// Design-sync shim for next/navigation: inert router hooks for rendering outside the Next app router.
const noop = () => {}

export const usePathname = () => '/en'
export const useParams = () => ({ locale: 'en' })
export const useSearchParams = () => new URLSearchParams()
export const useSelectedLayoutSegment = () => null
export const useSelectedLayoutSegments = () => [] as string[]
export const useRouter = () => ({
  push: noop,
  replace: noop,
  back: noop,
  forward: noop,
  refresh: noop,
  prefetch: noop,
})
export function notFound(): never {
  throw new Error('notFound() is not available outside the Next app')
}
export function redirect(url: string): never {
  throw new Error(`redirect(${url}) is not available outside the Next app`)
}
