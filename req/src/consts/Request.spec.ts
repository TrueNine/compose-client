import {describe, expect, it} from 'vitest'
import {ContentTypes, Headers, MediaTypes} from './Request'

describe('request constants', () => {
  describe('mediaTypes', () => {
    it('should contain common mime types', () => {
      expect(MediaTypes.json).toBe('application/json')
      expect(MediaTypes.html).toBe('text/html')
      expect(MediaTypes.png).toBe('image/png')
      expect(MediaTypes.pdf).toBe('application/pdf')
    })

    it('should have fallback other type', () => {
      expect(MediaTypes.other).toBe('application/octet-stream')
    })
  })

  describe('headers', () => {
    it('should define standard header names', () => {
      expect(Headers.contentType).toBe('Content-Type')
      expect(Headers.authorization).toBe('Authorization')
      expect(Headers.xRefreshToken).toBe('X-Refresh')
    })
  })

  describe('contentTypes', () => {
    it('should map form type to url encoded', () => {
      expect(ContentTypes.formType).toEqual({'Content-Type': MediaTypes.urlEncode})
    })

    it('should map json type to application json', () => {
      expect(ContentTypes.jsonType).toEqual({'Content-Type': MediaTypes.json})
    })
  })
})
