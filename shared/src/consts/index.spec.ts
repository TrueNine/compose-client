import {describe, expect, it} from 'vitest'
import {DAY_MILLIS, HOUR_MILLIS, ISO8601Format, ISO8601TimeZone, MINUTE_MILLIS, PagedWrapper, Pw, Regexes, SECOND_MILLIS, STR_DOT, STR_EMPTY, STR_SLASH, STRS_ASCII, WEEK_MILLIS} from './index'

describe('consts exports', () => {
  describe('datetime', () => {
    it('should export timezone constants', () => {
      expect(ISO8601TimeZone.ASIA_SHANGHAI).toBe('Asia/Shanghai')
      expect(ISO8601TimeZone.UTC).toBe('UTC')
    })

    it('should export format constants', () => {
      expect(ISO8601Format.date).toBe('YYYY-MM-DD')
      expect(ISO8601Format.time).toBe('HH:mm:ss')
      expect(ISO8601Format.datetime).toBe('YYYY-MM-DD HH:mm:ss')
    })

    it('should have correct millis constants', () => {
      expect(SECOND_MILLIS).toBe(1000)
      expect(MINUTE_MILLIS).toBe(60_000)
      expect(HOUR_MILLIS).toBe(3_600_000)
      expect(DAY_MILLIS).toBe(86_400_000)
      expect(WEEK_MILLIS).toBe(604_800_000)
    })
  })

  describe('pageable', () => {
    it('should export PagedWrapper with defaults', () => {
      expect(PagedWrapper.DEFAULT_MAX).toEqual({o: 0, s: 42})
      expect(PagedWrapper.empty()).toEqual({o: 0, p: 0, t: 0, d: []})
    })

    it('should have Pw alias identical to PagedWrapper', () => {
      expect(Pw).toBe(PagedWrapper)
    })
  })

  describe('regexes', () => {
    it('cHINA_ID_CARD should match valid ID numbers', () => {
      expect(Regexes.CHINA_ID_CARD.test('110101199001011234')).toBe(true)
      expect(Regexes.CHINA_ID_CARD.test('11010119900101123X')).toBe(true)
      expect(Regexes.CHINA_ID_CARD.test('invalid')).toBe(false)
    })

    it('cHINA_PHONE should match valid phone numbers', () => {
      expect(Regexes.CHINA_PHONE.test('13800138000')).toBe(true)
      expect(Regexes.CHINA_PHONE.test('12345678901')).toBe(false)
    })

    it('cHINA_EMAIL should match valid emails', () => {
      expect(Regexes.CHINA_EMAIL.test('user@example.com')).toBe(true)
      expect(Regexes.CHINA_EMAIL.test('bad-email')).toBe(false)
    })
  })

  describe('strings', () => {
    it('should export string constants', () => {
      expect(STR_EMPTY).toBe('')
      expect(STR_DOT).toBe('.')
      expect(STR_SLASH).toBe('/')
    })

    it('should export ASCII characters array', () => {
      expect(STRS_ASCII).toHaveLength(62)
      expect(STRS_ASCII[0]).toBe('0')
      expect(STRS_ASCII[10]).toBe('a')
      expect(STRS_ASCII[36]).toBe('A')
    })
  })
})
