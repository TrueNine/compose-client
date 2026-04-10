import {describe, expect, it} from 'vitest'
import {AllJsApiList} from './JsApiList'

describe('JsApiList', () => {
  it('should contain all expected API names', () => {
    expect(AllJsApiList).toContain('updateAppMessageShareData')
    expect(AllJsApiList).toContain('getLocation')
    expect(AllJsApiList).toContain('scanQRCode')
    expect(AllJsApiList).toContain('closeWindow')
  })

  it('should not have duplicates', () => {
    expect(new Set(AllJsApiList).size).toBe(AllJsApiList.length)
  })

  it('should have correct length', () => {
    expect(AllJsApiList.length).toBe(36)
  })
})
