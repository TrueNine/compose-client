import type {PagedRequestParam} from '../request/Request'

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
