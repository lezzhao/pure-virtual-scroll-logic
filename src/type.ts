interface CalculatedResult {
  start: number
  end: number
  offset: number
  realHeight: number
}

export interface VirtualScrollOptions {
  /**
   * The height of each item in the list.
   */
  itemHeight: number

  /**
   * The number of items to render above and below the visible area.
   */
  bufferSize?: number

  /**
   * The total number of items in the list.
   */
  amount: number

  /**
   * the element to render the items in
   */
  viewport: HTMLElement | string

  /**
   * the callback function when the scroll position changes
   */
  onCalculated: (params: CalculatedResult) => void
}
