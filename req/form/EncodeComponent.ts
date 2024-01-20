import type {BasicType, nullpt} from '@compose/api-types'
import {isNonEmpty, isNonEmptyString} from '@compose/api-model'

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
export function encodeQueryParam(...cards: nullpt<object>[]): string {
  const params = new SearchParam()
  if (!cards) return ''
  cards.filter(isNonEmpty).forEach(c => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonEmpty(v))
      .map(([k, v]) => [k, isNonEmptyString(v as string) ? encodeURIComponent(v as string) : v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
      .forEach(([k, v]) => params.append(encodeURIComponent(k as string), v as string))
  })
  return params.toString() && `?${params.toString()}`
}

export function queryParam(...cards: nullpt<object>[]): string {
  const params = new SearchParam()
  if (!cards) return ''
  cards.filter(isNonEmpty).forEach(c => {
    Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => isNonEmpty(v))
      .map(([k, v]) => [k, v])
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
      .forEach(([k, v]) => params.append(k as string, v as string))
  })
  return params.toString() && `?${params.toString()}`
}
