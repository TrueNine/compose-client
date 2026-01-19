import type {dynamic} from '@truenine/types'

/**
 * 只有成功参数
 */
export interface BaseSuccessOption<T = dynamic> {
  success?: (res?: T) => void
}

/**
 * 一个正常的操作参数
 */
export interface BaseOption<T = dynamic, R = dynamic> extends BaseSuccessOption<T> {
  fail?: (err?: R) => void
  complete?: () => void
}

/**
 * 支持可取消的接口
 */
export interface BaseCancelableOption<T = dynamic, R = dynamic> extends BaseOption<T, R> {
  cancel?: () => void
}

/**
 * 支持 trigger 的参数
 */
export interface BaseTriggerOption<T = dynamic, R = dynamic, E = dynamic> extends BaseOption<T, R> {
  trigger?: (res?: E) => void
}

/**
 * 可以涵盖所有操作的函数
 */
export type BaseAllOption<T = dynamic, R = dynamic, E = dynamic> = BaseCancelableOption<T, R> & BaseTriggerOption<T, R, E>
