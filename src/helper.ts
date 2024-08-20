import type { FindCommonOptions, FindLastNodeOptions } from './type'

export const isString = (val: unknown): val is string => typeof val === 'string'

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

export function findFirstNode(options: FindCommonOptions) {
  const { nodes = [], scrollTop, itemHeight } = options
  if (itemHeight !== 'dynamic') {
    return Math.floor(scrollTop / itemHeight)
  }
  const amount = nodes.length
  let left = 0
  let right = amount - 1
  let mid = Math.floor((right + left) / 2)
  while (right - left > 1) {
    if (
      scrollTop < nodes[mid]
    ) {
      right = mid
      mid = Math.floor((right + left) / 2)
    }
    else if (scrollTop > nodes[mid]) {
      left = mid
      mid = Math.floor((right + left) / 2)
    }
    else {
      return mid
    }
  }
  return left
}

export function findLastNode(options: FindLastNodeOptions) {
  const { nodes, start, viewportHeight, itemHeight } = options
  const amount = nodes.length
  let end = start
  let curHeight = 0
  for (;end < amount;) {
    if (curHeight > viewportHeight)
      break
    end++
    const height = itemHeight === 'dynamic' ? nodes[end] - nodes[end - 1] : itemHeight
    curHeight += height
  }
  return end
}
