import dayjs from 'dayjs'
import {type ISO8601DateFormat, ISO8601Format, type Timestamp} from '@compose/api-types'

export type DayJSNewINewInstanceOptions = string | Timestamp | Date | dayjs.Dayjs

export class DayJs {
  static dateMillis(date: DayJSNewINewInstanceOptions, format: ISO8601DateFormat = ISO8601Format.date): Timestamp {
    return dayjs(date, format, true).valueOf()
  }

  static datetimeMillis(date: DayJSNewINewInstanceOptions, format: string = ISO8601Format.datetime): Timestamp {
    return Math.floor(Number(dayjs(date, format, true).valueOf()) / 1000)
  }

  static format(date: DayJSNewINewInstanceOptions, format: string = ISO8601Format.datetime): string {
    return dayjs(date).format(format)
  }

  static formatDatetime(date: DayJSNewINewInstanceOptions, f: string = ISO8601Format.datetime) {
    return this.format(date, f)
  }

  static formatDate(date: DayJSNewINewInstanceOptions, f: string = ISO8601Format.date): string {
    return this.format(date, f)
  }

  static formatTime(date: DayJSNewINewInstanceOptions, f: string = ISO8601Format.time): string {
    return this.format(date, f)
  }
}
