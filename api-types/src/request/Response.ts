import type { IPageRequestParam } from '@/request/Request'
import type { i32, i64 } from '@/typescripts'

/**
 * 错误消息统一返回格式
 */
export interface ErrBody {
  msg?: string
  code: i32
  alert?: string
  errMap?: Record<string, string>
}

/**
 * # 分页数据
 */
export interface IPage<D> {
  /**
   * ## Data List
   * > 所有 元素列表
   */
  d?: D[]
  /**
   * ## Total Element Count
   * > 所有 元素总数
   */
  t?: i64
  /**
   * ## Total Page Size
   * > 所有 页面总数
   */
  p?: i64
  /**
   * 分页原始数据
   * @see IPageRequestParam
   * @default undefined
   * @deprecated 后端一般不会返回这个
   */
  readonly pageParam?: IPageRequestParam
}

/**
 * # IPage 的简写形式
 * @see IPage
 */
export type Pr<T> = IPage<T>
