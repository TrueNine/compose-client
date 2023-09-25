/**
 * # 一条标准的 websocket 链接
 */
export type WebSocketUrl = `${'ws' | 'wss'}://${string}`

/**
 * # 一条标准的 http 链接
 */
export type HttpUrl = `${'http' | 'https'}://${string}`

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
 * 错误消息统一返回格式
 */
export interface ErrorMessage {
  msg?: string
  code: number
}

/**
 * 分页后数据统一返回
 */
export interface PagedResponseResult<D> {
  dataList?: D[]
  total: number
  size: number
  pageSize: number
  offset: number
}

/**
 * ## PagedResponseResult 的简写形式
 */
export type Pr<T> = PagedResponseResult<T>
