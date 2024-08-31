/**
 * 已知的任意类型，用于某些时候骗过编译器
 */
// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
export type SafeAny = any
export type dynamic = SafeAny

/**
 * 未知类型
 */
export type Uk = unknown
export type uk = Uk

/**
 * 可选熟属性的简写
 */
export type Pt<T> = Partial<T>
export type pt<T> = Pt<T>

/**
 * 非可选属性简写
 */
export type Rq<T> = Required<T>
export type rq<T> = Rq<T>

/**
 * 裁剪对象内的字段为可选属性
 */
export type Clip<T extends object, K extends keyof T> = Omit<T, K> & Pt<Pick<T, K>>
export type clip<T extends object, K extends keyof T> = Clip<T, K>

/**
 * ## 一个可创建的实例
 */
export type Newable = abstract new (...args: dynamic) => dynamic
export type newable = Newable

export type WithNew<T = dynamic> = T extends newable ? T : T & newable

/**
 * # InstanceType 的简写
 *
 * ```typescript
 * type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
 * ```
 */
export type Inst<T extends newable> = InstanceType<T>
export type inst<T extends newable> = Inst<T>

/**
 * # 元素可为 undefined，可能需要后初始化
 */
export type Late<T = SafeAny> = T | undefined
export type late<T = SafeAny> = Late<T>

/**
 * # 元素可为 null
 */
export type Nullable<T = SafeAny> = T | null
export type nullable<T = SafeAny> = Nullable<T>
export type Nil<T = SafeAny> = Nullable<T>
export type nil<T = SafeAny> = Nil<T>

/**
 * # 元素可为 undefined，可能需要后初始化，也可能为 null
 */
export type LateNull<T> = T | late<T> | nil<T>
export type latenull<T> = LateNull<T>

/**
 * # 可空，可选，不稳定
 */
export type NilPt<T = dynamic> = pt<T> | latenull<T>
export type nilpt<T = dynamic> = NilPt<T>

/**
 * ## 绝对不会返回
 */
export type Nothing = (never & null & undefined & void) | never | null | undefined | void
export type nothing = Nothing

/**
 * ## 条件类型，如果条件为空，则返回默认类型
 * @typeParam Exp 条件类型
 * @typeParam Default 默认类型
 */
export type OrElse<Exp, Default> = Exp extends nothing ? Default : Exp
/**
 * @see OrElse
 */
export type orelse<Exp, Default> = OrElse<Exp, Default>

/**
 * ## 返回的一个空值
 */
export type Unit = void
export type unit = Unit
