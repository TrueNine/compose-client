import {describe, expect, it} from 'vitest'
import {aDes, deepResolve, des, dlv, isNil, isNonNil, isNonNilString, mapRecord, nilCoalesce, withEmpty} from './Values'

describe('values utilities', () => {
  describe('isNil / isNonNil', () => {
    it('should treat null and undefined as nil', () => {
      expect(isNil(null)).toBe(true)
      expect(isNil(void 0)).toBe(true)
      expect(isNonNil(null)).toBe(false)
      expect(isNonNil(void 0)).toBe(false)
    })

    it('should treat empty string as nil', () => {
      expect(isNil('')).toBe(true)
      expect(isNil('  ')).toBe(true)
      expect(isNil('a')).toBe(false)
    })

    it('should treat empty array as nil', () => {
      expect(isNil([])).toBe(true)
      expect(isNil([1])).toBe(false)
    })

    it('should treat array with all nil elements as nil', () => {
      expect(isNil([null, void 0, ''])).toBe(true)
      expect(isNil([null, 1])).toBe(false)
    })

    it('should treat empty object as nil', () => {
      expect(isNil({})).toBe(true)
      expect(isNil({a: 1})).toBe(false)
    })
  })

  describe('withEmpty', () => {
    it('should return string as-is when non-empty', () => {
      expect(withEmpty('hello')).toBe('hello')
    })

    it('should return empty string for nil or empty input', () => {
      expect(withEmpty(void 0)).toBe('')
      expect(withEmpty('')).toBe('')
    })
  })

  describe('nilCoalesce', () => {
    it('should return value when non-nil', () => {
      expect(nilCoalesce('hello', 'default')).toBe('hello')
    })

    it('should return default when value is nil', () => {
      expect(nilCoalesce('', 'default')).toBe('default')
      expect(nilCoalesce(null as unknown as string, 'default')).toBe('default')
    })
  })

  describe('isNonNilString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonNilString('a')).toBe(true)
      expect(isNonNilString('  a  ')).toBe(true)
    })

    it('should return false for empty or whitespace-only strings', () => {
      expect(isNonNilString('')).toBe(false)
      expect(isNonNilString('   ')).toBe(false)
      expect(isNonNilString(void 0)).toBe(false)
    })
  })

  describe('mapRecord', () => {
    it('should transform record values', () => {
      expect(mapRecord({a: 1, b: 2}, v => v * 2)).toEqual({a: 2, b: 4})
    })

    it('should return empty object for empty record', () => {
      expect(mapRecord({}, v => v)).toEqual({})
    })
  })

  describe('dlv', () => {
    it('should resolve nested property by dot path', () => {
      expect(dlv({a: {b: {c: 42}}}, 'a.b.c', 0)).toBe(42)
    })

    it('should resolve nested property by array path', () => {
      expect(dlv({a: {b: {c: 42}}}, ['a', 'b', 'c'], 0)).toBe(42)
    })

    it('should return default when path does not exist', () => {
      expect(dlv({a: {}}, 'a.b.c', 'fallback')).toBe('fallback')
    })

    it('should return default for null intermediate value', () => {
      expect(dlv({a: null as unknown as Record<string, unknown>}, 'a.b', 'fallback')).toBe('fallback')
    })
  })

  describe('des / aDes', () => {
    it('des should shallow clone object', () => {
      const obj = {a: 1, b: {c: 2}}
      const clone = des(obj)
      expect(clone).toEqual(obj)
      expect(clone).not.toBe(obj)
      expect(clone.b).toBe(obj.b)
    })

    it('aDes should shallow clone array of objects', () => {
      const arr = [{a: 1}, {a: 2}]
      const clone = aDes(arr)
      expect(clone).toEqual(arr)
      expect(clone).not.toBe(arr)
      expect(clone[0]).not.toBe(arr[0])
    })
  })

  describe('deepResolve', () => {
    it('should return primitives as-is', () => {
      expect(deepResolve(42)).toBe(42)
      expect(deepResolve('x')).toBe('x')
    })

    it('should clone one level deep by default', () => {
      const obj = {a: 1, b: {c: 2}}
      const result = deepResolve(obj)
      expect(result).toEqual(obj)
      expect(result).not.toBe(obj)
      expect(result.b).not.toBe(obj.b)
      expect(result.b).toEqual(obj.b)
    })

    it('should recurse when maxDepth is true', () => {
      const obj = {a: 1, b: {c: 2, d: {e: 3}}}
      const result = deepResolve(obj, {maxDepth: true})
      expect(result).toEqual(obj)
      expect(result.b).not.toBe(obj.b)
      expect(result.b.d).not.toBe(obj.b.d)
    })

    it('should respect numeric maxDepth', () => {
      const obj = {a: 1, b: {c: 2, d: {e: 3}}}
      const result = deepResolve(obj, {maxDepth: 1})
      expect(result.b).not.toBe(obj.b)
      expect(result.b.d).toBe(obj.b.d)
    })

    it('should apply transform when filter matches', () => {
      const obj = {a: 1, b: 2}
      const result = deepResolve(obj, {transform: v => (typeof v === 'number' ? (v) * 2 : v)}, (_, key) => key === 'a')
      expect(result).toEqual({a: 2, b: 2})
    })
  })
})
