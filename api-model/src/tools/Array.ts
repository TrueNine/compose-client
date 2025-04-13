import type { dynamic, late, Maybe } from '@compose/api-types'

/**
 * # 对数组进行去重
 * @param arr 数组
 */
export function arrayDistinct<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * # 笛卡尔乘积，用于解包类型数组
 *
 * @param spec {@link Record} {@link string},{@link string[]}  需处理对象
 * @param currentIndex 当前索引 默认 0
 * @param currentCombination 当前穷举组合
 */
export function cartesianProduct<T = unknown>(spec: Record<string, T[]>, currentIndex = 0, currentCombination: Record<string, T> = {}): Record<string, T>[] {
  if (currentIndex === Object.keys(spec).length) {
    return [currentCombination]
  }

  const currentKey = Object.keys(spec)[currentIndex]
  const currentValues = spec[currentKey]
  const result: Record<string, T>[] = []
  for (const value of currentValues) {
    const nextCombination = { ...currentCombination }
    nextCombination[currentKey] = value
    result.push(...cartesianProduct(spec, currentIndex + 1, nextCombination))
  }
  return result.filter((e) => Object.keys(e).length !== 0)
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
  return Array.from(first).filter((i) => !last.has(i))
}

/**
 * # 将一个数组组合为一个 Map
 *
 * 得到类似
 * ```typescript
 * Map {
 *   '颜色': [ '红色', '绿色', '默认' ],
 *   '尺寸': [ '大码'，'中码' ]
 *}
 * ```
 *
 * @param arr 数组
 * @param keyHandle 键提供函数
 * @param valueHandle 值提供函数
 * @returns 组合后的 map k v[]
 */
export function combineToMap<T, K, V>(arr: T[], keyHandle: (t: T) => K, valueHandle: (t: T) => V): Map<K, V[]> {
  const result = new Map<K, V[]>()
  arr.forEach((item) => {
    const _k = keyHandle(item)
    if (result.has(_k)) {
      result.get(_k)?.push(valueHandle(item))
    } else {
      result.set(_k, [valueHandle(item)])
    }
  })
  return result
}

/**
 * 将 maybe 类型转换为 array
 * @param maybe T | Array<T>
 */
export function maybeArray<T = dynamic>(maybe: Maybe<T>): T[] {
  return Array.isArray(maybe) ? maybe : ([maybe] as T[])
}

/**
 * 将 maybe 类型转换为 readonly array
 * @param maybe T | Array<T>
 */
export function maybeReadonlyArray<T = dynamic>(maybe: Maybe<T>): readonly T[] {
  return Array.isArray(maybe) ? maybe : ([maybe] as readonly T[])
}

/**
 * ## range
 * @param start 开始
 * @param end 结束
 */
export function* range(start: number, end: number): Generator<number, void, unknown> {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

/**
 * ## 将数组合并为一个 Map
 * @param key 作为 key 的字段
 * @param arr 需合并的对象数组
 */
export function mergeToMap<T extends object>(key: keyof T, arr: T[]): { [key in keyof T]: T[] } {
  if (!arr.length) {
    return {} as { [key in keyof T]: T[] }
  }
  const ks = arr.map((e) => ({
    key: (e[key]?.toString() ?? '') as keyof T,
    value: e,
  }))
  return ks.reduce(
    (acc, cur) => {
      if (acc[cur.key] !== void 0) {
        acc[cur.key]?.push(cur.value)
      } else {
        acc[cur.key] = [cur.value]
      }
      return acc
    },
    {} as { [key in keyof T]: T[] | undefined },
  ) as { [key in keyof T]: T[] }
}

/**
 * # 获取数组中相同值的第一个元素，如果没有相同值则返回 undefined
 * @param arr 数组
 * @param conditional 条件
 */
export function sameValue<T>(arr: T[], conditional: (t: T, old: T) => boolean = (t, old) => t === old): late<T> {
  if (arr.length === 0) {
    return void 0
  }
  const old = arr[0]
  return arr.every((v, i) => i === 0 || conditional(v, old)) ? old : void 0
}
