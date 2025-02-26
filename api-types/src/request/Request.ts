import type { i32 } from '@/typescripts'

/**
 * 分页参数入参请求
 */
export interface IPageRequestParam {
  /**
   * ## Page Size
   * > 分页大小
   */
  s?: i32
  /**
   * ## Offset
   * > 分页偏移量
   */
  o?: i32
  /**
   * ## UnPage
   * @deprecated 后端一般不会接受此参数
   */
  u?: boolean
}

/**
 * ## PagedRequestParam 的简写形式
 */
export type Pq = IPageRequestParam
