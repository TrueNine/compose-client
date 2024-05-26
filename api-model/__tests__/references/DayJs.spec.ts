import {test, describe, expect} from 'vitest'
import dayjs from 'dayjs'

import {DayJs} from '@/references'
import {ISO8601TimeZone} from '@/consts'

describe('dayjs testes', () => {
  test('diff timezone', () => {
    const dayjs = DayJs.dayjs

    const a = dayjs('1970-01-01 00:00:01', {utc: true}).valueOf()
    const b = dayjs('1970-01-01 00:00:01', {utc: false}).valueOf()
    const c = dayjs.tz('1970-01-01 00:00:01', ISO8601TimeZone.ASIA_SHANGHAI).valueOf()
    const d = dayjs.tz('1970-01-01 00:00:01', ISO8601TimeZone.UTC).valueOf()
    const e = dayjs.utc('1970-01-01 00:00:01').valueOf()
    const f = dayjs.utc('1970-01-01 00:00:01').valueOf()

    console.log({
      a,
      b,
      c,
      d,
      e,
      f
    })
  })

  test('change offset name', () => {
    const defaultOffset = DayJs.dayjs().tz().utcOffset()
    console.log(defaultOffset)
    const utfOffset = DayJs.dayjs().tz(ISO8601TimeZone.UTC).utcOffset()
    console.log(utfOffset)
  })

  test('test dayjs format time', () => {
    const timestamp = 1000

    // 格式化支持不同时区
    const asiaShanghaiTimeFormat = DayJs.formatTime(timestamp, {tz: ISO8601TimeZone.ASIA_SHANGHAI})
    expect(asiaShanghaiTimeFormat).toBe('08:00:01')
    const utcTimeFormat = DayJs.formatTime(timestamp, {tz: ISO8601TimeZone.UTC})
    expect(utcTimeFormat).toBe('00:00:01')
    {
      // 字符串格式化 time，应忽略时区影响
      const ast = DayJs.timeMillis(asiaShanghaiTimeFormat, {format: ISO8601TimeZone.UTC})
      console.log(DayJs.formatDatetime(ast, {utc: true}))
      expect(ast).toBe(28801000)
      const utct = DayJs.timeMillis(utcTimeFormat, {format: ISO8601TimeZone.UTC})
      expect(utct).toBe(1000)
    }
    {
      // 时间戳格式化 time，应忽略时区影响
      const at = DayJs.timeMillis(1000)
      expect(at).toBe(1000)
      // 即使是跨天，也是1000
      const tomorrow = DayJs.timeMillis(86_401_000)
      expect(tomorrow).toBe(1000)
    }
    {
      // 格式化 Date 对象遵顼一样的原则
      const at = DayJs.timeMillis(new Date(1000))
      expect(at).toBe(1000)
      // 即使是跨天，也是1000
      const tomorrow = DayJs.timeMillis(86_401_000)
      expect(tomorrow).toBe(1000)
    }
    {
      // 格式化 dayjs 本身 对象遵顼一样的原则
      const at = DayJs.timeMillis(dayjs(1000))
      expect(at).toBe(1000)
      // 即使是跨天，也是1000
      const tomorrow = DayJs.timeMillis(86_401_000)
      expect(tomorrow).toBe(1000)
    }
  })
})
