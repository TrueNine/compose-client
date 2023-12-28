export type EnumOptionalType = string | number | symbol
export type EnumActual = Record<EnumOptionalType, EnumOptionalType>

/**
 * ## Enum Reverse value
 *
 * 必须要举例枚举
 *
 * ```typescript
 *  type a = Evr<typeof GenderEnum>
 * ```
 *
 * @param E 枚举类型
 */
export type Evr<E extends EnumActual> = E[keyof E]
