export type EnumOptionalKey = string | number | symbol
export type EnumOptionalValue = string | number

/**
 * 一个枚举真实值的表现形式
 */
export type EnumActual = Record<EnumOptionalKey, EnumOptionalValue>

export type EnumCommentMap<E extends EnumActual> = Record<Evr<E>, string>
export type EnumMap<E extends EnumActual> = Record<Evr<E>, Evr<E>>

/**
 * ## Enum Reverse value 枚举反向值
 *
 * 必须要举例枚举
 *
 * ```typescript
 *  type stepNodes = Evr<typeof GenderEnum>
 * ```
 *
 * @param E 枚举类型
 */
export type Evr<E extends EnumActual> = E[keyof E]
