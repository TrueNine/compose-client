import dayjs from 'dayjs'
import type {late, rq, timestamp} from '@compose/api-types'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

import {ISO8601Format, ISO8601TimeZone} from '@/consts'
export type DayJSNewInstanceOptions = string | timestamp | Date | dayjs.Dayjs

interface Params {
  date?: DayJSNewInstanceOptions
  format?: string
  utc?: boolean
  tz?: string
}

export class DayJs {
  static DEFAULT_TZ: string
  static DEFAULT_UTC: boolean

  static {
    dayjs.extend(utc)
    dayjs.extend(tz)

    this.DEFAULT_TZ = dayjs.tz.guess()
    this.DEFAULT_UTC = this.DEFAULT_TZ === 'UTC'
  }

  private static getDefaultParam(date: DayJSNewInstanceOptions, p?: Params, format?: string): rq<Params> {
    return {
      date: p?.date || date,
      format: p?.format || format || ISO8601Format.datetime,
      utc: p?.utc || this.DEFAULT_UTC || false,
      tz: p?.tz || (p?.utc ? ISO8601TimeZone.UTC : undefined) || this.DEFAULT_TZ
    }
  }

  private static D = dayjs
  public static get dayjs() {
    return this.D
  }
  public static timestampOf(date: DayJSNewInstanceOptions, p?: Params) {
    const {date: _date, format, tz} = this.getDefaultParam(date, p, ISO8601Format.datetime)
    return this.dayjs.tz(_date, format, tz).valueOf()
  }
  static dateMillis(date: DayJSNewInstanceOptions, p?: Params): timestamp {
    const _p = this.getDefaultParam(date, p, ISO8601Format.date)
    return this.timestampOf(_p.date, _p)
  }
  static timeMillis(date: DayJSNewInstanceOptions, p?: Params): timestamp {
    const _p = this.getDefaultParam(date, p, ISO8601Format.time)
    if (typeof _p.date === 'string') {
      _p.format = `${ISO8601Format.date}$$$$${_p.format}`
      _p.date = `1970-01-01$$$$${_p.date}`
      return this.timestampOf(_p.date, _p)
    } else {
      const dg = this.timestampToTimeTimestamp(_p.date, _p)
      if (dg === undefined) return NaN
      else return dg
    }
  }
  static datetimeMillis(date: DayJSNewInstanceOptions, p?: Params): timestamp {
    const _p = this.getDefaultParam(date, p, ISO8601Format.datetime)
    return this.timestampOf(_p.date, _p)
  }
  static format(date: DayJSNewInstanceOptions, p?: Params): string {
    const {date: _date, format, utc, tz} = this.getDefaultParam(date, p, ISO8601Format.datetime)
    return this.dayjs(_date, {format, utc}, true).tz(tz).format(format)
  }
  static formatDatetime(date: DayJSNewInstanceOptions, p?: Params): string {
    const _p = this.getDefaultParam(date, p, ISO8601Format.datetime)
    return this.format(_p.date, _p)
  }
  static formatDate(date: DayJSNewInstanceOptions, p?: Params): string {
    const _p = this.getDefaultParam(date, p, ISO8601Format.date)
    return this.format(_p.date, _p)
  }
  static formatTime(date: DayJSNewInstanceOptions, p?: Params): string {
    const _p = this.getDefaultParam(date, p, ISO8601Format.time)
    return this.format(_p.date, _p)
  }

  /**
   * ## 将时间戳转换为 time 类型的时间戳
   * @param ts 时间戳
   * @param p 参数
   */
  private static timestampToTimeTimestamp(ts: timestamp | Date | dayjs.Dayjs, p?: Params): late<timestamp> {
    const _p = this.getDefaultParam(ts, p, ISO8601Format.datetime)
    let dj: dayjs.Dayjs
    if (typeof ts === 'number') {
      dj = this.dayjs(ts, {utc: _p.utc}, true).tz(_p.tz)
    } else if (ts instanceof Date) {
      dj = this.dayjs(ts, {utc: _p.utc}, true).tz(_p.tz)
    } else {
      dj = ts.tz(_p.tz)
    }
    const hMs = dj.hour() * 3600000
    const mMs = dj.minute() * 60000
    const sMs = dj.second() * 1000
    return hMs + mMs + sMs + dj.millisecond()
  }
}
