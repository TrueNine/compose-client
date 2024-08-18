import type {PageableEntity, PagedResponseResult} from '@compose/api-types'

export const PagedWrapper = {
  DEFAULT_MAX: {
    offset: 0,
    pageSize: 42
  } as PageableEntity,
  /**
   * ## Pr 空返回结果
   * @see PagedResponseResult
   */
  empty: <T>(): PagedResponseResult<T> => {
    return {
      offset: 0,
      pageSize: 0,
      total: 0,
      size: 0,
      dataList: [] as T[]
    } as PagedResponseResult<T>
  }
}

/**
 * ## PagedWrapper 的简写形式
 */
export const Pw = PagedWrapper
