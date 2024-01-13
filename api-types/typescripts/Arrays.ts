import type { SafeAny } from "./Types";
import type { Byte } from "./Number";

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

/**
 * 表示一个字节数组
 * @see ByteArray
 */
export type ByteBufferedArray = Uint8Array

/**
 * 一个类型式的字节数组
 * @see ByteBufferedArray
 */
export type ByteArray = Byte[]
