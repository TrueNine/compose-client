/**
 * # 基元类型
 */
export type BasicType = string | number | boolean

/**
 * # 数值或字符串
 */
export type StrOrNum = string | number

/**
 * # 元素可为 null
 */
export type Nullable<T = unknown> = T | null

/**
 * # InstanceType 的简写
 *
 * ```typescript
 * type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Inst<T extends abstract new (...args: any) => any> = InstanceType<T>

/**
 * # 可空，可选，不稳定
 */
export type NullablePartial<T = unknown> = T | Partial<T> | null | never | undefined | void

/**
 * ## 表示一个可以为 异步的类型
 * @example string | Promise<string>
 */
export type Asyncable<T> = T | Promise<T>
