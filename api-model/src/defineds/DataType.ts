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
export interface PointModel {
  x?: number
  y?: number
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
  xReFlushToken: 'X-Re-Flush'
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
