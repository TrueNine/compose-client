/**
 * 实体类基类
 */
export interface BaseEntity {
  id?: string
}

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

export const PagedWrapper = {
  DEFAULT_MAX: {
    offset: 0,
    pageSize: 42
  } as PagedRequestParam
}

/**
 * ## PagedWrapper 的简写形式
 */
export const Pw = PagedWrapper
