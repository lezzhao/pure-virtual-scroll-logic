import { describe, expect, it } from 'vitest'
import { sum } from '../src'

const list = [
  {
    id: '1',
    name: 'Frontend Developer 1',
  },
  {
    id: '2',
    name: 'Frontend Developer 2',
  },
  {
    id: '3',
    name: 'Frontend Developer 3',
  },
  {
    id: '4',
    name: 'Frontend Developer 4',
  },
  {
    id: '5',
    name: 'Frontend Developer 5',
  },
]

describe('test', () => {
  it('sum should return 2', () => {
    expect(sum(1, 1)).toBe(2)
  })

  it('sum should return 4', () => {
    expect(sum(2, 2)).toBe(4)
  })
})
