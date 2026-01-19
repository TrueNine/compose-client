export type EnumOptionalKey = string | number | symbol
export type EnumOptionalValue = string | number

/**
 * 一个枚举真实值的表现形式
 */
export type EnumActual = Record<EnumOptionalKey, EnumOptionalValue>

export type EnumCommentMap<E extends EnumActual> = Record<Evr<E>, string> & Record<EnumOptionalKey, string>
export type EnumMap<E extends EnumActual> = Record<Evr<E>, Evr<E>>

export type Evr<E extends EnumActual> = E[keyof E]
