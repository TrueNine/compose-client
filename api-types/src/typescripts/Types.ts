/**
 * 已知的任意类型，用于某些时候骗过编译器
 * @deprecated 不建议直接使用，使用 `dynamic` 更为贴切
 */
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line ts/no-explicit-any
export type SafeAny = any
/**
 * 已知的任意类型，用于某些时候骗过编译器
 */
export type dynamic = SafeAny

/**
 * 可选熟属性的简写
 */
export type pt<T> = Partial<T>

/**
 * 非可选属性简写
 */
export type rq<T> = Required<T>

/**
 * 裁剪对象内的字段为可选属性
 */
export type clip<T extends object, K extends keyof T> = Omit<T, K> & pt<Pick<T, K>>

/**
 * ## 一个可创建的实例
 */
export type newable = abstract new (...args: dynamic) => dynamic

/**
 * # InstanceType 的简写
 *
 * ```typescript
 * type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
 * ```
 */
export type inst<T extends newable> = InstanceType<T>

/**
 * # 元素可为 undefined，可能需要后初始化
 */
export type late<T = dynamic> = T | undefined

/**
 * # 元素可为 null
 */
export type nil<T = dynamic> = T | null

/**
 * # 元素可为 undefined，可能需要后初始化，也可能为 null
 */
export type latenil<T> = T | late<T> | nil<T>

/**
 * # 可空，可选，不稳定
 */
export type nilpt<T = dynamic> = Partial<T> | latenil<T>

/**
 * ## 条件类型，如果条件为空，则返回默认类型
 * @typeParam Exp 条件类型
 * @typeParam Default 默认类型
 */
export type orelse<Exp, Default> = Exp extends null | undefined ? Default : Exp
