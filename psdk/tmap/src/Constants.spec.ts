import {describe, expect, it} from 'vitest'
import {BasicMapZoomType, WEBGL_JS_URL} from './Constants'

describe('TMap Constants', () => {
  it('should define WEBGL_JS_URL', () => {
    expect(WEBGL_JS_URL).toBe('https://map.qq.com/api/gljs')
  })

  it('should have BasicMapZoomType enum values', () => {
    expect(BasicMapZoomType.DEFAULT).toBe(0)
    expect(BasicMapZoomType.CENTER).toBe(1)
  })
})
