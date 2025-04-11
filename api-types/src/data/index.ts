export * from './Address'

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
