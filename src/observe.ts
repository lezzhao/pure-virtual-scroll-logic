import type { ResizeObserverCallback } from './type'

export function createObserver(handler: ResizeObserverCallback) {
  const observer = new ResizeObserver((entries) => {
    if (Array.isArray(entries)) {
      const len = entries.length
      let i = 0
      for (const entry of entries) {
        let width, height
        if (entry.borderBoxSize) {
          const boxSize = entry.borderBoxSize[0]
          width = boxSize.inlineSize
          height = boxSize.blockSize
        }
        else {
          width = entry.contentRect.width
          height = entry.contentRect.height
        }
        i++
        handler({ height, width, el: entry.target as HTMLElement, isLast: i === len })
      }
    }
  })

  return {
    observe: observer.observe,
    unobserve: observer.unobserve,
    disconnect: observer.disconnect,
  }
}
