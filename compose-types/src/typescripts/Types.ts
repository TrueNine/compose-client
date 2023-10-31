/**
 * 已知的任意类型，用于某些时候骗过编译器
 */
// eslint-disable-next-line
export type SafeAny = any

/**
 * 未知类型
 */
export type Uk = unknown

/**
 * 可选熟属性的简写
 */
export type Pt<T> = Partial<T>

/**
 * 非可选属性简写
 */
export type Rq<T> = Required<T>

/**
 * # InstanceType 的简写
 *
 * ```typescript
 * type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
 * ```
 */
export type Inst<T extends abstract new (...args: SafeAny) => SafeAny> = InstanceType<T>

/**
 * # 元素可为 undefined，可能需要后初始化
 */
export type Late<T = SafeAny> = T | undefined

/**
 * # 元素可为 null
 */
export type Nullable<T = SafeAny> = T | null
