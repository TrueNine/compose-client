import {describe, expect, it} from 'vitest'
import {form, toFormPathData} from './Form'

describe('form utilities', () => {
  describe('toFormPathData', () => {
    it('should convert flat primitives to form items', () => {
      const result = toFormPathData({name: 'alice', age: 30, active: true})
      expect(result).toContainEqual({name: 'name', value: 'alice'})
      expect(result).toContainEqual({name: 'age', value: '30'})
      expect(result).toContainEqual({name: 'active', value: 'true'})
    })

    it('should skip null and empty values', () => {
      const result = toFormPathData({a: 'ok', b: null, c: void 0, d: ''})
      expect(result).toEqual([{name: 'a', value: 'ok'}])
    })

    it('should flatten nested objects', () => {
      const result = toFormPathData({user: {name: 'bob'}})
      expect(result).toContainEqual({name: 'user.name', value: 'bob'})
    })

    it('should handle arrays of primitives', () => {
      const result = toFormPathData({tags: ['a', 'b']})
      expect(result).toContainEqual({name: 'tags', value: 'a,b'})
    })

    it('should handle array of blobs', () => {
      const blob1 = new Blob(['1'])
      const blob2 = new Blob(['2'])
      const result = toFormPathData({files: [blob1, blob2]})
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('files[0]')
      expect(result[0].value).toBe(blob1)
      expect(result[1].name).toBe('files[1]')
      expect(result[1].value).toBe(blob2)
    })

    it('should handle array of objects', () => {
      const result = toFormPathData({items: [{id: 1}, {id: 2}]})
      expect(result).toContainEqual({name: 'items[0].id', value: '1'})
      expect(result).toContainEqual({name: 'items[1].id', value: '2'})
    })

    it('should handle single blob value', () => {
      const blob = new Blob(['x'])
      const result = toFormPathData({file: blob})
      expect(result).toEqual([{name: 'file', value: blob}])
    })
  })

  describe('form', () => {
    it('should return a FormData instance', () => {
      const f = form({name: 'test'})
      expect(f).toBeInstanceOf(FormData)
      expect(f.get('name')).toBe('test')
    })
  })
})
