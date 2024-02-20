import type {dynamic} from './Types'

/**
 * # 数值或字符串
 */
export type StrOrNum = string | number

/**
 * # 基本值类型
 */
export type BasicType = StrOrNum | boolean

/**
 * ## 类似 c# Task<T>
 */
export type Task<T> = Promise<T>
export type task<T> = Task<T>

/**
 * ## 表示一个可以为 异步的类型
 * @example string | Promise<string>
 */
export type Asyncable<T = dynamic> = T | task<T>
export type asyncable<T = dynamic> = Asyncable<T>
