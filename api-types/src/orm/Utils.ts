/**
 * 数据库的主键
 */
export type Id = string

/**
 * 数据库的外键
 * @deprecated 改用更短的 `RefId`
 */
export type ReferenceId = Id
/**
 * 数据库的外键
 */
export type RefId = Id

/**
 * 类型数字
 * @deprecated 改用 rust 风格
 */
export type TypeInt = number

/**
 * 字符串类型序列号
 * @deprecated 改用 rust 风格
 */
export type TypeSerial = string
/**
 * @deprecated 改用 rust 风格
 */
export type TypeString = string
/**
 * @deprecated 改用 rust 风格
 */
export type TypeStr = string
