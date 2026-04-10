import {describe, expect, it} from 'vitest'
import {arrayDiff, arrayDistinct, cartesianProduct, combineToMap, maybeArray, maybeReadonlyArray, mergeToMap, range, sameValue} from './Array'

describe('array utilities', () => {
  describe('arrayDistinct', () => {
    it('should remove duplicate primitives', () => {
      expect(arrayDistinct([1, 2, 2, 3])).toEqual([1, 2, 3])
      expect(arrayDistinct(['a', 'a', 'b'])).toEqual(['a', 'b'])
    })

    it('should return empty array for empty input', () => {
      expect(arrayDistinct([])).toEqual([])
    })
  })

  describe('cartesianProduct', () => {
    it('should compute cartesian product of spec', () => {
      const result = cartesianProduct({color: ['red', 'blue'], size: ['s', 'm']})
      expect(result).toHaveLength(4)
      expect(result).toContainEqual({color: 'red', size: 's'})
      expect(result).toContainEqual({color: 'red', size: 'm'})
      expect(result).toContainEqual({color: 'blue', size: 's'})
      expect(result).toContainEqual({color: 'blue', size: 'm'})
    })

    it('should return empty array for empty spec', () => {
      expect(cartesianProduct({})).toEqual([])
    })
  })

  describe('arrayDiff', () => {
    it('should return elements present in only one array', () => {
      expect(arrayDiff([1, 2, 3], [2, 3, 4])).toEqual([1, 4])
    })

    it('should return empty array for identical arrays', () => {
      expect(arrayDiff([1, 2], [1, 2])).toEqual([])
    })
  })

  describe('combineToMap', () => {
    it('should group items by key and map values', () => {
      const arr = [
        {id: 1, name: 'a'},
        {id: 2, name: 'b'},
        {id: 1, name: 'c'}
      ]
      const map = combineToMap(arr, item => item.id, item => item.name)
      expect(map.get(1)).toEqual(['a', 'c'])
      expect(map.get(2)).toEqual(['b'])
    })
  })

  describe('maybeArray', () => {
    it('should wrap non-array value in array', () => {
      expect(maybeArray(1)).toEqual([1])
      expect(maybeArray('x')).toEqual(['x'])
    })

    it('should return array as-is', () => {
      expect(maybeArray([1, 2])).toEqual([1, 2])
    })
  })

  describe('maybeReadonlyArray', () => {
    it('should wrap non-array value in readonly array', () => {
      expect(maybeReadonlyArray(1)).toEqual([1])
    })

    it('should return array as-is', () => {
      expect(maybeReadonlyArray([1, 2])).toEqual([1, 2])
    })
  })

  describe('range', () => {
    it('should yield numbers from start to end inclusive', () => {
      expect([...range(1, 3)]).toEqual([1, 2, 3])
    })

    it('should yield single number when start equals end', () => {
      expect([...range(5, 5)]).toEqual([5])
    })
  })

  describe('mergeToMap', () => {
    it('should merge objects by key field', () => {
      const arr = [
        {group: 'A', value: 1},
        {group: 'B', value: 2},
        {group: 'A', value: 3}
      ]
      const result = mergeToMap('group', arr)
      expect(result.A).toEqual([{group: 'A', value: 1}, {group: 'A', value: 3}])
      expect(result.B).toEqual([{group: 'B', value: 2}])
    })

    it('should return empty object for empty array', () => {
      expect(mergeToMap('id', [])).toEqual({})
    })
  })

  describe('sameValue', () => {
    it('should return value when all elements are same', () => {
      expect(sameValue([5, 5, 5])).toBe(5)
    })

    it('should return undefined when elements differ', () => {
      expect(sameValue([1, 2, 3])).toBeUndefined()
    })

    it('should return undefined for empty array', () => {
      expect(sameValue([])).toBeUndefined()
    })

    it('should respect custom comparator', () => {
      expect(sameValue([{v: 1}, {v: 1}], (a, b) => a.v === b.v)).toEqual({v: 1})
    })
  })
})
