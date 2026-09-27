// Design-sync shim for mermaid: loads the pinned mermaid ESM build from jsDelivr on first
// use instead of inlining ~6 MB into the design bundle. Only MermaidRenderer needs it.
import { version } from 'mermaid/package.json'

type Mermaid = {
  initialize: (config: unknown) => void
  render: (id: string, code: string) => Promise<{ svg: string }>
}

const url = `https://cdn.jsdelivr.net/npm/mermaid@${version}/dist/mermaid.esm.min.mjs`
let config: unknown
let loading: Promise<Mermaid> | undefined
const load = () => {
  loading ??= import(/* @vite-ignore */ url).then(m => m.default as Mermaid)
  return loading
}

const mermaid = {
  initialize(next: unknown) {
    config = next
    void load().then(m => m.initialize(next))
  },
  async render(id: string, code: string) {
    const m = await load()
    if (config) m.initialize(config)
    return m.render(id, code)
  },
}

export default mermaid
