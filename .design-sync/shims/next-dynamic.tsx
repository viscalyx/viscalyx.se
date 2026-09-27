// Design-sync shim for next/dynamic: React.lazy + Suspense with the `loading` fallback.
import { type ComponentType, lazy, type ReactNode, Suspense } from 'react'

type Loader<P> = () => Promise<ComponentType<P> | { default: ComponentType<P> }>

export default function dynamic<P extends object>(
  loader: Loader<P>,
  opts: { loading?: () => ReactNode; ssr?: boolean } = {},
) {
  const Lazy = lazy(async () => {
    const m = await loader()
    return 'default' in m ? m : { default: m }
  })
  const Fallback = opts.loading
  return function Dynamic(props: P) {
    return (
      <Suspense fallback={Fallback ? <Fallback /> : null}>
        <Lazy {...(props as P & JSX.IntrinsicAttributes)} />
      </Suspense>
    )
  }
}
