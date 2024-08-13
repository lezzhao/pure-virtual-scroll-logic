import type { VirtualScrollOptions } from './type'

const defaultConfig = {
  bufferSize: 5,
  estimateHeight: 40,
  animationFrame: 0,
}

const isString = (val: unknown): val is string => typeof val === 'string'

export function throttle(fn: (...args: any[]) => void, time = 300) {
  let oldTime = Date.now()
  return function (...args: any[]) {
    const newTime = Date.now()
    if (newTime - oldTime >= time) {
      // eslint-disable-next-line no-useless-call
      fn.apply(null, [...args])
      oldTime = Date.now()
    }
  }
}

export function useVirtualScroll(options: VirtualScrollOptions) {
  const { itemHeight, amount, bufferSize, viewport, onCalculated } = options

  defaultConfig.bufferSize = bufferSize || defaultConfig.bufferSize

  const _viewport = isString(viewport) ? document.querySelector(viewport) : viewport
  const viewportHeight = _viewport?.clientHeight || 0

  const calculatePosition = (scrollTop: number) => {
    const start = findFirstNode(false, { scrollTop, itemHeight })

    const end = findLastNode(false, { start, itemHeight, viewportHeight, amount })
    console.log(start, end)
    onCalculated({ start, end, offset: start * itemHeight, realHeight: amount * itemHeight })
  }

  calculatePosition(0)

  const onScroll = (e: Event) => {
    if (defaultConfig.animationFrame) {
      cancelAnimationFrame(defaultConfig.animationFrame)
    }
    defaultConfig.animationFrame = requestAnimationFrame(() => {
      calculatePosition((e.target as HTMLElement).scrollTop)
    })
  }
  _viewport?.addEventListener('scroll', onScroll)
  const cleanup = () => _viewport?.removeEventListener('scroll', onScroll)

  return {
    cleanup,
  }
}

export function useScrollHelper(options: {
  el: HTMLElement
  list: any[]
  itemHeight: number
  calcFn: (data: any) => void
}) {
  const { el, list, itemHeight, calcFn } = options
  const positionInfo = {
    animationFrame: 0,
    viewportHeight: el?.clientHeight || 0,
    offsetY: 0,
    list: [] as any[],
    top: 0,
  }

  const calculateData = (scrollTop: number) => {
    const startIndex = findFirstNode(false, { scrollTop, itemHeight })
    const end = findLastNode(false, { start: startIndex, itemHeight, viewportHeight: positionInfo.viewportHeight, amount: list.length })
    positionInfo.list = list.slice(startIndex, end + 1)
    positionInfo.offsetY = startIndex * itemHeight
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
    realHeight: list.length * itemHeight,
    cleanup,
    positionInfo,
    offsetY: positionInfo.top,
  }
}

function findFirstNode(isDynamic: boolean, options: { amount?: number, nodes?: number[], scrollTop: number, itemHeight?: number }) {
  const { nodes = [], scrollTop, amount = 0, itemHeight = 10 } = options
  if (!isDynamic) {
    return Math.floor(scrollTop / itemHeight)
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

function findLastNode(isDynamic: boolean, options: { amount?: number, nodes?: number[], start: number, itemHeight?: number, viewportHeight: number }) {
  const { nodes = [], start, amount = 0, itemHeight = 10, viewportHeight } = options
  let end = start
  let curHeight = 0
  for (;end < amount; end++) {
    if (curHeight > viewportHeight)
      break
    const height = isDynamic ? nodes[end] : itemHeight
    curHeight += height
  }
  return end + 5
}
