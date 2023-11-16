import type {NullPt} from '@compose/compose-types'

/**
 * ## 判断一个字符串是否为空，返回本身或空字符串，排除 null | undefined
 * @param str 可空字符串
 * @returns 本身 或者 ""
 */
export function withEmpty(str?: string): string {
  return isNonEmpty(str) ? str! : ''
}

/**
 * # 判断一个对象是否为 null 或 undefined，以减少语义负担
 * @param obj 对象
 */
export function isEmpty(obj: NullPt<unknown>): boolean {
  if (obj === undefined) return true
  if (obj === null) return true
  if (typeof obj === 'string' && !isNonEmptyString(obj)) return true
  if (Array.isArray(obj) && obj.length === 0) return true
  return typeof obj === 'object' && Object.keys(obj).length === 0
}

/**
 * # 对 [isEmpty] 的反向调用
 * @param obj 对象
 */
export function isNonEmpty(obj: unknown) {
  return !isEmpty(obj)
}

/**
 * # nullCoalesce 函数用于判断一个对象是否为 null 或 undefined，如果是则返回默认值
 * @param aib 对象
 * @param replaced 默认值
 * @returns NonNullable<T>
 */
export function nullCoalesce<T>(aib: T, replaced: T = aib): NonNullable<T> {
  return (isNonEmpty(aib) ? aib : replaced) as NonNullable<T>
}

/**
 * # 判断一个对象是否为非空字符串
 * @param obj 对象
 */
export function isNonEmptyString(obj: NullPt): boolean {
  return typeof obj === 'string' && obj.trim().length > 0
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dlv(obj: any, key: string | string[], def: any, p = 0, undef: any): any {
  if (typeof key === 'string') {
    key = key.split('.')
  }
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
