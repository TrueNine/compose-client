import type {SafeAny} from './Types'

/**
 * 单独一个或更多
 */
export type MaybeArray<T = SafeAny> = T | T[]

/**
 * 单独一个或更多 readonlyArray
 */
export type MaybeReadonlyArray<T = SafeAny> = T | readonly T[]

/**
 * 单独一个或更多 readonly array 或者 array
 */
export type Maybe<T = SafeAny> = MaybeArray<T> | MaybeReadonlyArray<T>
