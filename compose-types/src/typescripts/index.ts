/**
 * 已知的任意类型，用于某些时候骗过编译器
 */
// eslint-disable-next-line
export type SafeAny = any

/**
 * # 基本值类型
 */
export type BasicType = string | number | boolean

/**
 * # 数值或字符串
 */
export type StrOrNum = string | number

/**
 * # 元素可为 null
 */
export type Nullable<T = SafeAny> = T | null

/**
 * # 元素可为 undefined，可能需要后初始化
 */
export type LateInit<T = SafeAny> = T | undefined

/**
 * # InstanceType 的简写
 *
 * ```typescript
 * type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
 * ```
 */
export type Inst<T extends abstract new (...args: SafeAny) => SafeAny> = InstanceType<T>

/**
 * # 可空，可选，不稳定
 */
export type NullablePartial<T = SafeAny> = T | Partial<T> | Nullable<T> | LateInit<T>

/**
 * ## 表示一个可以为 异步的类型
 * @example string | Promise<string>
 */
export type Asyncable<T = SafeAny> = T | Promise<T>

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
 * 空的字符串
 */
export const EMPTY_STR: string = ''
