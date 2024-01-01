import dayjs from 'dayjs'
import {ISO8601Format, type Timestamp} from '@compose/compose-types'

export type DayJSNewINewInstanceOptions = string | Timestamp | Date | dayjs.Dayjs

export class DayJs {
  static format(date: DayJSNewINewInstanceOptions | Date, format: string = ISO8601Format.datetime): string {
    return dayjs(date).format(format)
  }

  static formatDatetime(date: DayJSNewINewInstanceOptions | Date, f: string = ISO8601Format.datetime) {
    return this.format(date, f)
  }

  static formatDate(date: DayJSNewINewInstanceOptions | Date, f: string = ISO8601Format.date): string {
    return this.format(date, f)
  }

  static formatTime(date: DayJSNewINewInstanceOptions | Date, f: string = ISO8601Format.time): string {
    return this.format(date, f)
  }
}
