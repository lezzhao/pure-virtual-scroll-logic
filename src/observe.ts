export function createObserver(handler: (options: { index: number, height: number, width: number }) => void) {
  const observer = new ResizeObserver((entries) => {
    if (Array.isArray(entries)) {
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
        handler({ height, width, index: Number((entry.target as HTMLElement).dataset.index) })
      }
    }
  })

  return {
    observe: observer.observe,
    unobserve: observer.unobserve,
    disconnect: observer.disconnect,
  }
}
