import dayjs, {Dayjs} from 'dayjs'
import type {late, rq, timestamp} from '@compose/api-types'
import utc from 'dayjs/plugin/utc'
import duration, {type DurationUnitType} from 'dayjs/plugin/duration'
import tz from 'dayjs/plugin/timezone'
import pluralGetSet from 'dayjs/plugin/pluralGetSet'
import isBetween from 'dayjs/plugin/isBetween'
import {ISO8601Format, ISO8601TimeZone} from '@compose/api-model'

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
  static DEFAULT_ZONE_OFFSET: number
  static {
    dayjs.extend(utc)
    dayjs.extend(tz)
    dayjs.extend(duration)
    dayjs.extend(pluralGetSet)
    dayjs.extend(isBetween)

    this.DEFAULT_TZ = dayjs.tz.guess()
    this.DEFAULT_UTC = this.DEFAULT_TZ === 'UTC'
    this.DEFAULT_ZONE_OFFSET = dayjs().utcOffset() * 60 * 1000
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

  public static get dayjs(): typeof dayjs {
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

  static getOffsetMillis(timezone: string = this.DEFAULT_TZ): timestamp {
    return this.dayjs().tz(timezone).utcOffset() * 60 * 1000
  }

  static timeMillis(date: DayJSNewInstanceOptions, p?: Params): timestamp {
    const _p = this.getDefaultParam(date, p, ISO8601Format.time)
    if (typeof _p.date === 'string') {
      _p.format = `${ISO8601Format.date}$$$$${_p.format}`
      _p.date = `1970-01-01$$$$${_p.date}`
      const offset = this.getOffsetMillis(_p.tz)
      return this.timestampOf(_p.date, _p) + offset * 2
    } else {
      _p.utc = true
      _p.tz = ISO8601TimeZone.UTC
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
    const _p = this.getDefaultParam(date, p, ISO8601Format.datetime)
    return this.dayjs(_p.date, {format: _p.format, utc: _p.utc}, true).tz(_p.tz).format(_p.format)
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

  static isToday(to: DayJSNewInstanceOptions, qua = 1, unit: DurationUnitType = 'day') {
    const now = dayjs()
    const yesterday = dayjs(now).subtract(dayjs.duration(qua, unit)).startOf(unit)
    const toDate = dayjs(to).startOf(unit)
    return toDate.isSame(yesterday)
  }

  static formatToday(to: Dayjs) {
    const now = dayjs()
    if (this.isToday(to, 0)) return to.format('HH:mm')
    if (to.isBefore(now)) {
      if (this.isToday(to)) return '昨天 ' + to.format('HH:mm')
      else if (this.isToday(to, 0, 'month')) return to.format('MM-DD')
      else if (this.isToday(to, 0, 'year')) return to.format('MM-DD')
      else if (to.year() >= 2000) return to.format('YY-MM-DD')
      else return to.format('YYYY-MM-DD')
    } else return to.format('YYYY-MM-DD')
  }
}
