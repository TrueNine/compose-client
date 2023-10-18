/**
 * # datetime格式
 */
export type ISO8601DatetimeFormat = `${string}-${string}-${string} ${string}:${string}:${string}`

/**
 * # date格式
 */
export type ISO8601DateFormat = `${string}-${string}-${string}`

/**
 * # time 格式
 */
export type ISO8601TimeFormat = `${string}:${string}:${string}`

/**
 * # 标准格式化字符串
 */
export const ISO8601Format = {
  date: 'yyyy-MM-dd',
  time: 'HH:mm:ss',
  datetime: 'yyyy-MM-dd HH:mm:ss'
}