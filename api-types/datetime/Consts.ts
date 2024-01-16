import type {ISO8601DateFormat, ISO8601MillisFormat, ISO8601SecondsFormat, ISO8601TimeFormat} from './Formats'

/**
 * # 标准格式化字符串
 */
export const ISO8601Format = {
  date: 'YYYY-MM-DD' as ISO8601DateFormat,
  time: 'HH:mm:ss' as ISO8601TimeFormat,
  datetime: 'YYYY-MM-DD HH:mm:ss' as ISO8601DateFormat,
  millis: 'x' as ISO8601MillisFormat,
  second: 'X' as ISO8601SecondsFormat
}
