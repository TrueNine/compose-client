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
 * 用以表示自 1970 年起的 时间戳，通常由服务器返回
 */
export type Timestamp = number

/**
 * 代表一个日期，通常由服务器返回
 */
export type LocalDate = Timestamp

/**
 * 代表一个时间，通常由服务器返回
 */
export type LocalTime = Timestamp

/**
 * 代表一个日期和时间，通常由服务器返回
 */
export type LocalDateTime = Timestamp

/**
 * 代表一个时间周期，能表示一天 24 小时以内的时间
 */
export type Duration = `PT${string}`

/**
 * 代表一个时间段，能表示 年月日的时间周期
 */
export type Period = `P${string}`
