import type { bool, nilpt } from '@truenine/types'

import { STR_EMPTY } from '@/consts'

/**
 * 将可能为空的字符串转换为非空字符串
 * @param input - 输入字符串
 * @returns 非空字符串，若输入为空则返回空字符串
 */
export function withEmpty(input?: string): string {
  return isNonNil(input) ? (input as string) : STR_EMPTY
}

/**
 * 判断值是否为空
 * 以下情况被视为空：
 * - null
 * - undefined
 * - 空字符串
 * - 空数组
 * - 所有元素都为空的数组
 * - 空对象
 *
 * @param value - 待检查的值
 * @returns 是否为空
 */
export function isNil(value?: nilpt<unknown>): bool {
  if (value == null) {
    return true
  }

  if (typeof value === 'string' && !isNonNilString(value)) {
    return true
  }

  if (Array.isArray(value)) {
    return value.length === 0 || value.every(isNil)
  }

  return typeof value === 'object' && Object.keys(value).length === 0
}

/**
 * 判断值是否非空
 * @param value - 待检查的值
 */
export function isNonNil(value?: nilpt<unknown>): boolean {
  return !isNil(value)
}

/**
 * 空值合并操作
 * @param value - 原始值
 * @param defaultValue - 默认值
 * @returns 非空值
 */
export function nilCoalesce<T>(value: T, defaultValue: T = value): NonNullable<T> {
  return (isNonNil(value) ? value : defaultValue) as NonNullable<T>
}

/**
 * 判断字符串是否非空
 * @param value - 待检查的字符串
 */
export function isNonNilString(value?: nilpt<string>): bool {
  return (value?.trim().length ?? 0) > 0
}

/**
 * 将对象的值类型从 T 映射为 U
 * @param record - 源对象
 * @param transform - 转换函数
 */
export function mapRecord<T, U>(record: Record<string, T>, transform: (val: T) => U): Record<string, U> {
  return Object.entries(record).reduce<Record<string, U>>((acc, [key, value]) => {
    acc[key] = transform(value)
    return acc
  }, {})
}

/**
 * 安全地获取对象的深层属性值
 * @param obj - 源对象
 * @param path - 属性路径，可以是点分隔的字符串或字符串数组
 * @param defaultValue - 默认值
 */
export function dlv<T = unknown>(
  obj: Record<string, unknown>,
  path: string | string[],
  defaultValue: T,
): T {
  const keys = typeof path === 'string' ? path.split('.') : path
  let current: unknown = obj

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current as T ?? defaultValue
}

type DeepFilterFn = (value: unknown, key: string | number, depth: number) => boolean
type DeepTransformFn<T = unknown> = (value: T, key: string | number) => T

interface DeepOptions<T = unknown> {
  maxDepth?: boolean | number
  transform?: DeepTransformFn<T>
}

/**
 * 深度处理对象或数组
 * @param source - 源数据
 * @param options - 配置选项
 * @param filter - 过滤函数
 */
export function deepResolve<T extends Record<string, unknown> | unknown[]>(
  source: T,
  options: DeepOptions = {},
  filter: DeepFilterFn = () => false,
): T {
  const {
    maxDepth = false,
    transform = (value: unknown) => value,
  } = options

  function processValue<V>(value: V, depth: number): V {
    if (value == null || typeof value !== 'object') {
      return value
    }

    const isArray = Array.isArray(value)
    const result: Record<string, unknown> | unknown[] = isArray ? [] : {}

    if (isArray) {
      const arr = value as unknown[]
      arr.forEach((item, index) => {
        const key = String(index)
        if (filter(item, key, depth)) {
          ; (result as unknown[])[index] = transform(item, key)
        } else {
          const shouldRecurse = maxDepth === true
            || (typeof maxDepth === 'number' && depth < maxDepth)
            || (maxDepth === false && depth <= 0)

            ; (result as unknown[])[index] = shouldRecurse
            ? processValue(item, depth + 1)
            : item
        }
      })
    } else {
      const obj = value as Record<string, unknown>
      for (const [key, item] of Object.entries(obj)) {
        if (filter(item, key, depth)) {
          ; (result as Record<string, unknown>)[key] = transform(item, key)
        } else {
          const shouldRecurse = maxDepth === true
            || (typeof maxDepth === 'number' && depth < maxDepth)
            || (maxDepth === false && depth <= 0)

            ; (result as Record<string, unknown>)[key] = shouldRecurse
            ? processValue(item, depth + 1)
            : item
        }
      }
    }

    return result as V
  }

  return processValue(source, 0)
}

/**
 * 浅拷贝对象
 * @param obj - 源对象
 */
export function des<T extends Record<string, unknown>>(obj: T): T {
  return { ...obj }
}

/**
 * 浅拷贝数组中的所有对象
 * @param arr - 源数组
 */
export function aDes<T extends Record<string, unknown>>(arr: T[] | readonly T[]): T[] {
  return arr.map((item) => ({ ...item }))
}
