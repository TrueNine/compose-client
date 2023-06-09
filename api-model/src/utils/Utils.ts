import {SearchParam} from './Http'

/**
 * # 笛卡尔乘积，用于解包类型数组
 *
 * @param spec {@link Record} {@link string},{@link string[]}  需处理对象
 * @param currentIndex 当前索引 默认 0
 * @param currentCombination 当前穷举组合
 */
export function cartesianProduct(spec: Record<string, string[]>, currentIndex = 0, currentCombination: Record<string, string> = {}): Record<string, string>[] {
  if (currentIndex === Object.keys(spec).length) {
    return [currentCombination]
  }
  const currentKey = Object.keys(spec)[currentIndex]
  const currentValues = spec[currentKey]

  const result: Record<string, string>[] = []
  for (let i = 0; i < currentValues.length; i++) {
    const nextCombination = {...currentCombination}
    nextCombination[currentKey] = currentValues[i]
    result.push(...cartesianProduct(spec, currentIndex + 1, nextCombination))
  }
  return result.filter(e => Object.keys(e).length !== 0)
}

/**
 * # 数组交集
 * @param a A数据
 * @param b B数组
 */
export function arrayDiff<T>(a: T[], b: T[]): T[] {
  const setA = new Set(a)
  const setB = new Set(b)
  const first = setA.size >= setB.size ? setA : setB
  const last = setA.size < setB.size ? setA : setB
  return Array.from(first).filter(i => !last.has(i))
}

/**
 * # 通用枚举定义
 */
export interface EnumDef {
  [index: string]: string | number
}

/**
 * # 获取枚举的数值值
 * @param enumEntity 枚举
 */
export function enumNumberValues<T extends EnumDef>(enumEntity: T): number[] {
  return Object.values(enumEntity)
    .filter(v => typeof v === 'number')
    .map(r => r as number)
}

/**
 * # 获取枚举对应的 string values
 * @param enumEntity 枚举
 */
export function enumStringValues<T extends EnumDef>(enumEntity: T): string[] {
  return Object.values(enumEntity)
    .filter(v => typeof v === 'string')
    .map(r => r as string)
}

/**
 * # 通过值获取对应枚举
 * @param enumEntity 枚举
 * @param enumValue 获取的值
 */
export function enumValueOf<T extends EnumDef>(enumEntity: T, enumValue: number | string): T | undefined {
  const key = Object.keys(enumEntity).filter(k => enumEntity[k] === enumValue)[0]
  return enumEntity[key] as unknown as T | undefined
}

/**
 * # 将一个 Record[string,T] 转换为另一个 Record[string,U]
 * @param record 需转换对象
 * @param callback 转换回调
 */
export function mapRecord<T, U>(record: Record<string, T>, callback: (val: T) => U): Record<string, U> {
  return Object.entries(record).reduce((result, [key, value]) => {
    result[key] = callback(value)
    return result
  }, {} as Record<string, U>)
}

/**
 * # 对数组进行去重
 * @param arr 数组
 */
export function arrayDistinct<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * # 二维数组扁平化
 * @param array 数组
 */
export function arrayFlatten<T>(array: T[][]): T[] {
  return array.reduce((flat, next) => {
    return [...flat, ...next]
  }, [])
}

/**
 * # 判断一个对象是否为非空字符串
 * @param obj 对象
 */
export function isNonEmptyString(obj: unknown): boolean {
  return typeof obj === 'string' && obj.trim().length > 0
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
 * # 判断一个对象是否为 null 或 undefined，以减少语义负担
 * @param obj 对象
 */
export function isEmpty(obj: unknown): boolean {
  if (obj === undefined) return true
  if (obj === null) return true
  if (typeof obj === 'string' && !isNonEmptyString(obj)) return true
  if (Array.isArray(obj) && obj.length === 0) return true
  return typeof obj === 'object' && Object.keys(obj).length === 0
}

/**
 * ## 判断一个字符串是否为空，返回本身或空字符串，排除 null | undefined
 * @param str 可空字符串
 * @returns 本身 或者 ""
 */
export function withEmpty(str?: string): string {
  return isNonEmpty(str) ? str! : ''
}

/**
 * # 对 [isEmpty] 的反向调用
 * @param obj 对象
 */
export function isNonEmpty(obj: unknown) {
  return !isEmpty(obj)
}

/**
 * # 环绕调用
 * @param supplier 提供一个返回值的函数
 * @param before 前置调用
 * @param after 后置调用
 */
export function around<T>(supplier: () => T, before?: () => void, after?: () => void): T {
  before?.()
  const r = supplier()
  after?.()
  return r
}

/**
 * # 将多个对象转换为 URLSearchParams 格式的字符串
 * @param cards 需转换对象
 */
export function encodeQueryParam(...cards: (object | null | undefined)[]): string {
  const params = new SearchParam()
  if (!cards) return ''
  cards.filter(isNonEmpty).forEach(c => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonEmpty(v))
      .map(([k, v]) => [k, isNonEmptyString(v) ? encodeURIComponent(v as string) : v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
      .forEach(([k, v]) => params.append(encodeURIComponent(k as string), (v as string).toString()))
  })
  return params.toString() && `?${params.toString()}`
}

export function queryParam(...cards: (Record<string, unknown> | null | undefined)[]): string {
  const params = new SearchParam()
  if (!cards) return ''
  cards.filter(isNonEmpty).forEach(c => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonEmpty(v))
      .map(([k, v]) => [k, v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
      .forEach(([k, v]) => params.append(k as string, (v as string).toString()))
  })
  return params.toString() && `?${params.toString()}`
}
