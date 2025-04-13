import type { BasicType, nilpt } from '@compose/api-types'
import { isNonNil, isNonNilString } from '@compose/api-model'

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
 * # 将多个对象转换为 URLSearchParams 格式的字符串
 * @param cards 需转换对象
 */
export function encodeQueryParam(...cards: nilpt<object>[]): string {
  const params = new SearchParam()
  if (!cards.length) {
    return ''
  }
  cards.filter(isNonNil).forEach((c) => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonNil(v))
      .map(([k, v]) => [k, isNonNilString(v as string) ? encodeURIComponent(v as string) : v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
      .forEach(([k, v]) => {
        params.append(encodeURIComponent(k as string), v as string)
      })
  })
  return params.toString() && `?${params.toString()}`
}

export function queryParam(...cards: nilpt<object>[]): string {
  const params = new SearchParam()
  if (!cards.length) {
    return ''
  }
  cards.filter(isNonNil).forEach((c) => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonNil(v))
      .map(([k, v]) => [k, v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.filter(isNonNil).join(',') : v])
      .forEach(([k, v]) => {
        params.append(k as string, v as string)
      })
  })
  return params.toString() && `?${params.toString()}`
}

export function queryHash(...cards: nilpt<object>[]): string {
  const qp = queryParam(...cards)
  return qp ? `#${qp.slice(1)}` : ''
}

export function decodeHash(hash?: string): Record<string, string> {
  if (hash == null) {
    return {}
  }
  return hash
    .replace(/^#/, '')
    .split('&')
    .map((s) => s.split('='))
    .reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = v
      return acc
    }, {})
}
