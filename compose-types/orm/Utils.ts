import type {PagedRequestParam} from '../request'
import type {Int} from '../typescripts'

export const PagedWrapper = {
  DEFAULT_MAX: {
    offset: 0,
    pageSize: 42
  } as PagedRequestParam
}

/**
 * ## PagedWrapper 的简写形式
 */
export const Pw = PagedWrapper

/**
 * 数据库的主键
 */
export type Id = string
/**
 * 数据库的外键
 */
export type ReferenceId = Id
/**
 * 大数，用于相加或随机增加的大数值
 */
export type BigSerial = number
/**
 * 序列化编号，通常使用 string 来表示
 */
export type SerialCode = string
/**
 * 比较大的字符串，比如：文章内容，个人简介等等
 */
export type BigText = string
/**
 * 类型数字
 */
export type TypeInt = Int
/**
 * 字符串类型序列号
 */
export type TypeSerial = SerialCode
