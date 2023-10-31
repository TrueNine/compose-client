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
