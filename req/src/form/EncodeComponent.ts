import type { BasicType, nilpt } from '@compose/types'
import { isNonNil, isNonNilString } from '@compose/shared'

/**
 * 表示 URL 查询参数的类
 *
 * 该类提供了一系列方法来操作和查询 URL 查询参数
 *
 *
 */
export class SearchParam {
  private _root = new Map<string, BasicType>()
  private _cachedString: string | null = null

  /**
   * 获取参数值
   * @param name 参数名
   */
  get(name: string): BasicType | undefined {
    return this._root.get(name)
  }

  /**
   * 检查是否存在某个参数
   * @param name 参数名
   */
  has(name: string): boolean {
    return this._root.has(name)
  }

  /**
   * 删除指定参数
   * @param name 参数名
   */
  delete(name: string): boolean {
    this._cachedString = null
    return this._root.delete(name)
  }

  /**
   * 清空所有参数
   */
  clear(): void {
    this._cachedString = null
    this._root.clear()
  }

  /**
   * 获取所有参数名
   */
  keys(): IterableIterator<string> {
    return this._root.keys()
  }

  /**
   * 获取所有参数值
   */
  values(): IterableIterator<BasicType> {
    return this._root.values()
  }

  /**
   * 获取参数数量
   */
  get size(): number {
    return this._root.size
  }

  toString(): string {
    // 使用缓存提升性能
    if (this._cachedString !== null) {
      return this._cachedString
    }

    this._cachedString = Array.from(this._root)
      .map(([k, v]) => {
        const key = encodeURIComponent(k.toString())
        const value = v != null ? encodeURIComponent(v.toString()) : ''
        return `${key}=${value}`
      })
      .join('&')

    return this._cachedString
  }

  /**
   * 添加参数
   * @param name 参数名
   * @param value 参数值
   */
  append(name: string, value: BasicType): this {
    if (name && value != null) {
      this._cachedString = null
      this._root.set(name, value)
    }
    return this
  }

  /**
   * 批量添加参数
   * @param params 参数对象
   */
  appendAll(params: Record<string, BasicType>): this {
    Object.entries(params).forEach(([key, value]) => {
      this.append(key, value)
    })
    return this
  }

  /**
   * 从 URL 查询字符串创建实例
   * @param queryString URL 查询字符串
   */
  static fromString(queryString: string): SearchParam {
    const params = new SearchParam()
    if (!queryString) {
      return params
    }

    const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString

    cleanQuery.split('&').forEach((pair) => {
      const [key, value] = pair.split('=').map(decodeURIComponent)
      if (key) {
        params.append(key, value)
      }
    })

    return params
  }

  /**
   * 克隆当前实例
   */
  clone(): SearchParam {
    const newParams = new SearchParam()
    newParams._root = new Map(this._root)
    newParams._cachedString = this._cachedString
    return newParams
  }
}

/**
 * 将多个对象转换为带 `?` 前缀的 URL 查询参数字符串
 *
 * @example
 * ```ts
 * encodeQueryParam({ page: 1, size: 10 }) // "?page=1&size=10"
 * encodeQueryParam({ tags: ['a', 'b'] }) // "?tags=a,b"
 * encodeQueryParam({ name: '测试' }) // "?name=%E6%B5%8B%E8%AF%95"
 * ```
 *
 * @param cards - 需要转换的对象数组，支持嵌套数组
 * @returns 返回带 `?` 前缀的查询字符串，如果没有有效参数则返回空字符串
 */
export function encodeQueryParam(...cards: nilpt<object>[]): string {
  if (!cards.length) {
    return ''
  }

  const params: Array<[string, string]> = []
  const validCards = cards.filter(isNonNil)

  if (!validCards.length) {
    return ''
  }

  for (const card of validCards) {
    const entries = Object.entries(card as Record<string, unknown>)
    for (const [key, value] of entries) {
      if (value == null) {
        continue
      }
      const encodedKey = encodeURIComponent(key)
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null) {
            params.push([encodedKey, encodeURIComponent(String(v))])
          }
        }
      } else if (typeof value === 'string') {
        params.push([encodedKey, encodeURIComponent(value)])
      } else if (typeof value === 'object') {
        // 嵌套对象只处理一层，输出空字符串
        params.push([encodedKey, ''])
      } else {
        params.push([encodedKey, String(value)])
      }
    }
  }

  const result = params.map(([k, v]) => `${k}=${v}`).join('&')
  return result ? `?${result}` : ''
}

