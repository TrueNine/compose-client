import dayjs from 'dayjs'
import type {ISO8601DateFormat, timestamp} from '@compose/api-types'
import {ISO8601Format, SECOND_MILLIS} from '../consts/Datetime'
export type DayJSNewINewInstanceOptions = string | timestamp | Date | dayjs.Dayjs

export class DayJs {
  static dateMillis(date: DayJSNewINewInstanceOptions, format: ISO8601DateFormat = ISO8601Format.date): timestamp {
    return dayjs(date, format, true).valueOf()
  }

  static datetimeMillis(date: DayJSNewINewInstanceOptions, format: string = ISO8601Format.datetime): timestamp {
    return Math.floor(Number(dayjs(date, format, true).valueOf()) / SECOND_MILLIS)
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
