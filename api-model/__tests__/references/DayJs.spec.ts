import {test, describe, expect} from 'vitest'

import {DayJs} from '@/references'
import {ISO8601TimeZone} from '@/consts'

describe('dayjs testes', () => {
  test('diff timezone', () => {
    const dayjs = DayJs.dayjs

    const a = dayjs('1970-01-01 00:00:01', {utc: true}).valueOf()
    const b = dayjs('1970-01-01 00:00:01', {utc: false}).valueOf()
    const c = dayjs.tz('1970-01-01 00:00:01', ISO8601TimeZone.ASIA_SHANGHAI).valueOf()
    const d = dayjs.tz('1970-01-01 00:00:01', ISO8601TimeZone.UTC).valueOf()
    const e = dayjs('1970-01-01 00:00:01').tz(ISO8601TimeZone.UTC).utc(true).valueOf()
    const f = dayjs('1970-01-01 00:00:01').tz(ISO8601TimeZone.UTC).utc(false).valueOf()

    console.log({
      a,
      b,
      c,
      d,
      e,
      f
    })
  })

  test('test dayjs format date', () => {
    const timestamp = 1000
    const timeF = DayJs.formatTime(timestamp, {tz: ISO8601TimeZone.ASIA_SHANGHAI})
    expect(timeF).toBe('08:00:01')
    const timeT = DayJs.timeMillis(timeF, {utc: true})

    expect(timeT).toBe(timestamp)
    expect(DayJs.timeMillis(new Date(timestamp), {tz: ISO8601TimeZone.UTC}).valueOf()).toBe(timestamp)
    expect(new Date(timeT).getTime()).toBe(timestamp)

    expect(DayJs.timeMillis(timeF, {tz: ISO8601TimeZone.UTC})).toBe(28801000)

    const utcF = DayJs.formatTime(timestamp, {utc: true})
    expect(utcF).toBe('00:00:01')
    console.log(`utcF = ${utcF}`)

    const utcT = DayJs.timeMillis(utcF, {tz: ISO8601TimeZone.UTC})
    console.log(`utcT = ${utcT}`)
    expect(utcT).toBe(timestamp)
  })
})
