import type {Pq, Pr} from '@compose/api-types'

export const PagedWrapper = {
  DEFAULT_MAX: {
    o: 0,
    s: 42
  } as Pq,

  /**
   * ## Pr 空返回结果
   * @see PagedResponseResult
   */
  empty: <T>(): Pr<T> => {
    return {
      o: 0,
      p: 0,
      t: 0,
      d: [] as T[]
    } as Pr<T>
  }
}

/**
 * ## PagedWrapper 的简写形式
 */
export const Pw = PagedWrapper
