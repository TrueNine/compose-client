import {describe, expect, it} from 'vitest'
import {findMediaTypeByFileName} from './MediaType'

describe('findMediaTypeByFileName', () => {
  it('should resolve common extensions', () => {
    expect(findMediaTypeByFileName('a.jpg')).toBe('image/jpeg')
    expect(findMediaTypeByFileName('a.png')).toBe('image/png')
    expect(findMediaTypeByFileName('a.json')).toBe('application/json')
    expect(findMediaTypeByFileName('a.pdf')).toBe('application/pdf')
    expect(findMediaTypeByFileName('a.mp4')).toBe('video/mp4')
  })

  it('should fallback to other for unknown extensions', () => {
    expect(findMediaTypeByFileName('a.unknown')).toBe('application/octet-stream')
    expect(findMediaTypeByFileName('noext')).toBe('application/octet-stream')
  })
})
