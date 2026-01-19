import type {i32} from '@/typescripts'

/**
 * 分页参数入参请求
 */
export interface IPageRequestParam {
  s?: i32
  o?: i32
  u?: boolean
}

/**
 * ## PagedRequestParam 的简写形式
 */
export type Pq = IPageRequestParam
