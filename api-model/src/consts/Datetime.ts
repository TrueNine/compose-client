export const ISO8601TimeZone = {
  ASIA_SHANGHAI: 'Asia/Shanghai' as const,
  UTC: 'UTC' as const
}

/**
 * # 标准格式化字符串
 */
export const ISO8601Format = {
  date: 'YYYY-MM-DD' as const,
  time: 'HH:mm:ss' as const,
  datetime: 'YYYY-MM-DD HH:mm:ss' as const,
  millis: 'x' as const,
  second: 'X' as const
}

/**
 * ## 一秒的毫秒数
 */
export const SECOND_MILLIS = 1000

/**
 * ## 一分钟的毫秒数
 */
export const MINUTE_MILLIS = 60 * SECOND_MILLIS

/**
 * ## 一小时的毫秒数
 */
export const HOUR_MILLIS = 60 * MINUTE_MILLIS

/**
 * ## 一天的毫秒数
 */
export const DAY_MILLIS = 24 * HOUR_MILLIS
/**
 * ## 一周的毫秒数
 */
export const WEEK_MILLIS = 7 * DAY_MILLIS
