import type {EnumActual, EnumCommentMap, Evr} from '@/types'

interface Pair<K extends string | number | symbol, V extends string | number> {
  k: K
  v: V
}

export function findEnumValue<E extends EnumActual, K extends Evr<E>>(e: E, key: K): E[K] {
  return e[key]
}

export function findEnumComment<E extends EnumActual, K extends Evr<E>>(key: K, comments: EnumCommentMap<E>): string {
  return comments[key]
}

export function enumCommentToPairArray<EA extends EnumActual, EM extends EnumCommentMap<EA>>(a: EM): Pair<string, number>[] {
  return Object.entries(a).map(([v, k]) => {
    return {k, v: Number(v)}
  })
}

interface EnumToOutputReturn<T extends EnumActual> {
  comment: Record<Evr<T>, string>
  map: Record<Evr<T>, Evr<T>>
  reverseMap: Record<Evr<T>, T>
}

export function enumToOutput<E extends EnumActual>(e: E, comment: Record<Evr<E>, string>): EnumToOutputReturn<E> {
  const map = {} as unknown as Record<Evr<E>, Evr<E>>
  const reverseMap = {} as unknown as Record<Evr<E>, E>
  for (const key in e) {
    if (!isNaN(Number(key))) {
      const k = key as unknown as Evr<E>
      map[k] = Number(k) as unknown as Evr<E>
      reverseMap[k] = Number(k) as unknown as E
    }
  }
  return {comment, map, reverseMap}
}

export function enumValues<E extends EnumActual>(e: E): Evr<E>[] {
  const _keyCache = new Set<string | number>()
  const _vals: Evr<E>[] = []
  Object.entries(e).forEach(([k, v]) => {
    _keyCache.add(k)
    const vIsNumber = typeof v === 'number' || v?.toString().match(/^[0-9]+$/)
    if (vIsNumber) _vals.push(v as unknown as Evr<E>)
    else {
      if (e[v] === void 0 && !_keyCache.has(v)) _vals.push(v as unknown as Evr<E>)
    }
  })
  return _vals
}
