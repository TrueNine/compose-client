import type {nilpt, dynamic, bool, Maybe, int} from '@compose/api-types'

import {STR_EMPTY} from '@/consts'

/**
 * ## 判断一个字符串是否为空，返回本身或空字符串，排除 null | undefined
 * @param str 可空字符串
 * @returns 本身 或者 ""
 */
export function withEmpty(str?: string): string {
  return isNonNil(str) ? str! : STR_EMPTY
}

/**
 * # 判断一个值是否为空，以减少语义负担
 *
 * - null
 * - undefined
 * - ''
 * - []
 * - [every item is empty]
 * - {}
 *
 * @param value 对象
 */
export function isNil(value?: nilpt<unknown>): bool {
  if (value == null) return true
  if (typeof value === 'string' && !isNonNilString(value)) return true
  if (Array.isArray(value)) {
    if (value.length === 0) return true
    if (value.every(isNil)) return true
  }
  return typeof value === 'object' && Object.keys(value).length === 0
}

/**
 * # 对 [isEmpty] 的反向调用
 * @param value 对象
 */
export function isNonNil(value?: nilpt<unknown>) {
  return !isNil(value)
}

/**
 * # nullCoalesce 函数用于判断一个对象是否为 null 或 undefined，如果是则返回默认值
 * @param aib 对象
 * @param replaced 默认值
 * @returns NonNullable<T>
 */
export function nilCoalesce<T>(aib: T, replaced: T = aib): NonNullable<T> {
  return (isNonNil(aib) ? aib : replaced) as NonNullable<T>
}

/**
 * # 判断一个值是否为非空字符串
 * @param value 对象
 */
export function isNonNilString(value?: nilpt<string>): bool {
  return (value?.trim().length ?? 0) > 0
}

/**
 * # 将一个 Record[string,T] 转换为另一个 Record[string,U]
 * @param record 需转换对象
 * @param callback 转换回调
 */
export function mapRecord<T, U>(record: Record<string, T>, callback: (val: T) => U): Record<string, U> {
  return Object.entries(record).reduce(
    (result, [key, value]) => {
      result[key] = callback(value)
      return result
    },
    {} as Record<string, U>
  )
}

export function dlv(obj: dynamic, key: Maybe<string>, def: dynamic, p: int, undef: dynamic): dynamic {
  if (typeof key === 'string') key = key.split('.')
  for (p = 0; p < key.length; p++) {
    const path = key[p]
    obj = obj ? obj[path] : undef
  }
  return obj === undef ? def : obj
}

/**
 * ## 对对象进行解包操作
 * @param obj 操作对象
 */
export function des<T>(obj: T): T {
  return {...obj}
}

/**
 * ## 对数组进行解构操作
 * @param arr 操作数组
 */
export function aDes<T>(arr: T[] | readonly T[]): T[] {
  return arr.map(e => ({...e}))
}
