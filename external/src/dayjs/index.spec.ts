import {describe, expect, it} from 'vitest'
import {dateMillis, datetimeMillis, format, formatDate, formatDatetime, formatTime, getOffsetMillis, timeMillis} from './index'

describe('dayjs wrappers', () => {
  describe('dateMillis', () => {
    it('should return timestamp for date string', () => {
      const ts = dateMillis('2024-01-15')
      expect(typeof ts).toBe('number')
      expect(ts).toBeGreaterThan(0)
    })

    it('should use custom format', () => {
      const ts = dateMillis(new Date(2024, 0, 15), {format: 'YYYY-MM-DD'})
      expect(typeof ts).toBe('number')
      expect(ts).toBeGreaterThan(0)
    })
  })

  describe('datetimeMillis', () => {
    it('should return timestamp for datetime string', () => {
      const ts = datetimeMillis('2024-01-15 12:30:00')
      expect(typeof ts).toBe('number')
      expect(ts).toBeGreaterThan(0)
    })
  })

  describe('timeMillis', () => {
    it('should return number for time string', () => {
      const ts = timeMillis(new Date(1970, 0, 1, 12, 30, 0))
      expect(typeof ts).toBe('number')
      expect(Number.isNaN(ts)).toBe(false)
    })
  })

  describe('getOffsetMillis', () => {
    it('should return offset in milliseconds', () => {
      const offset = getOffsetMillis('Asia/Shanghai')
      expect(typeof offset).toBe('number')
    })

    it('should use default tz when omitted', () => {
      const offset = getOffsetMillis()
      expect(typeof offset).toBe('number')
    })
  })

  describe('format utilities', () => {
    it('formatDatetime should format datetime', () => {
      const s = formatDatetime('2024-01-15 12:30:00')
      expect(typeof s).toBe('string')
      expect(s.includes('2024')).toBe(true)
    })

    it('formatDate should format date', () => {
      const s = formatDate('2024-01-15')
      expect(typeof s).toBe('string')
    })

    it('formatTime should format time', () => {
      const s = formatTime(new Date(1970, 0, 1, 12, 30, 0))
      expect(typeof s).toBe('string')
    })

    it('format should respect custom format', () => {
      const s = format('2024-01-15 12:30:00', {format: 'YYYY-MM-DD'})
      expect(s).toBe('2024-01-15')
    })
  })
})
