import type { dynamic } from '@compose/api-types'

/**
 * 只有成功参数
 */
export interface BaseSuccessOption<T = dynamic> {
  /**
   * stepNodes try success
   * @param res 接口调用结果
   */
  success?: (res?: T) => void
}

/**
 * 一个正常的操作参数
 */
export interface BaseOption<T = dynamic, R = dynamic> extends BaseSuccessOption<T> {
  /**
   * stepNodes catch
   * @param err 错误消息
   */
  fail?: (err?: R) => void
  /**
   *  stepNodes finally
   */
  complete?: () => void
}

/**
 * 支持可取消的接口
 */
export interface BaseCancelableOption<T = dynamic, R = dynamic> extends BaseOption<T, R> {
  /**
   * 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
   */
  cancel?: () => void
}

/**
 * 支持 trigger 的参数
 */
export interface BaseTriggerOption<T = dynamic, R = dynamic, E = dynamic> extends BaseOption<T, R> {
  /**
   * 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口
   * @param res 可能是事件
   */
  trigger?: (res?: E) => void
}

/**
 * 可以涵盖所有操作的函数
 */
export type BaseAllOption<T = dynamic, R = dynamic, E = dynamic> = BaseCancelableOption<T, R> & BaseTriggerOption<T, R, E>
