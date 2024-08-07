export function useScrollHelper(options: {
  el: HTMLElement
  list: any[]
  rowHeight: number
  calcFn: (data: any) => void
}) {
  const { el, list, rowHeight, calcFn } = options
  const positionInfo = {
    animationFrame: 0,
    viewportHeight: el?.clientHeight || 0,
    offsetY: 0,
    list: [] as any[],
    top: 0,
  }

  const calculateData = (scrollTop: number) => {
    const startIndex = findFirstNode(false, { scrollTop, rowHeight })
    const end = findLastNode(false, { start: startIndex, rowHeight, viewportHeight: positionInfo.viewportHeight, amount: list.length })
    positionInfo.list = list.slice(startIndex, end + 1)
    positionInfo.offsetY = startIndex * rowHeight
    calcFn(positionInfo)
  }

  const calculatePosition = (e: Event) => {
    if (positionInfo.animationFrame) {
      cancelAnimationFrame(positionInfo.animationFrame)
    }
    positionInfo.animationFrame = requestAnimationFrame(() => {
      positionInfo.top = (e.target as HTMLElement).scrollTop
      calculateData(positionInfo.top)
    })
  }

  el?.addEventListener('scroll', calculatePosition)
  const cleanup = () => el?.removeEventListener('scroll', calculatePosition)

  calculateData(0)

  return {
    realHeight: list.length * rowHeight,
    cleanup,
    positionInfo,
    offsetY: positionInfo.top,
  }
}

function findFirstNode(isDynamic: boolean, options: { amount?: number, nodes?: number[], scrollTop: number, rowHeight?: number }) {
  const { nodes = [], scrollTop, amount = 0, rowHeight = 10 } = options
  if (!isDynamic) {
    return Math.floor(scrollTop / rowHeight)
  }
  let left = 0
  let right = amount - 1
  let mid = Math.floor((right - left) / 2)
  while (right - left > 1) {
    if (
      scrollTop < nodes[mid]
    ) {
      right = mid
      mid = Math.floor((right - left) / 2)
    }
    else if (scrollTop > nodes[mid]) {
      left = mid
      mid = Math.floor((right - left) / 2)
    }
    else {
      return mid
    }
  }
  return left
}

function findLastNode(isDynamic: boolean, options: { amount?: number, nodes?: number[], start: number, rowHeight?: number, viewportHeight: number }) {
  const { nodes = [], start, amount = 0, rowHeight = 10, viewportHeight } = options
  let end = start
  let curHeight = 0
  for (;end < amount; end++) {
    if (curHeight > viewportHeight)
      break
    const height = isDynamic ? nodes[end] : rowHeight
    curHeight += height
  }
  return end + 5
}
