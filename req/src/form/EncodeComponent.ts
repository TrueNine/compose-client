import type {BasicType, nilpt} from '@truenine/types'
import {isNonNil, isNonNilString} from '@truenine/shared'

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

  get(name: string): BasicType | undefined {
    return this._root.get(name)
  }

  has(name: string): boolean {
    return this._root.has(name)
  }

  delete(name: string): boolean {
    this._cachedString = null
    return this._root.delete(name)
  }

  clear(): void {
    this._cachedString = null
    this._root.clear()
  }

  keys(): IterableIterator<string> {
    return this._root.keys()
  }

  values(): IterableIterator<BasicType> {
    return this._root.values()
  }

  get size(): number {
    return this._root.size
  }

  toString(): string {
    if (this._cachedString !== null) return this._cachedString // 使用缓存提升性能

    this._cachedString = [...this._root]
      .map(([k, v]) => {
        const key = encodeURIComponent(k.toString())
        const value = v != null ? encodeURIComponent(v.toString()) : ''
        return `${key}=${value}`
      })
      .join('&')

    return this._cachedString
  }

  append(name: string, value: BasicType): this {
    if (name && value == null) return this

    this._cachedString = null
    this._root.set(name, value)
    return this
  }

  appendAll(params: Record<string, BasicType>): this {
    Object.entries(params).forEach(([key, value]) => this.append(key, value))
    return this
  }

  static fromString(queryString: string): SearchParam {
    const params = new SearchParam()
    if (!queryString) return params

    const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString

    cleanQuery.split('&').forEach(pair => {
      const [key, value] = pair.split('=').map(decodeURIComponent)
      if (key) params.append(key, value)
    })

    return params
  }

  clone(): SearchParam {
    const newParams = new SearchParam()
    newParams._root = new Map(this._root)
    newParams._cachedString = this._cachedString
    return newParams
  }
}

export function encodeQueryParam(...cards: nilpt<object>[]): string {
  if (!cards.length) return ''

  const params: [string, string][] = []
  const validCards = cards.filter(isNonNil)

  if (!validCards.length) return ''

  for (const card of validCards) {
    const entries = Object.entries(card as Record<string, unknown>)
    for (const [key, value] of entries) {
      if (value == null) continue
      const encodedKey = encodeURIComponent(key)
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null) params.push([encodedKey, encodeURIComponent(String(v))])
        }
      } else if (typeof value === 'string') params.push([encodedKey, encodeURIComponent(value)])
      else if (typeof value === 'object') {
        params.push([encodedKey, '']) // 嵌套对象只处理一层，输出空字符串
      } else params.push([encodedKey, String(value)])
    }
  }

  const result = params.map(([k, v]) => `${k}=${v}`).join('&')
  return result ? `?${result}` : ''
}

export function queryParam(...cards: nilpt<object>[]): string {
  if (!cards.length) return ''

  const params: [string, string][] = []
  const validCards = cards.filter(isNonNil)

  if (!validCards.length) return ''

  for (const card of validCards) {
    const entries = Object.entries(card as Record<string, unknown>)
    for (const [key, value] of entries) {
      if (value == null) continue
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null) params.push([key, String(v)])
        }
      } else if (typeof value === 'object') {
        params.push([key, '']) // 嵌套对象只处理一层，输出空字符串
      } else params.push([key, String(value)])
    }
  }

  const result = params.map(([k, v]) => `${k}=${v}`).join('&')
  return result ? `?${result}` : ''
}

export function queryHash(...cards: nilpt<object>[]): string {
  if (!cards.length) return ''

  const params: [string, string][] = []
  const validCards = cards.filter(isNonNil)

  if (!validCards.length) return ''

  for (const card of validCards) {
    const entries = Object.entries(card as Record<string, unknown>)
    for (const [key, value] of entries) {
      if (value == null) continue
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null) params.push([key, String(v)])
        }
      } else if (typeof value === 'object') params.push([key, ''])
      else params.push([key, String(value)])
    }
  }

  const result = params.map(([k, v]) => `${k}=${v}`).join('&')
  return result ? `#${result}` : ''
}

export function decodeHash(hash?: string | null): Record<string, string> {
  const result: Record<string, string> = {}

  if (!isNonNilString(hash)) return result

  const rawInput = (hash as string).startsWith('#') ? (hash as string).slice(1) : hash as string // 此时我们已经确认 hash 是非空字符串
  if (!isNonNilString(rawInput)) return result

  const pairs = rawInput.split('&')
  for (const pair of pairs) {
    if (!isNonNilString(pair)) continue

    const [key, value] = pair.split('=')
    if (isNonNilString(key)) result[key] = isNonNilString(value) ? value : ''
  }

  return result
}
