import type { Late, Nullable, Pt, SafeAny } from "./Types";

/**
 * # 基本值类型
 */
export type BasicType = StrOrNum | boolean

/**
 * # 数值或字符串
 */
export type StrOrNum = string | number

/**
 * ## 表示一个可以为 异步的类型
 * @example string | Promise<string>
 */
export type Asyncable<T = SafeAny> = T | Promise<T>

/**
 * # 可空，可选，不稳定
 */
export type NullPt<T = SafeAny> = Pt<T> | Nullable<T> | Late<T>
