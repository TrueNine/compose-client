import type {i32} from '@/typescripts'

/**
 * 分页参数入参请求
 */
export interface IPageRequestParam {
  /**
   * ## Page Size
   */
  s?: i32
  /**
   * ## Offset
   */
  o?: i32
  /**
   * ## UnPage
   */
  u?: never
}

/**
 * ## PagedRequestParam 的简写形式
 */
export type Pq = IPageRequestParam
