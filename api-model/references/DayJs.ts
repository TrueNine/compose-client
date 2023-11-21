import dayjs from 'dayjs'
import {ISO8601Format, type Timestamp} from '@compose/compose-types'

export class DayJs {
  static format(date: Timestamp, format: string = ISO8601Format.datetime): string {
    return dayjs(date).format(format)
  }

  static formatDatetime(date: Timestamp, f: string = ISO8601Format.datetime) {
    return this.format(date, f)
  }

  static formatDate(date: Timestamp, f: string = ISO8601Format.date): string {
    return this.format(date, f)
  }

  static formatTime(date: Timestamp, f: string = ISO8601Format.time): string {
    return this.format(date, f)
  }
}
