import type { late, rq, timestamp } from '@truenine/types'
import type { Dayjs } from 'dayjs'
import type { DurationUnitType } from 'dayjs/plugin/duration'
import { ISO8601Format, ISO8601TimeZone } from '@truenine/shared'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import pluralGetSet from 'dayjs/plugin/pluralGetSet'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

// FIXME 当前文件所有文件需要进行去除副作用优化

export type DayJSNewInstanceOptions = timestamp | Date | dayjs.Dayjs

interface Params {
  date?: DayJSNewInstanceOptions
  format?: string
  utc?: boolean
  tz?: string
}

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(duration)
dayjs.extend(pluralGetSet)
dayjs.extend(isBetween)

export const DEFAULT_TZ: string = dayjs.tz.guess()
export const DEFAULT_UTC: boolean = DEFAULT_TZ === 'UTC'
export const DEFAULT_ZONE_OFFSET: number = dayjs().utcOffset() * 60 * 1000

export const DayJs: typeof dayjs = dayjs

function getDefaultParam(date: DayJSNewInstanceOptions, p?: Params, format?: string): rq<Params> {
  return {
    date: p?.date ?? date,
    format: p?.format ?? format ?? ISO8601Format.datetime,
    utc: (p?.utc ?? DEFAULT_UTC) || false,
    tz: p?.tz ?? (p?.utc ? ISO8601TimeZone.UTC : void 0) ?? DEFAULT_TZ,
  }
}

function timestampOf(date: DayJSNewInstanceOptions, p?: Params): number {
  const { date: _date, format, tz } = getDefaultParam(date, p, ISO8601Format.datetime)
  return DayJs.tz(_date, format, tz).valueOf()
}

export function dateMillis(date: DayJSNewInstanceOptions, p?: Params): timestamp {
  const _p = getDefaultParam(date, p, ISO8601Format.date)
  return timestampOf(_p.date, _p)
}

export function getOffsetMillis(timezone: string = DEFAULT_TZ): number {
  return DayJs.tz(timezone).utcOffset() * 60 * 1000
}

export function timeMillis(date: DayJSNewInstanceOptions, p?: Params): number {
  const _p = getDefaultParam(date, p, ISO8601Format.time)
  if (typeof _p.date === 'string') {
    _p.format = `${ISO8601Format.date}$$$$${_p.format}`
    _p.date = `1970-01-01$$$$${_p.date}`
    const offset = getOffsetMillis(_p.tz)
    return timestampOf(_p.date, _p) + Number(offset) * 2
  } else {
    _p.utc = true
    _p.tz = ISO8601TimeZone.UTC
    const dg = timestampToTimeTimestamp(_p.date, _p)
    if (dg === void 0) return Number.NaN
    else return dg
  }
}

export function datetimeMillis(date: DayJSNewInstanceOptions, p?: Params): number {
  const _p = getDefaultParam(date, p, ISO8601Format.datetime)
  return timestampOf(_p.date, _p)
}

export function format(date: DayJSNewInstanceOptions, p?: Params): string {
  const _p = getDefaultParam(date, p, ISO8601Format.datetime)
  return DayJs(_p.date, { format: _p.format, utc: _p.utc }, true).tz(_p.tz).format(_p.format)
}

export function formatDatetime(date: DayJSNewInstanceOptions, p?: Params): string {
  const _p = getDefaultParam(date, p, ISO8601Format.datetime)
  return format(_p.date, _p)
}

export function formatDate(date: DayJSNewInstanceOptions, p?: Params): string {
  const _p = getDefaultParam(date, p, ISO8601Format.date)
  return format(_p.date, _p)
}

export function formatTime(date: DayJSNewInstanceOptions, p?: Params): string {
  const _p = getDefaultParam(date, p, ISO8601Format.time)
  return format(_p.date, _p)
}

/**
 * ## 将时间戳转换为 time 类型的时间戳
 * @param ts 时间戳
 * @param p 参数
 */
function timestampToTimeTimestamp(ts: timestamp | Date | dayjs.Dayjs, p?: Params): late<number> {
  const _p = getDefaultParam(ts, p, ISO8601Format.datetime)
  let dj: dayjs.Dayjs
  if (typeof ts === 'number' || typeof ts === 'string') dj = DayJs(ts, { utc: _p.utc }, true).tz(_p.tz)
  else if (ts instanceof Date) dj = DayJs(ts, { utc: _p.utc }, true).tz(_p.tz)
  else dj = ts.tz(_p.tz)
  const hMs = dj.hour() * 3600000
  const mMs = dj.minute() * 60000
  const sMs = dj.second() * 1000
  return hMs + mMs + sMs + dj.millisecond()
}

export function isToday(to: DayJSNewInstanceOptions, qua = 1, unit: DurationUnitType = 'day'): boolean {
  const now = dayjs()
  const yesterday = DayJs(now).subtract(dayjs.duration(qua, unit)).startOf(unit)
  const toDate = dayjs(to).startOf(unit)
  return toDate.isSame(yesterday)
}

export function formatToday(to: Dayjs): string {
  const now = DayJs()
  if (isToday(to, 0)) return to.format('HH:mm')
  if (to.isBefore(now)) {
    if (isToday(to)) return `昨天 ${to.format('HH:mm')}`
    else if (isToday(to, 0, 'month')) return to.format('MM-DD')
    else if (isToday(to, 0, 'year')) return to.format('MM-DD')
    else if (to.year() >= 2000) return to.format('YY-MM-DD')
    else return to.format('YYYY-MM-DD')
  } else {
    return to.format('YYYY-MM-DD')
  }
}
