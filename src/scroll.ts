import { findFirstNode, findLastNode, isString, throttle } from './helper'
import { createObserver } from './observe'
import type { UpdateEstimatedOptions, VirtualScrollOptions } from './type'

// default config
const defaultConfig = {
  bufferSize: 3,
  estimatedHeight: 40,
  animationFrame: 0,
}

export function useVirtualScroll(options: VirtualScrollOptions) {
  const observedMap = new Map()
  let observer: ResizeObserver | null = null

  const { itemHeight, amount, bufferSize, viewport, onCalculated, estimatedHeight } = options
  const _estimatedHeight = estimatedHeight || defaultConfig.estimatedHeight
  // cache the estimated top value for each item
  const estimatedCache = Array.from({ length: amount }, (_, i) => itemHeight === 'dynamic' ? i * _estimatedHeight : i * itemHeight)
  const estimatedItemHeight = Array.from({ length: amount }, () => _estimatedHeight)
  // buffer zone
  const buffer = bufferSize || defaultConfig.bufferSize
  // get the height of the viewport
  const _viewport = isString(viewport) ? document.querySelector(viewport) : viewport
  const viewportHeight = _viewport?.clientHeight || 0

  // calculate the range of the items that need to be rendered
  const calculatePosition = (scrollTop: number) => {
    const start = findFirstNode({ scrollTop, itemHeight, nodes: estimatedCache })
    const end = findLastNode({ start, itemHeight, viewportHeight, nodes: estimatedCache })
    const rangeStart = Math.max(start - buffer, 0)
    const rangeEnd = Math.min(end + buffer, amount)
    onCalculated({ start: rangeStart, end: rangeEnd, offset: estimatedCache[start], realHeight: estimatedCache[estimatedCache.length - 1] })
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
  // update estimated cache
  const updateEstimatedCache = (options: UpdateEstimatedOptions) => {
    const { index, height, isLast } = options
    if (estimatedItemHeight[index] === height || height === 0)
      return

    estimatedItemHeight[index] = height
    if (isLast) {
      for (let i = 0; i < estimatedItemHeight.length; i++) {
        estimatedCache[i] = i === 0 ? 0 : estimatedItemHeight[i - 1] + estimatedCache[i - 1]
      }
      calculatePosition(_viewport?.scrollTop || 0)
    }
  }
  // init virtual scroll
  const initVirtualScroll = () => {
    calculatePosition(_viewport?.scrollTop || 0)
    _viewport?.addEventListener('scroll', onScroll)
    if (itemHeight === 'dynamic') {
      observer = createObserver((info) => {
        updateEstimatedCache({
          index: Number(info.el.dataset.index),
          height: info.height,
          isLast: info.isLast,
          width: info.width,
        })
      })
    }
  }

  const observe = (el: HTMLElement) => {
    const index = el.dataset.index
    if (observedMap.has(index))
      return
    observer?.observe(el)
    observedMap.set(index, el)
  }

  const cleanup = () => {
    observer!.disconnect()
    _viewport?.removeEventListener('scroll', onScroll)
  }

  initVirtualScroll()

  return {
    observe,
    cleanup,
  }
}
