import type {SafeAny} from '@compose/api-types'

/**
 * 只有成功参数
 */
export interface BaseSuccessOption<T = SafeAny> {
  /**
   * a try success
   * @param res 接口调用结果
   */
  success?: ((res?: T) => void) | never
}

/**
 * 一个正常的操作参数
 */
export interface BaseOption<T = SafeAny, R = SafeAny, E = SafeAny> extends BaseSuccessOption<T> {
  /**
   * a catch
   * @param err 错误消息
   */
  fail?: ((err?: R) => void) | never
  /**
   *  a finally
   */
  complete?: (() => void) | never
}

/**
 * 支持可取消的接口
 */
export interface BaseCancelableOption<T = SafeAny, R = SafeAny, E = SafeAny> extends BaseOption<T, R, E> {
  /**
   * 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
   */
  cancel?: (() => void) | never
}

/**
 * 支持 trigger 的参数
 */
export interface BaseTriggerOption<T = SafeAny, R = SafeAny, E = SafeAny> extends BaseOption<T, R, E> {
  /**
   * 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口
   * @param res 可能是事件
   */
  trigger?: ((res?: E) => void) | never
}

/**
 * 可以涵盖所有操作的函数
 */
export type BaseAllOption<T = SafeAny, R = SafeAny, E = SafeAny> = BaseCancelableOption<T, R, E> & BaseTriggerOption<T, R, E>