/**
 * 将多个对象转换为带 `?` 前缀的 URL 查询参数字符串
 * 与 encodeQueryParam 的区别是不会对参数值进行 URL 编码
 *
 * @example
 * ```ts
 * queryParam({ page: 1, size: 10 }) // "?page=1&size=10"
 * queryParam({ tags: ['a', 'b'] }) // "?tags=a,b"
 * queryParam({ name: '测试' }) // "?name=测试"
 * ```
 *
 * @param cards - 需要转换的对象数组
 * @returns 返回带 `?` 前缀的查询字符串，如果没有有效参数则返回空字符串
 */
export function queryParam(...cards: nilpt<object>[]): string {
  if (!cards.length) {
    return ''
  }

  const params: Array<[string, string]> = []
  const validCards = cards.filter(isNonNil)

  if (!validCards.length) {
    return ''
  }

  for (const card of validCards) {
    const entries = Object.entries(card as Record<string, unknown>)
    for (const [key, value] of entries) {
      if (value == null) {
        continue
      }
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null) {
            params.push([key, String(v)])
          }
        }
      } else if (typeof value === 'object') {
        // 嵌套对象只处理一层，输出空字符串
        params.push([key, ''])
      } else {
        params.push([key, String(value)])
      }
    }
  }

  const result = params.map(([k, v]) => `${k}=${v}`).join('&')
  return result ? `?${result}` : ''
}

/**
 * 将多个对象转换为带 `#` 前缀的 URL hash 字符串
 *
 * @example
 * ```ts
 * queryHash({ page: 1 }) // "#page=1"
 * queryHash({ tags: ['a', 'b'] }) // "#tags=a,b"
 * ```
 *
 * @param cards - 需要转换的对象数组
 * @returns 返回带 `#` 前缀的 hash 字符串，如果没有有效参数则返回空字符串
 */
export function queryHash(...cards: nilpt<object>[]): string {
  if (!cards.length) {
    return ''
  }

  const params: Array<[string, string]> = []
  const validCards = cards.filter(isNonNil)

  if (!validCards.length) {
    return ''
  }

  for (const card of validCards) {
    const entries = Object.entries(card as Record<string, unknown>)
    for (const [key, value] of entries) {
      if (value == null) {
        continue
      }
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null) {
            params.push([key, String(v)])
          }
        }
      } else if (typeof value === 'object') {
        params.push([key, ''])
      } else {
        params.push([key, String(value)])
      }
    }
  }

  const result = params.map(([k, v]) => `${k}=${v}`).join('&')
  return result ? `#${result}` : ''
}

/**
 * 解析 URL hash 字符串为对象
 *
 * @example
 * ```ts
 * decodeHash('#page=1&size=10') // { page: '1', size: '10' }
 * decodeHash('page=1&size=10') // { page: '1', size: '10' }
 * ```
 *
 * @param hash - 要解析的 hash 字符串，可以带 `#` 前缀
 * @returns 解析后的对象，如果输入为空则返回空对象
 */
export function decodeHash(hash?: string | null): Record<string, string> {
  const result: Record<string, string> = {}

  if (!isNonNilString(hash)) {
    return result
  }

  // 此时我们已经确认 hash 是非空字符串
  const rawInput = (hash as string).startsWith('#') ? (hash as string).slice(1) : hash as string
  if (!isNonNilString(rawInput)) {
    return result
  }

  const pairs = (rawInput).split('&')
  for (const pair of pairs) {
    if (!isNonNilString(pair)) {
      continue
    }

    const [key, value] = pair.split('=')
    if (isNonNilString(key)) {
      result[key] = isNonNilString(value) ? value : ''
    }
  }

  return result
}
