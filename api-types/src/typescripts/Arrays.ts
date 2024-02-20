import type {dynamic} from './Types'
import type {binary, Byte} from './Number'

/**
 * ## readonly array or array
 */
export type LockableArray<T = dynamic> = readonly T[] | T[]

/**
 * ## 单独一个或更多
 */
export type MaybeArray<T = dynamic> = T | T[]

/**
 * ## 单独一个或更多 readonlyArray
 */
export type MaybeReadonlyArray<T = dynamic> = T | readonly T[]

/**
 * ## 单独一个或更多 readonly array 或者 array
 */
export type Maybe<T = dynamic> = MaybeArray<T> | MaybeReadonlyArray<T>

/**
 * ## 表示一个字节数组
 * @see ByteArray
 */
export type ByteBufferedArray = Uint8Array

/**
 * ## 一个类型式的字节数组
 * @see ByteBufferedArray
 */
export type ByteArray = Byte[]

/**
 * ## 二进制数组
 */
export type BinaryArray = LockableArray<binary> | ByteBufferedArray
