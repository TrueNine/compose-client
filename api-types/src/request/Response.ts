import type {IPageRequestParam} from '@/request/Request'
import type {i32, i64} from '@/typescripts'

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
   */
  d?: D[]
  /**
   * ## Total Element Count
   */
  t: i64
  /**
   * ## Total Page Size
   */
  p: i64
  /**
   * ## Offset
   */
  o: i64
  /**
   * 分页原始数据
   * @see IPageRequestParam
   * @default undefined
   */
  readonly pageParam?: IPageRequestParam
}

/**
 * # IPage 的简写形式
 * @see IPage
 */
export type Pr<T> = IPage<T>
