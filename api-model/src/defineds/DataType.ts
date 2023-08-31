/**
 * # 基元类型
 */
export type BasicType = string | number | boolean

/**
 * # 数值或字符串
 */
export type StrOrNum = string | number

/**
 * # 元素可为 null
 */
export type Nullable<T = unknown> = T | null

/**
 * # InstanceType 的简写
 *
 * ```typescript
 * type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Inst<T extends abstract new (...args: any) => any> = InstanceType<T>

/**
 * 颜色值
 */
export type HexColor = `#${string}`

/**
 * # 可空，可选，不稳定
 */
export type NullablePartial<T = unknown> = T | Partial<T> | null | never | undefined | void

/**
 * 错误消息统一返回格式
 */
export interface ErrorMessage {
  msg?: string
  code: number
}

/**
 * 地址坐标数据类型
 */
export interface WGS84 {
  x?: number
  y?: number
}

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

/**
 * # 键值对
 */
export interface Pair<K, V> {
  k: K
  v: V
}

/**
 * # Kotlin 语言的 Pair 类型
 */
export interface KPair<K, V> {
  first: K
  second: V
}

/**
 * http 返回头
 */
export const Headers = {
  contentType: 'Content-Type',
  contentLength: 'Content-Length',
  userAgent: 'User-Agent',
  xDeviceId: 'X-Device-Id',
  authorization: 'Authorization',
  xReFlushToken: 'X-Refresh'
}

/**
 * http mediaType
 */
export const MediaTypes = {
  urlEncode: 'application/x-www-form-urlencoded',
  json: 'application/json'
}

/**
 * http Content-Type
 */
export const ContentTypes = {
  formType: {
    [Headers.contentType]: MediaTypes.urlEncode
  },
  jsonType: {
    [Headers.contentType]: MediaTypes.json
  }
}
/**
 * ## 表示一个可以为 异步的类型
 * @example string | Promise<string>
 */
export type Asyncable<T> = T | Promise<T>
