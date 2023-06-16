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
 * @param valueHandle 值提供函数
 * @param keyHandle 键提供函数
 * @returns 组合后的 map k v[]
 */
export function combineToMap<T, K, V>(arr: T[], keyHandle: (t: T) => K, valueHandle: (t: T) => V): Map<K, V[]> {
  const result = new Map<K, V[]>()
  arr.forEach(item => {
    const _k = keyHandle(item)
    if (result.has(_k)) result.get(_k)?.push(valueHandle(item))
    else result.set(_k, [valueHandle(item)])
  })
  return result
}
