import type {BasicType, nilpt} from '@compose/api-types'
import {isNonNil, isNonNilString} from '@compose/api-model'

export class SearchParam {
  private _root: Map<string, BasicType> = new Map()

  toString(): string {
    return Array.from(this._root)
      .map(([k, v]) => `${k.toString()}=${v.toString()}`)
      .join(`&`)
  }

  append(name: string, value: BasicType) {
    this._root.set(name, value)
  }
}

/**
 * # 将多个对象转换为 URLSearchParams 格式的字符串
 * @param cards 需转换对象
 */
export function encodeQueryParam(...cards: nilpt<object>[]): string {
  const params = new SearchParam()
  if (!cards) return ''
  cards.filter(isNonNil).forEach(c => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonNil(v))
      .map(([k, v]) => [k, isNonNilString(v as string) ? encodeURIComponent(v as string) : v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
      .forEach(([k, v]) => params.append(encodeURIComponent(k as string), v as string))
  })
  return params.toString() && `?${params.toString()}`
}

export function queryParam(...cards: nilpt<object>[]): string {
  const params = new SearchParam()
  if (!cards) return ''
  cards.filter(isNonNil).forEach(c => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonNil(v))
      .map(([k, v]) => [k, v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.filter(isNonNil).join(',') : v])
      .forEach(([k, v]) => params.append(k as string, v as string))
  })
  return params.toString() && `?${params.toString()}`
}

export function queryHash(...cards: nilpt<object>[]): string {
  const qp = queryParam(...cards)
  return qp ? `#${qp.slice(1)}` : ''
}

export function decodeHash(hash?: string): Record<string, string> {
  if (hash) {
    return hash
      .replace(/^#/, '')
      .split('&')
      .map(s => s.split('='))
      .reduce(
        (acc, [k, v]) => {
          acc[k] = v
          return acc
        },
        {} as Record<string, string>
      )
  } else return {}
}
