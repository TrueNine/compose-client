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
 * 用以表示自 1970年起的时间戳，通常由服务器返回
 */
export type Timestamp = number
