import type {Pq, Pr} from '@truenine/types'

export const PagedWrapper = {DEFAULT_MAX: {o: 0, s: 42} as Pq, empty: <T>(): Pr<T> => ({o: 0, p: 0, t: 0, d: [] as T[]} as Pr<T>)}

/**
 * ## PagedWrapper 的简写形式
 */
export const Pw: typeof PagedWrapper = PagedWrapper
