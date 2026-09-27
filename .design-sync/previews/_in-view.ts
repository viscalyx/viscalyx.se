// Preview-only helper: reports every observed element as fully in view, so framer-motion's
// whileInView / useInView sections reveal in static cards (captures only see the first viewport).
class InViewObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    const rect = target.getBoundingClientRect()
    const entry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: 0,
    } as IntersectionObserverEntry
    queueMicrotask(() =>
      this.callback([entry], this as unknown as IntersectionObserver),
    )
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

window.IntersectionObserver =
  InViewObserver as unknown as typeof IntersectionObserver
