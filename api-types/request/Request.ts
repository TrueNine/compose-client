/**
 * 分页参数入参请求
 */
export interface PagedRequestParam {
  offset: number
  pageSize: number
}

/**
 * ## PagedRequestParam 的简写形式
 */
export type Pq = PagedRequestParam
