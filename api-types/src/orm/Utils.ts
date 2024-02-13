import type {Int, serialcode} from '@/typescripts'

/**
 * 数据库的主键
 */
export type Id = string

/**
 * 数据库的外键
 */
export type ReferenceId = Id
export type RefId = ReferenceId

/**
 * 类型数字
 */
export type TypeInt = Int

/**
 * 字符串类型序列号
 */
export type TypeSerial = serialcode
export type TypeString = TypeSerial
export type TypeStr = TypeString
