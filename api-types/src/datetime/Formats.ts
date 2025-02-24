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
 * # 将某个时间转换为时间戳的秒表现形式
 */
export type ISO8601SecondsFormat = `X`

/**
 * # 将某个时间转换为时间戳的毫秒表现形式
 */
export type ISO8601MillisFormat = `x`

/**
 * 用以表示自 1970 年起的 时间戳，通常由服务器返回
 * @deprecated 改用 小写的 `timestamp`
 */
export type Timestamp = number | string
export type timestamp = number | string

/**
 * 代表一个日期，通常由服务器返回
 * @deprecated 改用 小写的 `date`
 */
export type LocalDate = number | string
export type date = timestamp

/**
 * 代表一个时间，通常由服务器返回
 * @deprecated 改用 小写的 `time`
 */
export type LocalTime = number | string
export type time = timestamp

/**
 * 代表一个日期和时间，通常由服务器返回
 * @deprecated 改用 小写的 `datetime`
 */
export type LocalDateTime = number | string
export type datetime = timestamp

/**
 * 代表一个时间周期，能表示一天 24 小时以内的时间
 * @deprecated 改用 小写的 `duration`
 */
export type Duration = `PT${string}`
export type duration = `PT${string}`

/**
 * 代表一个时间段，能表示 年月日的时间周期
 * @deprecated 改用 小写的 `period`
 */
export type Period = `P${string}`
export type period = `P${string}`
