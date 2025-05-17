/**
 * # 一条标准的 websocket 链接
 */
export type WebSocketUrl = `${'ws' | 'wss'}://${string}`

/**
 * # 一条标准的 http 链接
 */
export type HttpUrl = `${'http' | 'https' | string}://${string}`
