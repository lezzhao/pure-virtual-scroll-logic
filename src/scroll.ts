import { findFirstNode, findLastNode, isString, throttle } from './helper'
import { createObserver } from './observe'
import type { UpdateEstimatedOptions, VirtualScrollOptions } from './type'

const defaultConfig = {
  bufferSize: 3,
  estimatedHeight: 40,
  animationFrame: 0,
}

export function useVirtualScroll(options: VirtualScrollOptions) {
  const { itemHeight, amount, bufferSize, viewport, onCalculated } = options
  // cache the estimated top value for each item
  const estimatedCache = Array.from({ length: amount }, (_, i) => itemHeight === 'dynamic' ? i * defaultConfig.estimatedHeight : i * itemHeight)
  const estimatedItemHeight = Array.from({ length: amount }, () => defaultConfig.estimatedHeight)
  // buffer zone
  const buffer = bufferSize || defaultConfig.bufferSize
  // get the height of the viewport
  const _viewport = isString(viewport) ? document.querySelector(viewport) : viewport
  const viewportHeight = _viewport?.clientHeight || 0

  // calculate the range of the items that need to be rendered
  const calculatePosition = (scrollTop: number) => {
    const start = findFirstNode({ scrollTop, itemHeight, nodes: estimatedCache })
    const end = findLastNode({ start, itemHeight, viewportHeight, nodes: estimatedCache })
    // console.log(start, end)
    onCalculated({ start: Math.max(start - buffer, 0), end: Math.min(end + buffer, amount), offset: estimatedCache[start], realHeight: estimatedCache[estimatedCache.length - 1] })
  }
  // scroll event lister
  const onScroll = throttle((e: Event) => {
    if (defaultConfig.animationFrame) {
      cancelAnimationFrame(defaultConfig.animationFrame)
    }
    defaultConfig.animationFrame = requestAnimationFrame(() => {
      calculatePosition((e.target as HTMLElement).scrollTop)
    })
  }, 15)
  // init virtual scroll
  const initVirtualScroll = () => {
    calculatePosition(_viewport?.scrollTop || 0)
    _viewport?.addEventListener('scroll', onScroll)
    const cleanup = () => _viewport?.removeEventListener('scroll', onScroll)

    return {
      cleanup,
    }
  }
  // update estimated cache
  const updateEstimatedCache = (options: UpdateEstimatedOptions) => {
    const { index, height, isLast } = options
    if (estimatedItemHeight[index] === height)
      return
    estimatedItemHeight[index] = height
    if (isLast) {
      for (let i = 0; i < estimatedCache.length; i++) {
        estimatedCache[i] = i === 0 ? 0 : estimatedItemHeight[i - 1] + estimatedCache[i - 1]
      }
      calculatePosition(_viewport?.scrollTop || 0)
    }
  }

  return {
    initVirtualScroll,
    updateEstimatedCache,
  }
}
