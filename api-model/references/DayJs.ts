import dayjs from 'dayjs'
import {ISO8601Format, type Timestamp} from '@compose/compose-types'

export function format(date: Timestamp, format: string = ISO8601Format.datetime): string {
  return dayjs(date).format(format)
}

export function formatDatetime(date: Timestamp, f: string = ISO8601Format.date) {
  return format(date, f)
}

export function formatDate(date: Timestamp, f: string = ISO8601Format.date): string {
  return format(date, f)
}

export function formatTime(date: Timestamp, f: string = ISO8601Format.time): string {
  return format(date, f)
}
